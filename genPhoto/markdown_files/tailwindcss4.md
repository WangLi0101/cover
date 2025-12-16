# Tailwind CSS 4 完全指南

Tailwind CSS 4 是这个流行的实用优先（utility-first）CSS 框架的重大版本更新，带来了革命性的性能提升和开发体验改进。

## 🚀 核心亮点

### 1. 全新的高性能引擎 —— Oxide

Tailwind CSS 4 引入了名为 **Oxide** 的全新引擎，使用 **Rust** 和 **Lightning CSS** 重写：

- ⚡ **构建速度提升 10 倍以上**：完整构建速度提升超过 3.5 倍，增量构建提升超过 8 倍
- 📦 **安装包更小**：减少超过 35% 的安装体积
- 🔧 **零配置开始**：无需配置文件即可开始使用

### 2. 原生 CSS 优先

Tailwind CSS 4 采用 **CSS-first** 的配置方式：

```css
/* 在 CSS 文件中直接配置 */
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  
  --breakpoint-3xl: 1920px;
  
  --color-primary: oklch(0.84 0.18 117.33);
  --color-secondary: oklch(0.83 0.14 72.09);
  
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

### 3. 不再需要 `tailwind.config.js`

在 v4 中，你可以完全在 CSS 中完成所有配置：

```css
@import "tailwindcss";

