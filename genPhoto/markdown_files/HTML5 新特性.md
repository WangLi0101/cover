<!--
 * @Author: Libra
 * @Date: 2024-08-13 09:47:58
 * @LastEditors: Libra
 * @Description:
-->

## 1. 语义化标签

HTML5 引入了多个语义化标签，旨在提升网页结构的清晰度和可访问性。这些标签不仅使代码更具可读性，还有助于搜索引擎优化（SEO）和辅助技术（如屏幕阅读器）的理解。

- **`<header>`**：定义文档的头部区域，通常包含网站标志、导航菜单等。
- **`<nav>`**：表示导航链接的区域。
- **`<section>`**：用于定义文档中的独立区域或节。
- **`<article>`**：表示独立的内容块，如博客文章、新闻报道等。
- **`<aside>`**：用于包含与主内容相关的辅助信息，如侧边栏、广告等。
- **`<footer>`**：定义文档的底部区域，通常包含版权信息、联系信息等。
- **`<main>`**：表示文档的主要内容区域。

## 2. 表单控件和输入类型

HTML5 扩展了表单元素，提供了更多的输入类型和属性，简化了表单验证和用户输入的处理。

- 新增输入类型：
  - `email`：用于电子邮件地址输入，自动验证格式。
  - `url`：用于网址输入，自动验证格式。
  - `number`：允许用户输入数字，并可设置最小值、最大值和步长。
  - `range`：显示滑动条，让用户选择一个数值范围。
  - `date`、`time`、`datetime-local`：用于日期和时间的选择。
  - `color`：提供颜色选择器。
  - `search`：优化搜索框的输入体验。
- 表单验证：
  - `required`：指定输入字段为必填项。
  - `pattern`：使用正则表达式定义输入格式。
  - `min`、`max`、`step`：限制数值输入范围和步长。

## 3. 多媒体支持

HTML5 原生支持音频和视频，无需依赖第三方插件，如 Flash。

- **`<audio>`**：用于嵌入音频内容，支持多种格式（如 MP3、WAV、OGG）。

  ```html
  <audio controls>
    <source src="audio.mp3" type="audio/mpeg" />
    您的浏览器不支持音频元素。
  </audio>
  ```

- **`<video>`**：用于嵌入视频内容，支持多种格式（如 MP4、WebM、OGG）。

  ```html
  <video width="320" height="240" controls>
    <source src="video.mp4" type="video/mp4" />
    您的浏览器不支持视频标签。
  </video>
  ```

- **`<source>`**：允许为音频和视频提供多种格式的备选方案。

- **`<track>`**：用于添加字幕、章节和其他文本轨道。

## 4. 图形与视觉

HTML5 提供了强大的图形绘制能力，支持 2D 和 3D 图形的创建和渲染。

- **`<canvas>`**：一个可编程的图形渲染区域，适用于绘制图形、动画和游戏。

  ```html
  <canvas id="myCanvas" width="200" height="100"></canvas>
  <script>
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 150, 75);
  </script>
  ```

- **SVG（可缩放矢量图形）**：基于 XML 的矢量图形格式，适用于高质量的图形和动画。

  ```html
  <svg width="100" height="100">
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="green"
      stroke-width="4"
      fill="yellow"
    />
  </svg>
  ```

- **WebGL**：用于在 `<canvas>` 中渲染复杂的 3D 图形，支持硬件加速。

## 5. 本地存储

HTML5 提供了多种本地存储机制，增强了 Web 应用的数据存储能力，无需依赖服务器。

- **LocalStorage**：用于持久化存储数据，即使浏览器关闭，数据仍然保留。

  ```javascript
  // 存储数据
  localStorage.setItem("username", "JohnDoe");

  // 获取数据
  const username = localStorage.getItem("username");
  ```

- **SessionStorage**：用于在单个会话中存储数据，浏览器关闭后数据消失。

  ```javascript
  // 存储数据
  sessionStorage.setItem("sessionKey", "12345");

  // 获取数据
  const sessionKey = sessionStorage.getItem("sessionKey");
  ```

- **IndexedDB**：一个低级 API，用于在浏览器中存储大量结构化数据，支持事务和索引。

  ```javascript
  const request = indexedDB.open("myDatabase", 1);
  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("users", { keyPath: "id" });
  };
  ```

