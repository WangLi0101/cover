# Path 模块详解

## 概述

`path` 模块是一个用于处理文件路径和目录路径的工具模块。在 Node.js 中，它是内置的核心模块；在浏览器环境中，可以通过 polyfill 库（如 `path-browserify`）来使用类似功能。

## Node.js 环境

### 引入模块

```javascript
// CommonJS
const path = require('path');

// ES Module
import path from 'path';
```

### 核心概念

路径分隔符在不同操作系统中有所不同：
- **Windows**: 使用反斜杠 `\`（如 `C:\Users\Documents`）
- **POSIX (Linux/Mac)**: 使用正斜杠 `/`（如 `/home/user/documents`）

`path` 模块会自动根据运行的操作系统使用正确的分隔符。

### 常用 API

#### 1. `path.join([...paths])`

将多个路径片段连接成一个完整的路径。会自动处理多余的分隔符，并规范化路径。

```javascript
const fullPath = path.join('/users', 'john', 'documents', 'file.txt');
// POSIX: /users/john/documents/file.txt
// Windows: \users\john\documents\file.txt

const relativePath = path.join('src', '../config', 'app.json');
// 输出: config/app.json
```

#### 2. `path.resolve([...paths])`

将路径或路径片段解析为绝对路径。从右到左处理，遇到绝对路径时停止。

```javascript
path.resolve('/foo/bar', './baz');
// 输出: /foo/bar/baz

path.resolve('/foo/bar', '/tmp/file/');
// 输出: /tmp/file

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/user，输出: /home/user/wwwroot/static_files/gif/image.gif
```

#### 3. `path.basename(path[, ext])`

返回路径的最后一部分（文件名）。可选地移除文件扩展名。

```javascript
path.basename('/foo/bar/baz/asdf/quux.html');
// 输出: quux.html

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 输出: quux
```

#### 4. `path.dirname(path)`

返回路径的目录部分。

```javascript
path.dirname('/foo/bar/baz/asdf/quux.txt');
// 输出: /foo/bar/baz/asdf

path.dirname('C:\\temp\\myfile.html');
// Windows 输出: C:\temp
```

#### 5. `path.extname(path)`

返回路径的扩展名（包含点号）。

```javascript
path.extname('index.html');
// 输出: .html

path.extname('index.coffee.md');
// 输出: .md

path.extname('index.');
// 输出: .

path.extname('index');
// 输出: ''（空字符串）
```

#### 6. `path.parse(path)`

将路径解析为一个对象，包含各个组成部分。

```javascript
path.parse('/home/user/dir/file.txt');
// 输出:
// {
//   root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

path.parse('C:\\path\\dir\\file.txt');
// Windows 输出:
// {
//   root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

#### 7. `path.format(pathObject)`

从对象返回路径字符串，与 `path.parse()` 相反。

```javascript
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 输出: /home/user/dir/file.txt

// 如果提供了 base，则 name 和 ext 会被忽略
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// 输出: /file.txt
```

#### 8. `path.normalize(path)`

规范化路径，解析 `..` 和 `.` 片段。

```javascript
path.normalize('/foo/bar//baz/asdf/quux/..');
// 输出: /foo/bar/baz/asdf

path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Windows 输出: C:\temp\foo\
```

#### 9. `path.isAbsolute(path)`

判断路径是否为绝对路径。

```javascript
path.isAbsolute('/foo/bar');     // true
path.isAbsolute('qux/');         // false
path.isAbsolute('.');            // false

// Windows
path.isAbsolute('//server');     // true
path.isAbsolute('\\\\server');   // true
path.isAbsolute('C:/foo/..');    // true
path.isAbsolute('bar\\baz');     // false
```

#### 10. `path.relative(from, to)`

返回从 `from` 到 `to` 的相对路径。

```javascript
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 输出: ../../impl/bbb

path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Windows 输出: ..\\..\\impl\\bbb
```

### 特殊属性

```javascript
// 路径分隔符
path.sep
// POSIX: /
// Windows: \

// 路径定界符
path.delimiter
// POSIX: :
// Windows: ;

// 示例使用
console.log(process.env.PATH.split(path.delimiter));
// 输出环境变量 PATH 中的所有路径
```

### 跨平台处理

```javascript
// 在任何操作系统上使用 POSIX 路径
const posixPath = path.posix.join('/tmp', 'file');
// 输出: /tmp/file

// 在任何操作系统上使用 Windows 路径
const winPath = path.win32.join('C:\\temp', 'file');
// 输出: C:\temp\file
```

## 浏览器环境

浏览器原生不支持 `path` 模块，但可以通过以下方式使用：

### 1. 使用 path-browserify

```bash
npm install path-browserify
```

```javascript
// webpack 配置
module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};

// 在代码中使用
import path from 'path';

const filePath = path.join('assets', 'images', 'logo.png');
// 输出: assets/images/logo.png
```

