# 项目结构详解

## 目录树

```
e:\github\homeOrganization\
├── src/                          # 源代码目录
│   ├── layouts/                  # 页面布局组件
│   │   ├── BaseLayout.astro      # 基础布局（包含导航和页脚）
│   │   └── PostLayout.astro      # 文章专用布局
│   │
│   ├── pages/                    # 页面目录（自动路由）
│   │   ├── index.astro           # 首页 → /
│   │   ├── about.astro           # 关于页 → /about/
│   │   │
│   │   ├── kitchen/              # 厨房分类
│   │   │   └── index.astro       # → /kitchen/
│   │   │   # 下级页面：
│   │   │   # ├── pantry.astro    # → /kitchen/pantry/
│   │   │   # ├── fridge.astro    # → /kitchen/fridge/
│   │   │   # └── cabinets.astro  # → /kitchen/cabinets/
│   │   │
│   │   ├── closet/               # 衣柜分类
│   │   │   └── index.astro       # → /closet/
│   │   │   # └── [subcategories].astro
│   │   │
│   │   ├── bathroom/             # 浴室分类
│   │   │   └── index.astro       # → /bathroom/
│   │   │
│   │   ├── small-space/          # 小空间分类
│   │   │   └── index.astro       # → /small-space/
│   │   │
│   │   └── declutter/            # 断舍离分类
│   │       └── index.astro       # → /declutter/
│   │
│   ├── content/                  # Markdown 内容集合
│   │   ├── blog/                 # 博客文章
│   │   │   ├── example.md        # 示例文章
│   │   │   ├── my-first-post.md  # 你的第一篇文章
│   │   │   └── ...
│   │   │
│   │   ├── resources/            # 资源内容
│   │   │   ├── size-reference.md # 尺寸参考表
│   │   │   ├── checklist.md      # 清单模板
│   │   │   └── ...
│   │   │
│   │   └── config.ts             # Content Collections 配置（待添加）
│   │
│   └── env.d.ts                  # TypeScript 环境声明（自动生成）
│
├── public/                       # 静态资源（不处理，直接复制）
│   ├── assets/
│   │   ├── images/               # 文章图片
│   │   │   ├── pantry-example.jpg
│   │   │   └── ...
│   │   ├── css/                  # 可选的全局样式
│   │   └── js/                   # 可选的脚本
│   ├── favicon.svg               # 网站图标
│   └── robots.txt                # SEO 爬虫指令
│
├── dist/                         # 构建输出目录（生成）
│   ├── index.html
│   ├── about/
│   ├── kitchen/
│   ├── assets/
│   └── ...
│
├── .astro/                       # Astro 缓存（生成）
│
├── node_modules/                 # 依赖包（生成）
│
├── 项目配置文件
│   ├── package.json              # 项目信息和依赖
│   ├── tsconfig.json             # TypeScript 配置
│   ├── astro.config.mjs          # Astro 配置
│   ├── .gitignore                # Git 忽略规则
│   └── .nvmrc                    # Node 版本指定
│
├── 文档
│   ├── README.md                 # 项目说明
│   ├── GETTING_STARTED.md        # 快速启动指南 ← 先读这个！
│   ├── PROJECT_STRUCTURE.md      # 项目结构说明（本文件）
│   └── 居家收纳博客-站点结构与内容规划.md  # 内容规划
│
└── 其他
    ├── .git/                     # Git 仓库
    └── .screenshots/             # 截图（可选）
```

## 关键目录说明

### `src/layouts/` - 页面布局

**作用**：定义页面的通用结构（导航、页脚等）和各类页面的专用格式。

**文件**：
- `BaseLayout.astro` - 所有页面的基础布局，包含全局导航、页脚、样式
- `PostLayout.astro` - 文章专用布局，包含文章元数据（日期、分类、标签）

**使用方式**：
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="页面标题" description="描述">
  <h1>内容</h1>
</BaseLayout>
```

### `src/pages/` - 页面和路由

**作用**：文件结构自动映射到 URL 路由。

**路由规则**：
- `index.astro` → `/`
- `about.astro` → `/about/`
- `kitchen/index.astro` → `/kitchen/`
- `kitchen/pantry.astro` → `/kitchen/pantry/`

**当前页面**：
- `index.astro` - 首页
- `about.astro` - 关于页
- `kitchen/index.astro` - 厨房分类首页
- `closet/index.astro` - 衣柜分类首页
- `bathroom/index.astro` - 浴室分类首页
- `small-space/index.astro` - 小空间分类首页
- `declutter/index.astro` - 断舍离分类首页

**待添加的页面**：
```
src/pages/
├── kitchen/
│   ├── pantry.astro        # /kitchen/pantry/
│   ├── fridge.astro        # /kitchen/fridge/
│   └── cabinets.astro      # /kitchen/cabinets/
├── closet/
│   ├── closet.astro        # /closet/closet/
│   └── bedroom.astro       # /closet/bedroom/
├── bathroom/
│   ├── vanity.astro        # /bathroom/vanity/
│   └── small-bathroom.astro # /bathroom/small-bathroom/
├── small-space/
│   ├── apartment.astro     # /small-space/apartment/
│   └── rental.astro        # /small-space/rental/
├── declutter/
│   ├── declutter.astro     # /declutter/declutter/
│   ├── routines.astro      # /declutter/routines/
│   └── moving.astro        # /declutter/moving/
├── series/                 # 系列页面
│   └── index.astro         # /series/
├── resources/              # 资源页面
│   └── index.astro         # /resources/
├── archive/                # 归档页面
│   └── index.astro         # /archive/
└── now/                    # Now 页面
    └── index.astro         # /now/
