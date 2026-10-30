# 快速启动指南

你的 Astro 居家收纳博客已准备就绪！

## ✅ 已完成

- ✓ Astro 项目初始化
- ✓ 5 个主分类页面（厨房、衣柜、浴室、小空间、断舍离）
- ✓ 响应式布局和基础样式
- ✓ Markdown 内容系统
- ✓ 依赖安装完成
- ✓ 项目构建测试通过

## 🚀 第一步：本地预览

运行开发服务器：
```bash
npm run dev
```

然后打开浏览器访问：`http://localhost:3000`

按 `q + Enter` 停止服务器。

## 📝 第二步：自定义网站

### 2.1 修改基本信息

**编辑文件**：`astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://example.com', // ← 改成你的域名
  // ...
});
```

### 2.2 修改首页文案

**编辑文件**：`src/pages/index.astro`

找到这一段，替换为你的真实信息：
```astro
<p>我是 __，住在 __ 的 __㎡ 公寓。这个博客记录我怎么把家收纳到能住得下去的真实故事。</p>
```

### 2.3 修改导航和页脚

**编辑文件**：`src/layouts/BaseLayout.astro`

在 `<nav>` 和 `<footer>` 中修改内容。

### 2.4 修改 About 页面

**编辑文件**：`src/pages/about.astro`

根据你的实际情况填写个人介绍。

## ✍️ 第三步：写第一篇文章

### 3.1 创建文章文件

在 `src/content/blog/` 目录创建新文件，例如：
```
src/content/blog/my-first-post.md
```

### 3.2 使用这个模板

```markdown
---
title: "我的第一篇文章"
description: "简短的描述，用于 SEO 和预览"
pubDate: 2024-01-20
category: "Kitchen"    # 或其他分类
tags: ["tag1", "tag2"]
image: "/assets/images/my-photo.jpg"
---

## 第一个小标题

文章内容从这里开始...

## 第二个小标题

继续写...
```

### 3.3 发布文章

将图片放在 `public/assets/images/` 目录，然后在 frontmatter 中引用即可。

## 🎨 第四步：优化样式（可选）

现在的样式很基础。如果想要更好看的设计，可以：

1. **安装 Tailwind CSS**：
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **或者手动编写 CSS**：在各个 `.astro` 文件的 `<style>` 标签中自定义样式。

## 🔗 第五步：配置分析和 SEO

### 5.1 添加 Google Analytics

在 `src/layouts/BaseLayout.astro` 的 `<head>` 中添加：
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 5.2 提交 Google Search Console

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加你的网站
3. 上传 HTML 验证文件

## 📦 部署

当内容准备好后，部署到互联网：

### 部署到 Netlify（推荐）

1. 推送代码到 GitHub
2. 访问 [Netlify](https://netlify.com)
3. 点击 "New site from Git"
4. 选择 GitHub 仓库
5. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 自动部署完成！

### 部署到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置完成，自动部署！

### 部署到 GitHub Pages

在 `astro.config.mjs` 中设置：
```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/repository-name', // 如果repo名不是yourusername.github.io
  // ...
});
```

然后 push 代码，GitHub Actions 会自动构建和部署。

## 📚 后续步骤

1. **写 3-5 篇高质量文章**，建立初期内容基础
2. **设置 Pinterest 账号**，分享你的文章到 Pinterest
3. **建立邮件订阅**（可用 Buttondown、Substack 等）
4. **定期更新"Now"页面**，保持读者互动
5. **追踪数据**：Google Analytics、Google Search Console

## 🆘 常见问题

### Q: 本地预览显示 404？
A: 确保：
1. 运行了 `npm run dev`
2. 访问的是 `http://localhost:3000`（不是 `localhost:3000/dist`）
3. 没有拼写错误的文件路径

### Q: 文章不显示在首页？
A: 首页需要手动配置显示最新文章。这需要使用 Astro 的 Content Collections API（等下一个版本实现）。

### Q: 如何添加新分类？
A: 
1. 在 `src/pages/` 创建新文件夹，例如 `src/pages/my-category/`
2. 创建 `index.astro` 文件，参考其他分类页面
3. 在 `BaseLayout.astro` 中更新导航菜单

### Q: 怎样修改颜色和字体？
A: 编辑 `src/layouts/BaseLayout.astro` 中的 `<style is:global>` 部分。

## 📖 进阶

- [Astro 官方文档](https://docs.astro.build)
- [Markdown 语法](https://www.markdownguide.org/)
- [SEO 最佳实践](https://moz.com/beginners-guide-to-seo)

## 需要帮助？

- 查看现有的示例文件：`src/content/blog/example.md`
- 参考规划文档：`居家收纳博客-站点结构与内容规划.md`

祝你博客顺利开张！📝✨