### 2. 使用 URL API（原生替代方案）

浏览器提供了 `URL` API 来处理 URL 路径：

```javascript
// 解析 URL
const url = new URL('https://example.com/path/to/file.html');

console.log(url.pathname);        // /path/to/file.html
console.log(url.origin);          // https://example.com
console.log(url.href);            // https://example.com/path/to/file.html

// 拼接路径
const baseUrl = new URL('https://example.com/api/');
const endpoint = new URL('users/123', baseUrl);
console.log(endpoint.href);       // https://example.com/api/users/123

// 相对路径
const currentUrl = new URL('https://example.com/articles/post.html');
const relativeUrl = new URL('../images/photo.jpg', currentUrl);
console.log(relativeUrl.href);    // https://example.com/images/photo.jpg
```

### 3. 手动实现基本功能

```javascript
// 简单的路径拼接
function joinPath(...parts) {
  return parts
    .join('/')
    .replace(/\/+/g, '/')  // 移除多余的斜杠
    .replace(/^\//, '');   // 移除开头的斜杠（如果需要相对路径）
}

// 获取文件名
function basename(path) {
  return path.split('/').pop();
}

// 获取扩展名
function extname(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

// 获取目录名
function dirname(path) {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

// 使用示例
console.log(joinPath('images', 'gallery', 'photo.jpg'));  // images/gallery/photo.jpg
console.log(basename('/path/to/file.txt'));                // file.txt
console.log(extname('document.pdf'));                      // .pdf
console.log(dirname('/path/to/file.txt'));                 // /path/to
```

## 实际应用场景

### 1. 构建文件路径

```javascript
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const configFile = path.join(dataDir, 'config.json');

const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
```

### 2. 动态加载模块

```javascript
const moduleName = 'utils';
const modulePath = path.resolve(__dirname, '..', 'lib', `${moduleName}.js`);
const utils = require(modulePath);
```

### 3. 处理上传文件

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});
```

### 4. 静态资源服务

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'assets', 'images')));
```

### 5. 文件类型判断

```javascript
function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
}

function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.html': 'HTML',
    '.css': 'CSS'
  };
  return types[ext] || 'Unknown';
}
```

## 最佳实践

### 1. 始终使用 path 模块

```javascript
// ❌ 不推荐 - 硬编码分隔符
const filePath = 'src' + '/' + 'utils' + '/' + 'helper.js';

// ✅ 推荐 - 使用 path.join
const filePath = path.join('src', 'utils', 'helper.js');
```

### 2. 使用 __dirname 和 __filename

```javascript
// ❌ 相对于执行目录（不可靠）
const dataPath = './data/config.json';

// ✅ 相对于当前文件（可靠）
const dataPath = path.join(__dirname, 'data', 'config.json');
```

### 3. 解析用户输入路径时要小心

```javascript
const path = require('path');

function safeJoin(base, userPath) {
  const resolved = path.join(base, userPath);
  const relative = path.relative(base, resolved);
  
  // 确保路径不会越出基础目录
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Invalid path');
  }
  
  return resolved;
}

// 使用
try {
  const safePath = safeJoin('/app/data', userInput);
  // 安全地使用 safePath
} catch (error) {
  console.error('路径不安全:', error.message);
}
```

### 4. 规范化路径

```javascript
const fs = require('fs');
const path = require('path');

function readFileSafe(filePath) {
  // 规范化路径，避免 ../ 等问题
  const normalized = path.normalize(filePath);
  return fs.readFileSync(normalized, 'utf8');
}
```

## 常见错误

### 1. 混淆 join 和 resolve

```javascript
// join: 只是拼接路径
path.join('/a', 'b', 'c');    // /a/b/c
path.join('a', 'b', 'c');     // a/b/c

// resolve: 解析为绝对路径
path.resolve('/a', 'b', 'c'); // /a/b/c
path.resolve('a', 'b', 'c');  // /current/working/dir/a/b/c
```

### 2. 忘记处理不同操作系统

```javascript
// ❌ 只适用于 POSIX 系统
const parts = filePath.split('/');

// ✅ 跨平台
const parts = filePath.split(path.sep);

// 或更好的方式
const { dir, name, ext } = path.parse(filePath);
```

## 总结

`path` 模块是处理文件系统路径的重要工具：

- **Node.js 环境**: 内置核心模块，提供完整的路径处理功能
- **浏览器环境**: 需要使用 polyfill（path-browserify）或 URL API
- **跨平台**: 自动处理不同操作系统的路径差异
- **安全性**: 规范化和验证用户输入的路径
- **最佳实践**: 使用 `path` 方法而非字符串拼接，始终使用 `__dirname`

无论是在构建工具、Web 服务器还是文件处理应用中，熟练掌握 `path` 模块都是 Node.js 开发的基础技能。