```

### `src/content/` - Markdown 内容

**作用**：存放 Markdown 格式的内容（文章、资源等）。

**子目录**：
- `blog/` - 博客文章，每个 `.md` 文件是一篇文章
  - 使用 frontmatter 添加元数据（标题、日期、分类、标签等）
  - 可自动索引和查询
  
- `resources/` - 资源页面（尺寸表、清单、模板）
  - 类似博客文章，但用于静态资源内容

**Markdown frontmatter 模板**：
```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2024-01-20
category: "Kitchen"
tags: ["tag1", "tag2"]
image: "/assets/images/example.jpg"
---

# 文章内容开始

Markdown 正文...
```

### `public/` - 静态资源

**作用**：存放不需要处理的文件（图片、字体、预生成的资源等）。

**约定**：
- `public/assets/images/` - 文章图片
- `public/assets/css/` - 额外的 CSS 文件
- `public/robots.txt` - SEO 爬虫规则
- `public/favicon.svg` - 网站图标

**访问方式**：
```html
<img src="/assets/images/my-photo.jpg" />
```

## 路由导航关系

```
首页 /
├── 厨房 /kitchen/
│   ├── 食品柜 /kitchen/pantry/
│   ├── 冰箱 /kitchen/fridge/
│   └── 橱柜与台面 /kitchen/cabinets/
├── 衣柜 /closet/
│   ├── 衣柜 /closet/closet/
│   └── 卧室 /closet/bedroom/
├── 浴室 /bathroom/
│   ├── 浴室柜 /bathroom/vanity/
│   └── 小浴室 /bathroom/small-bathroom/
├── 小空间 /small-space/
│   ├── 公寓 /small-space/apartment/
│   └── 租房友好 /small-space/rental/
├── 断舍离 /declutter/
│   ├── 断舍离 /declutter/declutter/
│   ├── 日常维护 /declutter/routines/
│   └── 搬家 /declutter/moving/
├── 系列 /series/
├── 资源 /resources/
├── 归档 /archive/
├── Now /now/
└── 关于 /about/
```

## 文件关系图

```
页面 (pages/)
    ↓ 使用
布局 (layouts/)
    ↓ 可引入
内容 (content/)
    ↓ 使用
静态资源 (public/)
```

**流程**：
1. 你在 `src/pages/` 创建 `.astro` 文件
2. 它导入 `src/layouts/` 中的布局组件
3. 布局渲染页面的通用部分（导航、页脚）
4. 页面内容填入中间
5. 如需数据，从 `src/content/` 读取 Markdown
6. 图片和其他资源从 `public/` 引用

## 代码示例

### 创建新的分类子页面

假设你要创建"冰箱"页面（`/kitchen/fridge/`）：

```astro
---
// src/pages/kitchen/fridge.astro
import BaseLayout from '../../layouts/BaseLayout.astro';

const articles = [
  // 这里加文章数据
];
---

<BaseLayout title="Fridge - 冰箱收纳" description="冰箱分区和保鲜技巧">
  <h1>冰箱 Fridge</h1>
  <p>冰箱分区的完整指南...</p>

  <section>
    <h2>最新文章</h2>
    {/* 渲染文章列表 */}
  </section>
</BaseLayout>
```

### 写第一篇文章

```markdown
---
// src/content/blog/my-pantry-story.md
title: "我的 30cm 深柜整理完成"
description: "深柜改造从发现问题到3个月后的真实回顾"
pubDate: 2024-01-20
category: "Kitchen"
tags: ["Pantry", "深柜", "收纳盒"]
image: "/assets/images/pantry-before-after.jpg"
---

## 起因

我家的深柜只有 30cm 宽，每次拿东西都很困难...

## 解决方案

我决定安装抽拉篮...

## 3 个月后

事实证明...
```

## 构建流程

```
修改源代码 (src/)
    ↓
npm run dev （本地预览）或
npm run build （生产构建）
    ↓
Astro 编译处理
    ├─ 处理 .astro 组件
    ├─ 编译 Markdown
    ├─ 优化图片
    └─ 生成 HTML/CSS/JS
    ↓
输出到 dist/
    ↓
部署到网络服务器
```

## 性能优化建议

- 图片应该 ≤ 1MB，建议用 WebP 格式
- 每个页面保持在 5-10 个重要元素
- 避免在布局中加入过重的 JavaScript
- 使用 CSS Grid/Flexbox 而不是 Float

## 下一步

1. **自定义样式**：修改 `src/layouts/BaseLayout.astro` 中的 `<style is:global>`
2. **添加子分类页面**：在 `src/pages/` 中创建对应文件
3. **写第一篇文章**：在 `src/content/blog/` 创建 `.md` 文件
4. **配置部署**：将代码 push 到 GitHub，设置 Netlify/Vercel 自动部署

祝你编码顺利！🚀
