import { appendFileSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOG = join(ROOT, 'scripts', 'scheduled-push.log');
const REMOTE = 'origin';
const BRANCH = 'main';

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

function gitList(args) {
  const out = git(args);
  return out ? out.split('\n').map((s) => s.trim()).filter(Boolean) : [];
}

function pushWithRetry() {
  try {
    git(['push', REMOTE, BRANCH]);
  } catch (error) {
    log(`push 失败，rebase 后重试: ${String(error.stderr || error.message).trim().slice(0, 200)}`);
    git(['pull', '--rebase', REMOTE, BRANCH]);
    git(['push', REMOTE, BRANCH]);
  }
}

function extractImages(text) {
  const out = [];
  let m;
  const md = /!\[[^\]]*\]\(([^)\s]+)\)/g;
  while ((m = md.exec(text))) out.push(m[1]);
  const html = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((m = html.exec(text))) out.push(m[1]);
  const fm = /^\s*(?:image|cover|thumbnail|ogImage|hero)\s*:\s*['"]?([^'"\n#]+)/gim;
  while ((m = fm.exec(text))) out.push(m[1].trim());
  return out;
}

function main() {
  const preStaged = gitList(['diff', '--cached', '--name-only']);
  if (preStaged.length) {
    log(`暂存区已有其他改动，中止以避免误提交: ${preStaged.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const unpushed = Number(git(['rev-list', '--count', `${REMOTE}/${BRANCH}..HEAD`]));
  if (unpushed > 0) {
    log(`检测到 ${unpushed} 个未推送提交，先推送`);
    pushWithRetry();
    log('未推送提交已推送');
  }

  const newMd = gitList(['ls-files', '--others', '--exclude-standard', 'src/content/blog/**/*.md']);
  const modMd = gitList(['diff', '--name-only', '--', 'src/content/blog/**/*.md']);
  const newImgs = gitList([
    'ls-files', '--others', '--exclude-standard',
    'src/content/blog/**/*.{png,jpg,jpeg,webp,gif,svg}',
    'public/**/*.{png,jpg,jpeg,webp,gif,svg}',
  ]);
  const newImgsAbs = new Set(newImgs.map((f) => resolve(ROOT, f)));

  const allMd = [...new Set([...modMd, ...newMd])];
  if (allMd.length === 0) {
    log('没有待推送文章，跳过');
    return;
  }

  allMd.sort((a, b) => statSync(resolve(ROOT, a)).mtimeMs - statSync(resolve(ROOT, b)).mtimeMs);
  const target = allMd[0];
  const isNew = newMd.includes(target);
  const slug = target.split('/').pop().replace(/\.md$/, '');
  const mdAbs = resolve(ROOT, target);
  const mdDir = dirname(mdAbs);
  const content = readFileSync(mdAbs, 'utf8');

  const pics = [];
  for (const raw of extractImages(content)) {
    const clean = raw.trim();
    if (/^(https?:)?\/\//i.test(clean)) continue;
    if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(clean)) continue;
    const base = clean.replace(/^\//, '');
    const candidates = [
      resolve(mdDir, clean),
      resolve(ROOT, 'public', base),
      resolve(ROOT, 'src/content/blog', base),
      resolve(ROOT, base),
    ];
    for (const candidate of candidates) {
      if (newImgsAbs.has(candidate)) {
        pics.push(candidate);
        break;
      }
    }
  }
  const picsRel = [...new Set(pics)].map((p) => relative(ROOT, p));

  const addList = [target, ...picsRel];
  git(['add', '--', ...addList]);
  const staged = gitList(['diff', '--cached', '--name-only']);
  if (!staged.length) {
    log(`文章 ${slug} 无实际变更，跳过`);
    return;
  }

  const msg = `${isNew ? '新增文章' : '更新文章'}: ${slug}`;
  git(['commit', '-m', msg]);
  pushWithRetry();
  log(`已提交并推送 1 篇（${slug}），附带 ${picsRel.length} 个图片，本次 staged=${staged.length}`);
}

main();
