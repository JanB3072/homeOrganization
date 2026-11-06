// Validate blog frontmatter, internal links and category wiring so a broken
// batch edit can never silently break `npm run build` again. Run via `npm run check`.
//
// Failures (exit 1): unparseable YAML, duplicate top-level keys, non-boolean
// draft/featured, malformed or missing image file, orphan image-path lines,
// broken internal links, posts with no internal links, missing category page.
// Warnings (non-fatal): no image configured, subcategory without a landing page.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve('.');
const blogDir = path.resolve('src/content/blog');
const pagesDir = path.resolve('src/pages');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
const slugs = new Set(files.map((f) => f.replace(/\.md$/, '')));

const imagePathRe = /\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i;
const orphanRe = /^\s*\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)\s*$/i;
const topKeyRe = /^([A-Za-z0-9_-]+):/; // top-level key (no leading whitespace)
const linkRe = /\]\((\/[^)\s]*)\)/g;

function pageExists(url) {
  const segs = url.split('/').filter(Boolean);
  if (segs.length === 0) return fs.existsSync(path.join(pagesDir, 'index.astro'));
  const base = path.join(pagesDir, ...segs);
  if (fs.existsSync(base + '.astro')) return true;
  if (fs.existsSync(path.join(base, 'index.astro'))) return true;
  // Dynamic routes: last segment served by [page].astro / [slug].astro / [...slug].astro
  const parent = path.join(pagesDir, ...segs.slice(0, -1));
  if (!fs.existsSync(parent)) return false;
  return fs.readdirSync(parent).some((f) => /^\[.*\]\.astro$/.test(f));
}

let failures = 0;
const warnings = [];
const allTags = new Set();
const linksByFile = new Map();
const categoryByFile = new Map();

for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    console.log(`✗ ${file}: no frontmatter block`);
    failures++;
    continue;
  }
  const fm = m[1];
  const body = raw.slice(m[0].length);
  const lines = fm.split(/\r?\n/);

  // 1) Duplicate top-level keys (js-yaml silently overwrites, so scan manually).
  const seen = new Set();
  for (const line of lines) {
    const k = line.match(topKeyRe);
    if (!k) continue;
    const key = k[1];
    if (seen.has(key)) {
      console.log(`✗ ${file}: duplicate key "${key}"`);
      failures++;
    }
    seen.add(key);
  }

  // 2) Parse with js-yaml.
  let data;
  try {
    data = yaml.load(fm);
  } catch (e) {
    console.log(`✗ ${file}: YAML parse error — ${e.message}`);
    failures++;
    continue;
  }

  (data.tags || []).forEach((t) => allTags.add(t));
  categoryByFile.set(file, data);

  // 3) Boolean fields.
  for (const key of ['draft', 'featured']) {
    if (data[key] !== undefined && typeof data[key] !== 'boolean') {
      console.log(`✗ ${file}: "${key}" must be boolean, got ${JSON.stringify(data[key])}`);
      failures++;
    }
  }

  // 4) Orphan image-path lines (no key prefix).
  const orphans = lines.filter((l) => orphanRe.test(l));
  if (orphans.length) {
    console.log(`✗ ${file}: orphan image path line(s): ${orphans.join(' | ')}`);
    failures++;
  }

  // 5) Image path format + existence.
  if (data.image !== undefined) {
    const v = String(data.image);
    if (!imagePathRe.test(v)) {
      console.log(`✗ ${file}: image path malformed — "${v}"`);
      failures++;
    } else if (!fs.existsSync(path.resolve(blogDir, v))) {
      console.log(`✗ ${file}: image file missing — ${v}`);
      failures++;
    }
  } else {
    warnings.push(`${file}: no image configured`);
  }

  // 6) Internal links in the article body (frontmatter links are counted too,
  //    since some posts link from their howTo text).
  const links = [...raw.matchAll(linkRe)].map((x) => x[1]);
  linksByFile.set(file, links);
  if (links.length === 0) {
    console.log(`✗ ${file}: no internal links at all`);
    failures++;
  }
}

// 7) Every link target must resolve to a real post, tag or page.
let linkCount = 0;
for (const [file, links] of linksByFile) {
  for (const url of links) {
    linkCount++;
    const blogMatch = url.match(/^\/blog\/([^/]+)\/?$/);
    const tagMatch = url.match(/^\/tags\/([^/]+)\/?$/);
    let ok;
    if (blogMatch) ok = slugs.has(blogMatch[1]);
    else if (tagMatch) ok = allTags.has(tagMatch[1]);
    else ok = pageExists(url);
    if (!ok) {
      console.log(`✗ ${file}: broken link -> ${url}`);
      failures++;
    }
  }
}

// 8) Category / subcategory pages must exist for the classification to work.
for (const [file, data] of categoryByFile) {
  const cat = String(data.category || '').toLowerCase().replace(/\s+/g, '-');
  if (cat && !pageExists(`/${cat}/`)) {
    console.log(`✗ ${file}: no landing page for category "${data.category}"`);
    failures++;
  }
  const sub = String(data.subcategory || '').toLowerCase().replace(/\s+/g, '-');
  if (cat && sub && !pageExists(`/${cat}/${sub}/`)) {
    warnings.push(`${file}: no landing page for subcategory "${data.subcategory}"`);
  }
}

console.log('');
console.log(`  ${files.length} posts, ${linkCount} internal links checked.`);
if (failures > 0) {
  console.log(`✗ ${failures} failure(s). Run \`npm run build\` to confirm.`);
  process.exit(1);
} else {
  console.log(`✓ All ${files.length} posts passed frontmatter, link and category checks.`);
  if (warnings.length) {
    console.log(`  (${warnings.length} non-fatal note(s): no image or no subcategory page.)`);
  }
}