## 6. 新的 API

HTML5 引入了多种新 API，极大地扩展了 Web 应用的功能和交互能力。

### 6.1 Geolocation API

允许网页获取用户的地理位置信息。

```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(
      `纬度: ${position.coords.latitude}, 经度: ${position.coords.longitude}`
    );
  });
} else {
  console.log("Geolocation 不被支持。");
}
```

### 6.2 Drag and Drop API

支持拖放操作，提升用户交互体验。

```html
<div id="drag" draggable="true">拖动我</div>
<div id="drop">释放到这里</div>

<script>
  const drag = document.getElementById("drag");
  const drop = document.getElementById("drop");

  drag.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "这是拖动的数据");
  });

  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    drop.textContent = data;
  });
</script>
```

### 6.3 Web Workers

允许在后台线程中运行脚本，提升页面性能，避免阻塞主线程。

```javascript
// worker.js
self.onmessage = function (e) {
  const result = e.data * 2;
  self.postMessage(result);
};

// main.js
const worker = new Worker("worker.js");
worker.postMessage(10);
worker.onmessage = function (e) {
  console.log(`结果: ${e.data}`);
};
```

### 6.4 WebSockets

提供双向通信的能力，适用于实时应用，如聊天、游戏等。

```javascript
const socket = new WebSocket("ws://example.com/socket");

socket.onopen = function () {
  console.log("连接已打开");
  socket.send("Hello Server!");
};

socket.onmessage = function (event) {
  console.log(`收到消息: ${event.data}`);
};

socket.onclose = function () {
  console.log("连接已关闭");
};

socket.onerror = function (error) {
  console.error(`WebSocket 错误: ${error}`);
};
```

### 6.5 History API

允许操作浏览器的历史记录，实现**单页面应用**的路由管理。

```javascript
// 改变URL而不刷新页面
// localhost:5173 -> localhost:5173/page
history.pushState({ page: 1 }, "title 1", "page");

// 监听popstate事件
window.onpopstate = function (event) {
  if (event.state) {
    console.log(`页面状态: ${event.state.page}`);
  }
};
```

### 6.6 Offline Application (AppCache 和 Service Workers)

允许 Web 应用在离线状态下运行，提升用户体验。

- **AppCache**（已废弃，推荐使用 Service Workers）
- **Service Workers**：提供更强大的离线能力和缓存管理。

```javascript
// 注册Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker 注册成功:", registration.scope);
    })
    .catch(function (error) {
      console.log("Service Worker 注册失败:", error);
    });
}
```

## 7. 移动设备支持

HTML5 针对移动设备进行了优化，提供了更好的触摸事件支持和响应式设计能力。

- **触摸事件**：支持 `touchstart`、`touchmove`、`touchend` 等事件，提升移动端交互体验。

- **Viewport 元标签**：控制网页在移动设备上的显示效果。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- **响应式媒体查询**：通过 CSS 实现不同屏幕尺寸下的布局调整。

## 8. 其他新特性

### 8.1 Microdata

提供了一种在 HTML 标签中嵌入结构化数据的方法，帮助搜索引擎更好地理解网页内容。

```html
<div itemscope itemtype="https://schema.org/Person">
  <span itemprop="name">John Doe</span>
  <span itemprop="jobTitle">软件工程师</span>
</div>
```

### 8.2 ContentEditable

允许用户直接在浏览器中编辑内容，适用于富文本编辑器。

```html
<div contenteditable="true">你可以在这里编辑文本。</div>
```

### 8.3 新的全局属性

如 `data-*` 属性，用于存储自定义数据，方便 JavaScript 访问。

```html
<div data-user-id="12345">用户信息</div>
```

## 9. Web Components

虽然严格来说不是 HTML5 的一部分，但 Web Components 与 HTML5 紧密结合，提供了创建可复用、自定义的 HTML 标签的能力。

- **Custom Elements**：定义自定义标签。
- **Shadow DOM**：封装组件的内部结构和样式。
- **HTML Templates**：定义可复用的 HTML 结构。

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.textContent = "这是一个自定义元素";
    shadow.appendChild(div);
  }
}

customElements.define("my-element", MyElement);
```

```html
<my-element></my-element>
```
