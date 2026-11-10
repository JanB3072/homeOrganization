// 把 @astrojs/sitemap 输出的 sitemap-index.xml + sitemap-0.xml ... 改成
// 约定的 sitemap.xml（索引）+ sitemap-1.xml ...（分块从 1 开始）。
import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'sitemap-index.xml');

if (!existsSync(indexPath)) {
  console.log('[sitemap] no sitemap-index.xml found, skipping rename');
  process.exit(0);
}

let index = readFileSync(indexPath, 'utf8');

const chunkRefs = [...new Set(
  [...index.matchAll(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/g)].map((m) => m[1])
)];

const renames = chunkRefs
  .map((ref) => {
    const m = ref.match(/sitemap-(\d+)\.xml$/);
    if (!m) return null;
    const oldPath = path.join(distDir, ref);
    if (!existsSync(oldPath)) return null;
    return { ref, oldPath, newRef: `sitemap-${parseInt(m[1], 10) + 1}.xml` };
  })
  .filter(Boolean);

// 两阶段重命名：先全部挪到临时名，否则 0→1 会覆盖原本的 sitemap-1.xml。
const temps = renames.map((_, i) => path.join(distDir, `sitemap.tmp-${i}.xml`));
renames.forEach((r, i) => renameSync(r.oldPath, temps[i]));
renames.forEach((r, i) => renameSync(temps[i], path.join(distDir, r.newRef)));

// 一次性替换索引里的引用，避免串行替换把刚生成的新名字又改一遍。
const refMap = new Map(renames.map((r) => [r.ref, r.newRef]));
index = index.replace(/sitemap-\d+\.xml/g, (m) => refMap.get(m) ?? m);

writeFileSync(path.join(distDir, 'sitemap.xml'), index, 'utf8');
unlinkSync(indexPath);

console.log(`[sitemap] wrote sitemap.xml (index) + ${renames.length} chunk(s)`);
