import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = join(ROOT, 'scripts', 'push-queue.json');
const LOG = join(ROOT, 'scripts', 'scheduled-push.log');
const TASK_NAME = 'HomeOrg-30min-Push';

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  try {
    appendFileSync(LOG, line + '\n', 'utf8');
  } catch {}
}

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  }).trim();
}

function save(queue) {
  writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + '\n', 'utf8');
}

function disableTask() {
  try {
    execFileSync('schtasks', ['/change', '/tn', TASK_NAME, '/disable'], { stdio: 'ignore' });
    log('队列已清空，计划任务已自动停用');
  } catch {
    log(`计划任务停用失败，请手动执行: schtasks /change /tn ${TASK_NAME} /disable`);
  }
}

function pushWithRetry(queue) {
  const remote = queue.remote || 'origin';
  const branch = queue.branch || 'main';
  try {
    git(['push', remote, branch]);
  } catch (error) {
    log(`push 失败，rebase 后重试一次: ${String(error.stderr || error.message).trim().slice(0, 200)}`);
    git(['pull', '--rebase', remote, branch]);
    git(['push', remote, branch]);
  }
}

function fail(queue, entry, index, total, message) {
  entry.attempts = (entry.attempts || 0) + 1;
  entry.error = String(message).slice(0, 500);
  save(queue);
  log(`第 ${index + 1}/${total} 篇失败（第 ${entry.attempts} 次）: ${entry.error}`);
  process.exitCode = 1;
}

function main() {
  if (!existsSync(QUEUE)) {
    log('队列文件不存在，跳过');
    return;
  }

  const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
  const total = queue.entries.length;
  const index = queue.entries.findIndex((entry) => entry.status === 'pending');

  if (index === -1) {
    log(total ? `全部 ${total} 篇已推送完毕` : '队列为空，本次不执行任何 git 操作');
    if (total) disableTask();
    return;
  }

  const entry = queue.entries[index];
  log(`开始第 ${index + 1}/${total} 篇: ${entry.slug}`);

  const missing = entry.files.filter((file) => !existsSync(resolve(ROOT, file)));
  if (missing.length) {
    fail(queue, entry, index, total, `文件缺失: ${missing.join(', ')}`);
    return;
  }

  const preStaged = git(['diff', '--cached', '--name-only']);
  if (preStaged) {
    fail(queue, entry, index, total, '暂存区已有其他改动，为避免误提交而中止');
    return;
  }

  try {
    git(['add', '--', ...entry.files]);
    const staged = git(['diff', '--cached', '--name-only']);
    if (staged) {
      git(['commit', '-m', entry.message || `新增文章: ${entry.slug}`]);
    }

    const unpushed = Number(
      git(['rev-list', '--count', `${queue.remote || 'origin'}/${queue.branch || 'main'}..HEAD`]),
    );

    if (staged || unpushed > 0) {
      pushWithRetry(queue);
    } else {
      log('目标文件无变更，直接标记为已完成');
    }

    entry.status = 'done';
    entry.pushedAt = new Date().toISOString();
    entry.error = null;
    save(queue);
    log(`第 ${index + 1}/${total} 篇推送完成`);
  } catch (error) {
    fail(queue, entry, index, total, error.stderr || error.message || error);
    return;
  }

  if (queue.entries.every((item) => item.status === 'done')) disableTask();
}

main();
