import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 文章页的 lastmod 取内容自己的日期。排期文章晚于构建时刻，按构建时刻算，
// 因为静态页是在这一次构建里才出现的。列表页没有可信的变更时间，留空。
const blogDir = path.resolve('src/content/blog');
const buildTime = Date.now();
const postLastmod = new Map();

for (const name of fs.readdirSync(blogDir).filter((n) => n.endsWith('.md'))) {
  const data = matter(fs.readFileSync(path.join(blogDir, name), 'utf8')).data;
  if (data.draft) continue;
  const date = new Date(data.updatedDate || data.pubDate);
  if (Number.isNaN(date.getTime())) continue;
  postLastmod.set(
    `/blog/${name.replace(/\.md$/, '')}/`,
    new Date(Math.min(date.getTime(), buildTime)).toISOString()
  );
}

export default defineConfig({
  site: 'https://organizingsmall.com',
  base: '/',
  build: {
    assets: 'assets',
  },
  output: 'static',
  image: {
    format: 'webp',
    quality: 75,
  },
  prefetch: true,
  devToolbar: {
    enabled: false,
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/tags/') &&
        !page.includes('/search/') &&
        !page.includes('/now/') &&
        !page.includes('/privacy/') &&
        !page.includes('/affiliate-disclosure/'),
      serialize: (item) => {
        const pathname = item.url.replace(/^https?:\/\/[^/]+/, '') || '/';
        const lastmod = postLastmod.get(pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
