# 快速参考卡 - 常用命令和文件路径

## 🚀 最常用的三条命令

```bash
# 启动本地开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 你会频繁使用的文件路径

### 修改网站内容

| 要改什么 | 文件路径 |
|--------|--------|
| 网站域名 | `astro.config.mjs` 中的 `site` |
| 首页标题和文案 | `src/pages/index.astro` |
| 关于我页面 | `src/pages/about.astro` |
| 顶部导航菜单 | `src/layouts/BaseLayout.astro` 中的 `<nav>` |
| 页脚文案 | `src/layouts/BaseLayout.astro` 中的 `<footer>` |
| 全局颜色和字体 | `src/layouts/BaseLayout.astro` 中的 `<style is:global>` |

### 创建新内容

| 创建什么 | 在这里创建 | 创建后的 URL |
|--------|---------|-----------|
| 新博客文章 | `src/content/blog/my-article.md` | `/blog/my-article/` |
| 厨房子分类 | `src/pages/kitchen/pantry.astro` | `/kitchen/pantry/` |
| 衣柜子分类 | `src/pages/closet/closet.astro` | `/closet/closet/` |
| 新的资源页 | `src/content/resources/my-guide.md` | `/resources/my-guide/` |

### 添加资源

| 资源类型 | 放到这里 | 引用方式 |
|--------|--------|--------|
| 文章配图 | `public/assets/images/` | `/assets/images/photo.jpg` |
| 自定义 CSS | `public/assets/css/` | 在 HTML 中引入 |
| 字体文件 | `public/assets/fonts/` | 在 CSS 中引入 |
| 网站图标 | `public/favicon.svg` | 自动使用 |

## ✍️ 写文章的标准模板

```markdown
---
title: "文章的标题 - 长度建议不超过 60 字"
description: "短描述用于 SEO 和分享，建议 150-160 字符"
pubDate: 2024-01-20
category: "Kitchen"    # 必须是这几个之一：Kitchen, Closet, Bathroom, SmallSpace, Declutter
tags: ["tag1", "tag2"] # 可选，但建议加 3-5 个标签
image: "/assets/images/featured-image.jpg"
---

## 第一个小标题

你的文章内容从这里开始...

## 第二个小标题

继续你的故事...

## 结尾

总结或下一步...
```

## 🎯 最常见的编辑任务

### 任务 1: 改首页文案（3 分钟）

打开 → `src/pages/index.astro`

找到这一行：
```astro
<p>我是 __，住在 __ 的 __㎡ 公寓。这个博客记录我怎么把家收纳到能住得下去的真实故事。</p>
```

改为你的真实信息，例如：
```astro
<p>我是小明，住在北京的 65 平米公寓。这个博客记录我怎么通过收纳让家变得更舒适。</p>
```

### 任务 2: 写第一篇文章（20 分钟）

1. 创建文件：`src/content/blog/2024-01-20-my-pantry.md`

2. 复制这个框架：
```markdown
---
title: "我给深柜装了抽拉篮，3 个月后这样评价"
description: "实测体验 + 花费 + 是否后悔"
pubDate: 2024-01-20
category: "Kitchen"
tags: ["Pantry", "收纳", "DIY"]
image: "/assets/images/pantry-before.jpg"
---

## 为什么要改造

我家的深柜只有 30cm，难以使用...

## 解决方案

我选择了安装抽拉篮...

## 3 个月后的真实感受

结果如何...
```

3. 保存图片到 `public/assets/images/`

4. `npm run dev` 预览

### 任务 3: 改导航菜单（5 分钟）

打开 → `src/layouts/BaseLayout.astro`

找到 `<nav>` 部分，修改链接和文本。

### 任务 4: 调整颜色（10 分钟）

打开 → `src/layouts/BaseLayout.astro`

在 `<style is:global>` 中修改：
```css
body {
  color: #333;              /* 文字颜色 */
  background-color: #fff;   /* 背景颜色 */
}

a {
  color: #0066cc;          /* 链接颜色 */
}
```

## 🔍 调试提示

**问题：本地预览 404 错误**
```bash
# 确保在项目根目录
cd e:\github\homeOrganization

# 重新启动服务器
npm run dev
```

**问题：页面不更新**
- 刷新浏览器（Ctrl+R 或 Cmd+R）
- 检查是否有语法错误（看终端输出）

**问题：图片不显示**
- 确保文件在 `public/assets/images/` 中
- 使用正确的路径：`/assets/images/filename.jpg`
- 检查文件名是否有空格或特殊字符

**问题：构建失败**
```bash
# 清除缓存后重试
rm -r .astro dist
npm run build
```

## 📱 响应式设计检查

在浏览器开发者工具中按 `F12`，然后按 `Ctrl+Shift+M` 切换到响应式视图，测试在不同屏幕尺寸上的显示。

## 🚢 部署前检查清单

部署前运行这个：
```bash
npm run build
npm run preview
```

访问 http://localhost:3000 检查：
- [ ] 首页正确
- [ ] 导航链接都能点
- [ ] 分类页面能访问
- [ ] 所有图片能显示
- [ ] 页脚信息正确
- [ ] 没有控制台错误（F12 查看）

## 📊 文件大小参考

这些是正常的大小：
- `node_modules/` - ~800MB（正常，包含所有依赖）
- `package-lock.json` - ~400KB（正常，依赖锁定文件）
- `dist/` 构建输出 - ~100-200KB（非常小）
- 单篇文章 - 50-100KB（很小）

## 🔐 不要提交到 Git 的文件

这些已经在 `.gitignore` 中了，不用担心：
```
node_modules/
.astro/
dist/
.env
```

## 📚 更多帮助

| 我想... | 看这个文件 |
|--------|----------|
| 快速上手 | `GETTING_STARTED.md` |
| 理解项目结构 | `PROJECT_STRUCTURE.md` |
| 查看初始化完成情况 | `SETUP_CHECKLIST.md` |
| 看内容规划 | `居家收纳博客-站点结构与内容规划.md` |
| 学习 Astro | [astro.build/docs](https://docs.astro.build) |

---

**记住**：改完任何文件后，保存文件，浏览器会自动刷新！✨
