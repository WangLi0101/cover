`<script type="module">` 是 HTML 中引入 ES6 模块的方式，标识该脚本文件或块是一个 ES Module（ESM），即遵循 ECMAScript 模块化规范。与传统的 `<script>` 标签不同，模块化脚本具有许多独特的特性，旨在提升代码的可维护性、复用性和性能。

### ES Module 的特性

1. **模块作用域（Module Scope）**：

   - 模块中的变量、函数和类默认是模块私有的，不会污染全局作用域。
   - 只有通过 `export` 导出的内容才能被其他模块使用。

   ```javascript
   // file1.js
   export const greeting = 'Hello, Module!';
   
   // file2.js
   import { greeting } from './file1.js';
   console.log(greeting);  // 输出 'Hello, Module!'
   ```

2. **自动严格模式（Strict Mode）**：

   - ES 模块自动以严格模式运行，不需要手动加上 `"use strict"` 声明。
   - 严格模式消除了 JavaScript 中一些不安全的操作，例如禁止使用未声明的变量。

3. **异步加载**：

   - ES 模块在浏览器中是异步加载的，不会阻塞页面渲染。
   - 不同于传统的同步脚本，`<script type="module">` 不会阻塞 HTML 的解析，即使放在 `<head>` 中也不会影响页面的渲染。

   ```html
   <script type="module">
     import { myFunction } from './module.js';
     myFunction();
   </script>
   ```

4. **支持 `import` 和 `export`**：

   - ES Module 允许模块之间通过 `import` 引入其他模块的内容，使用 `export` 导出模块内容。
   - `export` 可以导出变量、函数、类、对象等，而 `import` 可以引入导出的内容并在其他模块中使用。

   ```javascript
   // 导出模块内容
   export const PI = 3.14;
   
   export function area(radius) {
     return PI * radius * radius;
   }
   
   // 导入模块内容
   import { area } from './math.js';
   console.log(area(5));  // 输出 78.5
   ```

5. **支持 `defer` 属性**：

   - `<script type="module">` 标签默认带有 `defer` 行为，即脚本会在 HTML 文档完全解析后再执行。
   - 这意味着即使将模块化脚本放在 `<head>` 中，它们也不会阻塞页面的加载。

   ```html
   <script type="module" src="main.js"></script>
   <p>Page is still loading...</p>
   ```

6. **跨域加载**：

   - 当加载外部模块时，浏览器会强制要求使用 CORS（跨域资源共享），即外部模块的服务器必须设置相应的跨域请求头。
   - 没有配置 CORS 的外部模块会导致加载失败，保护浏览器和网站的安全性。

7. **模块的文件扩展名**：

   - 模块文件一般使用 `.js` 扩展名，也可以使用 `.mjs` 扩展名来显式表示模块化 JavaScript 文件。

8. **顶级 `await`**（Top-level `await`）：

   - 在模块化脚本中，可以直接在顶层使用 `await` 关键字，而不必在 `async` 函数中。顶层 `await` 使得异步代码在模块的全局范围内更加灵活。

   ```javascript
   // 顶级 await 示例
   const response = await fetch('https://api.example.com/data');
   const data = await response.json();
   console.log(data);
   ```

### 浏览器对 ES Module 的支持

现代浏览器（如 Chrome、Firefox、Edge 和 Safari）已经完全支持 ES 模块，但在一些旧版浏览器中（如 IE），可能需要使用打包工具（如 Webpack、Rollup）将模块化代码转换为兼容的格式。

### ES Module 与传统脚本的对比

| 特性         | 普通脚本 (`<script>`)                  | ES Module (`<script type="module">`) |
| ------------ | -------------------------------------- | ------------------------------------ |
| 加载方式     | 同步加载，可能阻塞页面渲染             | 异步加载，不阻塞页面渲染             |
| 作用域       | 全局作用域，变量会污染全局环境         | 模块作用域，变量不会污染全局         |
| 默认严格模式 | 需要手动开启 `"use strict"`            | 自动严格模式                         |
| 模块化支持   | 需要使用外部模块加载器（如 RequireJS） | 原生支持 `import` 和 `export`        |
| 脚本执行顺序 | 按照代码书写顺序执行                   | 模块按照依赖关系执行，且是异步加载   |
| 跨域加载     | 无严格的跨域要求                       | 跨域请求时需要服务器设置 CORS 头     |
| 顶级 `await` | 不支持                                 | 支持，直接在模块文件中使用           |

### 总结

`<script type="module">` 是现代 JavaScript 开发中模块化的基础，通过使用 ES Module，你可以更好地组织代码，避免全局变量污染，并且享受到异步加载和按需引入的优势。在现代前端开发中，ES 模块已成为标准，配合打包工具和浏览器的原生支持，使得开发体验和代码管理都更加便捷和高效。