// 校验文章 frontmatter、写作规范、内链、分类接线，以及构建产物里的链接与 head 标记。
// `npm run check` 单独运行；`npm run build` 结束后也会自动跑一次。
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const blogDir = path.resolve('src/content/blog');
const pagesDir = path.resolve('src/pages');
const distDir = path.resolve('dist');
const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')).sort();
const slugs = new Set(files.map((f) => f.replace(/\.md$/, '')));

const slugify = (value) => String(value).trim().toLowerCase().replace(/\s+/g, '-');
const imagePathRe = /\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/i;
const orphanRe = /^\s*\.\/images\/[\w.-]+\.(?:jpg|jpeg|png|webp)\s*$/i;
const topKeyRe = /^([A-Za-z0-9_-]+):/;
const linkRe = /\]\((\/[^)\s]*)\)/g;

// 去 AI 化：破折号零容忍；词表只收明显套话，不收 "perfect for" 之类正常口语。
const aiPhraseRe = /\b(delve|robust|crucial|leverage|seamless|effortless|in conclusion|furthermore|moreover|it is important to note|in today's|bottom line|read our comprehensive|discover exactly|explore these|game-changer|navigate the complex)\b/i;

function pageExists(url) {
  const segs = url.split('/').filter(Boolean);
  if (segs.length === 0) return fs.existsSync(path.join(pagesDir, 'index.astro'));
  const base = path.join(pagesDir, ...segs);
  if (fs.existsSync(base + '.astro')) return true;
  if (fs.existsSync(path.join(base, 'index.astro'))) return true;
  const parent = path.join(pagesDir, ...segs.slice(0, -1));
  if (!fs.existsSync(parent)) return false;
  return fs.readdirSync(parent).some((f) => /^\[.*\]\.astro$/.test(f));
}

let failures = 0;
const fail = (message) => { console.log(`✗ ${message}`); failures++; };
const warnings = [];
const warn = (message) => warnings.push(message);

const tagSlugs = new Map();
const linksByFile = new Map();
const categoryByFile = new Map();
const titleOwners = new Map();
const descOwners = new Map();
const now = Date.now();

for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) { fail(`${file}: no frontmatter block`); continue; }
  const fm = m[1];
  const lines = fm.split(/\r?\n/);

  // 1) 重复顶层 key（js-yaml 会静默覆盖，手工扫一遍）。
  const seen = new Set();
  for (const line of lines) {
    const k = line.match(topKeyRe);
    if (!k) continue;
    if (seen.has(k[1])) fail(`${file}: duplicate key "${k[1]}"`);
    seen.add(k[1]);
  }

  // 2) YAML 解析。
  let data;
  let body;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    body = parsed.content;
  } catch (e) {
    fail(`${file}: YAML parse error — ${e.message}`);
    continue;
  }

  categoryByFile.set(file, data);

  // 3) 标题、描述不得重复。
  for (const [map, value, label] of [
    [titleOwners, data.title, 'title'],
    [descOwners, data.description, 'description'],
  ]) {
    if (!value) { fail(`${file}: missing ${label}`); continue; }
    const owners = map.get(value) || [];
    if (owners.length) fail(`${file}: duplicate ${label} with ${owners[0]}`);
    owners.push(file);
    map.set(value, owners);
  }

  // 4) 布尔字段。
  for (const key of ['draft', 'featured']) {
    if (data[key] !== undefined && typeof data[key] !== 'boolean') {
      fail(`${file}: "${key}" must be boolean, got ${JSON.stringify(data[key])}`);
    }
  }

  // 5) 日期：updatedDate 不能早于 pubDate；未来 pubDate 只提醒（属于排期）。
  const pub = new Date(data.pubDate);
  if (Number.isNaN(pub.getTime())) fail(`${file}: invalid pubDate`);
  if (data.updatedDate && new Date(data.updatedDate) < pub) {
    fail(`${file}: updatedDate is earlier than pubDate`);
  }
  if (pub.getTime() > now) warn(`${file}: pubDate ${pub.toISOString().slice(0, 10)} is scheduled`);

  // 6) 去 AI 化。
  if (/—/.test(body)) fail(`${file}: em dash in body`);
  if (aiPhraseRe.test(body) || aiPhraseRe.test(String(data.description || ''))) {
    fail(`${file}: AI boilerplate phrase`);
  }

  // 7) 孤立图片路径行。
  const orphans = lines.filter((l) => orphanRe.test(l));
  if (orphans.length) fail(`${file}: orphan image path line(s): ${orphans.join(' | ')}`);

  // 8) 图片路径与文件。
  if (data.image !== undefined) {
    const v = String(data.image);
    if (!imagePathRe.test(v)) fail(`${file}: image path malformed — "${v}"`);
    else if (!fs.existsSync(path.resolve(blogDir, v))) fail(`${file}: image file missing — ${v}`);
  } else {
    warn(`${file}: no image configured`);
  }

  // 9) GEO 结构与字数。
  if (!data.takeaways?.length) warn(`${file}: no takeaways`);
  if (!data.howTo?.length) warn(`${file}: no howTo`);
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words < 900) warn(`${file}: ${words} words`);

  // 10) 标签：记录 slug，检测不同写法撞到同一个路由。
  (data.tags || []).forEach((t) => {
    const s = slugify(t);
    if (!tagSlugs.has(s)) tagSlugs.set(s, new Set());
    tagSlugs.get(s).add(t);
  });

  // 11) 正文内链。
  const links = [...raw.matchAll(linkRe)].map((x) => x[1]);
  linksByFile.set(file, links);
  if (links.length === 0) fail(`${file}: no internal links at all`);
  else if (links.length < 11 || links.length > 16) warn(`${file}: ${links.length} internal links (recommended 11–16)`);
}

