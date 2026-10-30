# 居家收纳个人博客

一个用 Astro 搭建的个人博客，记录真实的居家收纳故事。

## 项目结构

```
├── src/
│   ├── layouts/          # 页面布局组件
│   │   ├── BaseLayout.astro      # 基础布局
│   │   └── PostLayout.astro      # 文章布局
│   ├── pages/            # 页面（自动路由）
│   │   ├── index.astro           # 首页
│   │   ├── about.astro           # 关于页
│   │   ├── kitchen/              # 厨房分类
│   │   ├── closet/               # 衣柜分类
│   │   ├── bathroom/             # 浴室分类
│   │   ├── small-space/          # 小空间分类
│   │   └── declutter/            # 断舍离分类
│   └── content/          # Markdown 内容
│       ├── blog/                 # 博客文章
│       ├── resources/            # 资源（尺寸表等）
│       └── now.md                # Now 页面内容
├── public/               # 静态资源
├── astro.config.mjs      # Astro 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 本地开发
```bash
npm run dev
```
访问 `http://localhost:3000` 查看网站

### 3. 构建生产版本
```bash
npm run build
```

### 4. 预览构建结果
```bash
npm run preview
```

## 文章写作规范

### 新建文章

1. 在 `src/content/blog/` 目录创建 `.md` 文件
2. 使用以下 frontmatter 格式：

```markdown
---
title: "文章标题"
description: "简短描述（SEO 用）"
pubDate: 2024-01-15
category: "Kitchen"    # 分类名
tags: ["tag1", "tag2"]
image: "/assets/images/example.jpg"
---

# 文章内容从这里开始

...
```

### 文章长度建议

- 记录型/改造型：900-1500 字
- 清单型/方法型：700-1200 字

### 每篇文章必须包含

- [ ] 具体、个人化的 H1 标题
- [ ] 首段结论（2-4 句）
- [ ] 1 张主图
- [ ] 3-8 张过程照片
- [ ] 实测数据（尺寸、花费、时长）
- [ ] 内链（相关文章、分类、资源）
- [ ] 更新日期

## 分类说明

### 五大分类

| 分类 | 路由 | 子分类 |
|-----|------|--------|
| 厨房 | `/kitchen/` | Pantry, Fridge, Cabinets |
| 衣柜 | `/closet/` | Closet, Bedroom |
| 浴室 | `/bathroom/` | Vanity, Small Bathroom |
| 小空间 | `/small-space/` | Apartment, Rental-Friendly |
| 断舍离 | `/declutter/` | Declutter, Routines, Moving |

### Series（系列）

正在规划的系列内容：
- My Home, Room by Room
- One Shelf at a Time
- The 12-Month Reset
- Renter Diaries（可选）

## SEO 优化

- [x] 自动生成 `sitemap.xml`
- [x] Canonical 标签
- [x] 结构化数据（Schema.org）
- [ ] 图片懒加载（待实现）
- [ ] WebP 转换（待实现）

## 部署

### 推荐平台

- **Netlify**：免费、自动 CI/CD、自定义域名
- **Vercel**：快速、集成良好
- **GitHub Pages**：完全免费

### 部署步骤（以 Netlify 为例）

1. 推送代码到 GitHub
2. 在 Netlify 连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`
5. 自动部署完成

## 变现计划

### 第一年目标
- 建立 3-5 个核心读者社群
- 发布 30-35 篇高质量文章
- 测试 Amazon Associates 联盟链接

### 第二年目标
- Pinterest 引流优化
- 邮件订阅达 500+
- 月 PV 达 5,000+

### 第三年目标
- 品牌合作机会
- 月均收入 $100+

## 常见问题

### Q: 如何添加新的分类？
A: 在 `src/pages/` 创建新文件夹，添加 `index.astro`

### Q: 如何修改网站标题和描述？
A: 编辑 `BaseLayout.astro` 和 `astro.config.mjs`

### Q: 图片应该放在哪里？
A: 放在 `public/assets/images/` 目录，引用时用 `/assets/images/filename.jpg`

### Q: 如何添加 Google Analytics？
A: 在 `BaseLayout.astro` 的 `<head>` 中添加 GA 脚本

## 许可证

MIT

## 更新日志

### v0.1.0 (2024-01)
- 初始项目结构
- 5 个主分类页面
- 基础布局和样式

## 联系方式

Email: [your-email@example.com](mailto:your-email@example.com)
