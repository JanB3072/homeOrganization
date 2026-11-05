// Validate blog frontmatter so a broken batch edit can never silently
// break `npm run build` again. Run via `npm run check`.
//
// Failures (exit 1): unparseable YAML, duplicate top-level keys, non-boolean
// draft/featured, malformed or missing image file, orphan image-path lines.
// Warnings (non-fatal): posts with no image configured.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const blogDir = path.resolve('src/content/blog');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));

const imagePathRe = /\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i;
const orphanRe = /^\s*\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)\s*$/i;
const topKeyRe = /^([A-Za-z0-9_-]+):/; // top-level key (no leading whitespace)

let failures = 0;
const warnings = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    console.log(`✗ ${file}: no frontmatter block`);
    failures++;
    continue;
  }
  const fm = m[1];
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
    warnings.push(file);
  }
}

console.log('');
if (failures > 0) {
  console.log(`✗ ${failures} failure(s). Run \`npm run build\` to confirm.`);
  process.exit(1);
} else {
  console.log(`✓ All ${files.length} posts passed frontmatter checks.`);
  if (warnings.length) {
    console.log(`  (${warnings.length} post(s) have no image configured — not an error, but consider adding one.)`);
  }
}