for (const [slug, names] of tagSlugs) {
  if (names.size > 1) fail(`tag slug collision: /tags/${slug}/ <- ${[...names].join(' + ')}`);
}

// 12) 每条内链都要落到真实文章、标签或页面。
let linkCount = 0;
for (const [file, links] of linksByFile) {
  for (const url of links) {
    linkCount++;
    const blogMatch = url.match(/^\/blog\/([^/]+)\/?$/);
    const tagMatch = url.match(/^\/tags\/([^/]+)\/?$/);
    let ok;
    if (blogMatch) ok = slugs.has(blogMatch[1]);
    else if (tagMatch) ok = tagSlugs.has(tagMatch[1]);
    else ok = pageExists(url);
    if (!ok) fail(`${file}: broken link -> ${url}`);
  }
}

// 13) 分类与子分类落地页。
for (const [file, data] of categoryByFile) {
  const cat = slugify(data.category || '');
  if (cat && !pageExists(`/${cat}/`)) fail(`${file}: no landing page for category "${data.category}"`);
  const sub = slugify(data.subcategory || '');
  if (cat && sub && !pageExists(`/${cat}/${sub}/`)) warn(`${file}: no landing page for subcategory "${data.subcategory}"`);
}

// 14) UI 模板文案同样不许出现破折号和机械套话。
const uiFiles = [];
const walkAstro = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkAstro(abs);
    else if (entry.name.endsWith('.astro')) uiFiles.push(abs);
  }
};
walkAstro(path.resolve('src'));
const uiBoilerplateRe = /—|Check back soon|Browse all|Explore our|Try searching for|No articles found|No results found|Read our comprehensive|Discover exactly|Explore these|Bottom line/i;
for (const abs of uiFiles) {
  if (uiBoilerplateRe.test(fs.readFileSync(abs, 'utf8'))) {
    fail(`${path.relative('.', abs).replace(/\\/g, '/')}: UI boilerplate or em dash`);
  }
}

// 15) 构建产物：href 是否都能打开、canonical/prev/next 是否只在 head 里一份。
if (fs.existsSync(distDir)) {
  const built = new Set(['/']);
  const htmlFiles = [];
  const collect = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const r = `${rel}/${entry.name}`;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (fs.existsSync(path.join(abs, 'index.html'))) built.add(r + '/');
        collect(abs, r);
      } else {
        built.add(r);
        if (entry.name === 'index.html') built.add(rel + '/');
        else if (entry.name.endsWith('.html')) built.add(r.replace(/\.html$/, '') + '/');
        if (entry.name.endsWith('.html')) htmlFiles.push(abs);
      }
    }
  };
  collect(distDir, '');

  const brokenHrefs = new Map();
  for (const abs of htmlFiles) {
    const html = fs.readFileSync(abs, 'utf8');
    const rel = path.relative(distDir, abs).replace(/\\/g, '/');

    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      const url = match[1].split(/[?#]/)[0];
      if (!built.has(url) && !built.has(url.replace(/\/$/, '') + '/')) {
        if (!brokenHrefs.has(url)) brokenHrefs.set(url, rel);
      }
    }

    if ((html.match(/rel="canonical"/g) || []).length > 1) fail(`${rel}: more than one canonical tag`);
    const headEnd = html.indexOf('</head>');
    if (headEnd > -1 && html.slice(headEnd).includes('rel="canonical"')) fail(`${rel}: canonical tag outside <head>`);
    if (/Organizing Small \| Organizing Small/i.test(html)) fail(`${rel}: duplicated brand suffix in <title>`);
  }
  for (const [url, rel] of brokenHrefs) fail(`dist: broken href ${url} (e.g. ${rel})`);

  const feedJson = path.join(distDir, 'feed.json');
  if (fs.existsSync(feedJson) && fs.readFileSync(feedJson, 'utf8').includes('fsPath')) {
    fail('dist/feed.json leaks local fsPath');
  }
  const sitemap = path.join(distDir, 'sitemap-1.xml');
  if (fs.existsSync(sitemap)) {
    const locs = fs.readFileSync(sitemap, 'utf8');
    if (/organizingsmall\.com\/(?:bathroom|closet|declutter|guides|kitchen|small-space)\/1\//.test(locs)) {
      fail('dist/sitemap-1.xml contains duplicate /<category>/1/ pages');
    }
  }
}

console.log('');
console.log(`  ${files.length} posts, ${linkCount} internal links checked.`);
if (failures > 0) {
  console.log(`✗ ${failures} failure(s).`);
  process.exit(1);
}
console.log(`✓ All ${files.length} posts passed content, link and build-output checks.`);
if (warnings.length) {
  console.log(`  (${warnings.length} non-fatal note(s))`);
  for (const w of warnings) console.log(`  • ${w}`);
}