/* 自定义你的设计系统 */
@theme {
  --color-*: initial;  /* 重置所有颜色 */
  
  /* 定义你自己的颜色体系 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
}
```

## 🌙 深色模式

Tailwind CSS 4 提供了强大且灵活的深色模式支持，让你轻松构建适应用户偏好的界面。

### 基本用法

使用 `dark:` 变体前缀为深色模式定义样式：

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">标题</h1>
  <p class="text-gray-600 dark:text-gray-300">内容文本</p>
</div>
```

### 切换策略

Tailwind CSS 4 支持两种深色模式切换策略：

#### 1. 媒体查询策略（默认）

自动跟随系统偏好设置，使用 CSS `prefers-color-scheme` 媒体查询：

```css
@import "tailwindcss";

/* 默认即为媒体查询策略，无需额外配置 */
```

#### 2. 选择器策略

通过 CSS 类名手动控制，适合需要用户切换主题的场景：

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

然后在 HTML 根元素上切换 `dark` 类：

```html
<!-- 浅色模式 -->
<html>
  <body class="bg-white">...</body>
</html>

<!-- 深色模式 -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900">...</body>
</html>
```

### 自定义深色模式颜色

在 `@theme` 中定义深色模式专用的颜色变量：

```css
@import "tailwindcss";

@theme {
  /* 浅色模式颜色 */
  --color-surface: #ffffff;
  --color-surface-secondary: #f3f4f6;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
}

/* 深色模式覆盖 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #111827;
    --color-surface-secondary: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
  }
}
```

### 深色模式组件示例

#### 卡片组件

```html
<div class="
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  shadow-lg dark:shadow-gray-900/30
  rounded-xl p-6
">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
    卡片标题
  </h3>
  <p class="mt-2 text-gray-600 dark:text-gray-400">
    卡片描述内容
  </p>
</div>
```

#### 按钮组件

```html
<button class="
  bg-blue-600 hover:bg-blue-700
  dark:bg-blue-500 dark:hover:bg-blue-600
  text-white font-medium
  px-4 py-2 rounded-lg
  transition-colors
">
  主要按钮
</button>

<button class="
  bg-gray-100 hover:bg-gray-200
  dark:bg-gray-700 dark:hover:bg-gray-600
  text-gray-900 dark:text-white
  px-4 py-2 rounded-lg
  transition-colors
">
  次要按钮
</button>
```

#### 输入框组件

```html
<input 
  type="text" 
  placeholder="请输入..."
  class="
    w-full px-4 py-2 rounded-lg
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
    focus:border-transparent
    transition-colors
  "
/>
```

### 深色模式最佳实践

| 实践 | 说明 |
|---|---|
| **避免纯黑背景** | 使用 `gray-900` 或 `gray-950` 代替纯黑 `black` |
| **降低对比度** | 深色模式下使用稍低的文字对比度，减少视觉疲劳 |
| **调整阴影** | 深色模式下阴影需要更深或使用透明度更低的颜色 |
| **保持品牌色** | 主品牌色可以在深色模式下稍微调亮 |
| **测试可访问性** | 确保深色模式下的颜色对比度符合 WCAG 标准 |

### JavaScript 主题切换示例

```javascript
// 切换深色模式
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  
  // 保存用户偏好
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
}

// 页面加载时初始化
initTheme();
```

## ✨ 新增实用类

### 1. 容器查询（Container Queries）

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4">
    <!-- 基于容器宽度响应式布局 -->
  </div>
</div>
```

### 2. 3D 变换

```html
<div class="rotate-x-45 rotate-y-12 rotate-z-6">
  <!-- 3D 旋转效果 -->
</div>

<div class="perspective-500 transform-3d">
  <!-- 透视效果 -->
</div>
```

### 3. 渐变增强

```html
<!-- 线性渐变角度 -->
<div class="bg-linear-45 from-indigo-500 to-purple-500"></div>

<!-- 径向渐变 -->
<div class="bg-radial from-pink-500 to-rose-500"></div>

<!-- 锥形渐变 -->
<div class="bg-conic from-violet-500 via-purple-500 to-violet-500"></div>
```

### 4. 字体宽度和样式变体

```html
<p class="font-stretch-expanded">扩展字体宽度</p>
<p class="font-stretch-condensed">压缩字体宽度</p>
```

### 5. `not-*` 变体

```html
<ul>
  <li class="not-last:border-b">项目 1</li>
  <li class="not-last:border-b">项目 2</li>
  <li class="not-last:border-b">项目 3</li>
</ul>
```

### 6. `inert` 变体

```html
<div inert class="inert:opacity-50 inert:pointer-events-none">
  <!-- 不可交互的内容 -->
</div>
```

### 7. 字段大小调整

```html
<textarea class="field-sizing-content">
  <!-- 自动根据内容调整大小 -->
</textarea>
```

## 🎨 现代 CSS 特性

### 原生级联层（Cascade Layers）

Tailwind CSS 4 使用 CSS 原生的 `@layer` 规则：

```css
@layer theme, base, components, utilities;
```

### 原生嵌套

```css
.card {
  background: white;
  
  &:hover {
    background: #f3f4f6;
  }
  
  & .title {
    font-size: 1.25rem;
  }
}
```

### OKLCH 颜色空间

所有颜色现在使用 OKLCH 色彩空间，提供：

- 更准确的颜色感知
- 更好的色彩过渡
- 支持 P3 广色域显示器

```css
@theme {
  --color-blue-500: oklch(0.623 0.214 259.815);
}
```

## 🔄 从 v3 迁移

### 主要变更

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme` 在 CSS 中 |
| `@tailwind base;` | `@import "tailwindcss";` |
| `bg-opacity-50` | `bg-black/50` |
| `shadow-sm` | `shadow-xs` (重命名) |
| `shadow` | `shadow-sm` (重命名) |
| `blur` | `blur-sm` (重命名) |
| `ring` | `ring-3` (默认宽度变化) |

### 移除的实用类

以下实用类已被移除或替换：

- `flex-shrink` → 使用 `shrink`
- `flex-grow` → 使用 `grow`
- `overflow-ellipsis` → 使用 `text-ellipsis`
- `decoration-slice/clone` → 使用 `box-decoration-slice/clone`

### 自动升级工具

使用官方升级工具自动迁移：

```bash
npx @tailwindcss/upgrade
```

## 🛠️ 与框架集成

### Next.js

```bash
npm install tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

### Nuxt

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    plugins: [require('@tailwindcss/vite').default()],
  },
  css: ['~/assets/css/main.css'],
})
```

### Astro

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

## 📝 最佳实践

### 1. 使用 @theme 定义设计令牌

```css
@theme {
  /* 间距系统 */
  --spacing-page: 2rem;
  --spacing-section: 4rem;
  
  /* 圆角 */
  --radius-card: 1rem;
  --radius-button: 0.5rem;
  
  /* 阴影 */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### 2. 组件抽象

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded-button font-medium transition-colors;
  }
  
  .btn-primary {
    @apply btn bg-primary-500 text-white hover:bg-primary-600;
  }
}
```

### 3. 利用变体组合

```html
<button class="
  bg-blue-500 
  hover:bg-blue-600 
  active:bg-blue-700
  focus-visible:ring-2 
  disabled:opacity-50 
  disabled:cursor-not-allowed
">
  按钮
</button>
```

## 🔗 相关资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS v4 博客公告](https://tailwindcss.com/blog/tailwindcss-v4)
- [GitHub 仓库](https://github.com/tailwindlabs/tailwindcss)
- [升级指南](https://tailwindcss.com/docs/upgrade-guide)

---

> **总结**：Tailwind CSS 4 代表了框架的重大进化，通过 Rust 重写的引擎带来了显著的性能提升，同时 CSS-first 的配置方式让开发体验更加原生和直观。如果你正在开始新项目，强烈建议直接使用 v4；对于现有项目，官方的升级工具可以帮助你平滑过渡。