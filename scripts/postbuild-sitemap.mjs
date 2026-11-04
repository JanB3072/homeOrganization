// Post-build step: rename @astrojs/sitemap output into the conventional
// sitemap.xml (index) + sitemap-1.xml, sitemap-2.xml ... (1-based chunks).
// The integration always emits sitemap-index.xml + sitemap-0.xml; we shift
// the chunk numbering by +1 and promote the index to sitemap.xml so the
// filenames match what's expected, while keeping automatic route discovery.
import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'sitemap-index.xml');

if (!existsSync(indexPath)) {
  console.log('[sitemap] no sitemap-index.xml found, skipping rename');
  process.exit(0);
}

let index = readFileSync(indexPath, 'utf8');

// Find chunk references like <loc>https://.../sitemap-0.xml</loc>
const chunkRefs = [
  ...index.matchAll(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/g),
].map((m) => m[1]);

for (const ref of chunkRefs) {
  const m = ref.match(/sitemap-(\d+)\.xml$/);
  if (!m) continue;
  const oldNum = parseInt(m[1], 10);
  const newRef = `sitemap-${oldNum + 1}.xml`;
  const oldPath = path.join(distDir, ref);
  const newPath = path.join(distDir, newRef);
  if (existsSync(oldPath)) {
    renameSync(oldPath, newPath);
    index = index.split(ref).join(newRef);
  }
}

writeFileSync(path.join(distDir, 'sitemap.xml'), index, 'utf8');
unlinkSync(indexPath);

console.log('[sitemap] wrote sitemap.xml (index) + sitemap-1.xml (chunk)');
