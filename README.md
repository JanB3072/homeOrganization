# Organizing Small

一个 Astro 4 静态博客，写小户型收纳。文章基于芝加哥一间 580 平方英尺的战前公寓实测，配尺寸、花费和照片。站点域名 `https://organizingsmall.com`，作者署名 Clara。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # 只跑内容校验
npm run build      # 构建 + sitemap 重命名 + 内容/产物校验
npm run preview    # 预览 dist/
```

`npm run build` 结束会自动执行 `scripts/check-content.mjs`，校验失败会让构建以非零状态退出。

## 目录

```
src/
├── content/
│   ├── config.ts          # frontmatter 的 zod schema
│   └── blog/              # 文章 .md 与 images/ 配图
├── layouts/               # BaseLayout / PostLayout / SubcategoryLayout
├── components/            # 卡片、分页、面包屑、作者信息等
├── pages/                 # 文件路由；分类、标签、分页、feed 端点
└── utils/
    ├── content.ts         # 文章查询、分页、相关文章、归档
    ├── slugs.ts           # 所有 URL 片段与链接的唯一生成入口
    └── hubIntro.ts        # 子分类页导语
scripts/
├── check-content.mjs      # frontmatter / 内链 / 去 AI 化 / dist 产物校验
├── postbuild-sitemap.mjs  # sitemap-index.xml → sitemap.xml + sitemap-N.xml
├── scheduled-push.mjs     # 定时提交并推送一篇待发布文章
└── install-scheduled-push.ps1
public/                    # robots.txt、_headers、llms.txt、logo、实拍图
astro.config.mjs
wrangler.jsonc             # Cloudflare 静态部署，发布目录 ./dist
```

## 新增文章

在 `src/content/blog/` 里放 `<slug>.md`，配图放 `src/content/blog/images/`。`slug` 就是目标关键词，文件名决定 `/blog/<slug>/`。

```yaml
---
title: "文章标题"
description: "带具体数字或实测信息的描述"
pubDate: "2026-11-10T09:00:00-06:00"
category: "Kitchen"
subcategory: "Pantry"
tags: ["pantry organization", "kitchen-organization"]
keywords: ["主关键词", "长尾词"]
image: ./images/pantry-organization.png
imageAlt: "图片内容描述"
takeaways:
  - "可被引用的结论"
faq:
  - question: "读者会问什么？"
    answer: "直接回答。"
howTo:
  - name: "步骤名"
    text: "步骤说明。"
featured: false
draft: false
---
```

含冒号的值必须整串加引号。`category` 只能是 `Kitchen`、`Closet`、`Bathroom`、`Small Space`、`Declutter`、`Guides`。

`pubDate` 会原样写进页面、schema 和 feed，它只是内容元数据，不控制上线。上线由 `draft` 和 `scheduled-push.mjs` 的提交节奏决定；晚于构建时刻的 `pubDate` 会在校验里作为提醒列出。

sitemap 只给 `/blog/<slug>/` 写 `lastmod`，取 `updatedDate || pubDate`，晚于构建时刻的按构建时刻算。首页和列表页没有可信的变更时间，留空，不跟着每次部署跳到当天。空的 `/search/` 页不进 sitemap。

## 校验会拦下什么

`scripts/check-content.mjs` 的失败项：

- frontmatter 无法解析、重复顶层 key、`draft`/`featured` 非布尔、必填字段缺失
- 标题或描述与其他文章重复
- `updatedDate` 早于 `pubDate`
- 正文出现破折号 `—`，或出现 AI 套话词表里的表达（delve / seamless / in conclusion / bottom line / read our comprehensive 等）
- `.astro` 模板和 `scripts` 里的提示文案出现破折号或机械套话
- 图片路径格式错误、文件缺失、孤立的图片路径行
- 正文没有任何内链，或链接指向不存在的文章、标签、页面
- 不同标签写法撞到同一个 `/tags/<slug>/` 路由
- `dist/` 里出现打不开的站内 `href`、多余的 canonical、body 内的 canonical、重复的 `| Organizing Small` 标题后缀
- `feed.json` 泄漏本地绝对路径、sitemap 收录 `/<category>/1/` 重复页或空的 `/search/` 页
- sitemap 完全没有 `lastmod`，或出现晚于构建时刻的 `lastmod`

非致命提醒：内链数不在 11–16 区间、缺 `takeaways`/`howTo`、正文不足 900 词、缺配图、子分类没有落地页、`pubDate` 属于排期、没有其他文章链过来的孤岛页（会打印文件名清单）。

## URL 规则

路由和链接一律走 `src/utils/slugs.ts` 的 `slugify()`、`tagUrl()`、`categoryUrl()`、`postUrl()`。规则是小写加空白转连字符，改它等于改已发布的 URL，需要同步做重定向。

分页从第 2 页开始，第 1 页由各分类的 `index.astro` 承担；canonical、prev、next 只由 `BaseLayout` 在 `<head>` 里输出一次。`Pagination` 只接受 `currentPage`、`totalPages`、`baseUrl`。

## 部署

静态输出 `dist/`，`wrangler.jsonc` 指向该目录；也可用于任意静态托管。构建命令 `npm run build`，发布目录 `dist`。`public/_headers` 提供 HSTS、CSP 等响应头，`public/robots.txt` 指向 `/sitemap.xml`。

## 联系

hello@organizingsmall.com
