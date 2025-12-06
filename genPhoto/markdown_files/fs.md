# Node.js fs 模块常用 API 总结

`fs` 模块是 Node.js 的核心模块，用于与文件系统进行交互。它提供了同步和异步两种操作方式，以及基于 Promise 的 API。

## 一、引入方式

```javascript
// CommonJS
const fs = require('fs');
const fsPromises = require('fs/promises');

// ES Modules
import fs from 'fs';
import { promises as fsPromises } from 'fs';
```

---

## 二、文件读取

### 1. `fs.readFile()` - 异步读取文件

```javascript
fs.readFile('/path/to/file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 2. `fs.readFileSync()` - 同步读取文件

```javascript
const data = fs.readFileSync('/path/to/file.txt', 'utf8');
console.log(data);
```

### 3. `fsPromises.readFile()` - Promise 方式读取

```javascript
const data = await fsPromises.readFile('/path/to/file.txt', 'utf8');
console.log(data);
```

---

## 三、文件写入

### 1. `fs.writeFile()` - 异步写入文件（覆盖）

```javascript
fs.writeFile('/path/to/file.txt', 'Hello World', 'utf8', (err) => {
  if (err) throw err;
  console.log('文件写入成功');
});
```

### 2. `fs.writeFileSync()` - 同步写入文件

```javascript
fs.writeFileSync('/path/to/file.txt', 'Hello World', 'utf8');
```

### 3. `fs.appendFile()` - 异步追加内容

```javascript
fs.appendFile('/path/to/file.txt', '\n新增内容', (err) => {
  if (err) throw err;
  console.log('追加成功');
});
```

### 4. `fs.appendFileSync()` - 同步追加内容

```javascript
fs.appendFileSync('/path/to/file.txt', '\n新增内容');
```

---

## 四、文件/目录操作

### 1. `fs.rename()` - 重命名/移动文件

```javascript
fs.rename('old.txt', 'new.txt', (err) => {
  if (err) throw err;
  console.log('重命名成功');
});
```

### 2. `fs.unlink()` - 删除文件

```javascript
fs.unlink('/path/to/file.txt', (err) => {
  if (err) throw err;
  console.log('文件已删除');
});
```

### 3. `fs.copyFile()` - 复制文件

```javascript
fs.copyFile('source.txt', 'dest.txt', (err) => {
  if (err) throw err;
  console.log('复制成功');
});
```

### 4. `fs.truncate()` / `fs.truncateSync()` - 截断文件

截断文件到指定长度，如果文件长度大于指定长度，多余部分会被删除；如果小于指定长度，会用空字节填充。

```javascript
// 异步截断
fs.truncate('/path/to/file.txt', 100, (err) => {
  if (err) throw err;
  console.log('文件已截断到 100 字节');
});

// 同步截断
fs.truncateSync('/path/to/file.txt', 100);

// 截断到 0 字节（清空文件内容）
fs.truncateSync('/path/to/file.txt', 0);
console.log('文件内容已清空');
```

**参数说明：**
- `path`: 文件路径
- `len`: 截断后的文件长度（字节），默认为 0

**实际应用示例：**

```javascript
const fs = require('fs');

// 示例：日志文件大小控制
const logFile = './app.log';
const maxSize = 1024 * 1024; // 1MB

const stats = fs.statSync(logFile);
if (stats.size > maxSize) {
  // 保留最后 500KB 的内容
  const keepSize = 500 * 1024;
  const content = fs.readFileSync(logFile, 'utf8');
  const newContent = content.slice(-keepSize);
  fs.writeFileSync(logFile, newContent);
  console.log(`日志文件已从 ${stats.size} 字节截断`);
}

// 示例：使用 ftruncate 配合文件描述符
const fd = fs.openSync('file.txt', 'r+');
fs.ftruncateSync(fd, 50); // 截断到 50 字节
fs.closeSync(fd);
```

---

## 五、目录操作

### 1. `fs.mkdir()` - 创建目录

```javascript
// 创建单层目录
fs.mkdir('/path/to/dir', (err) => {
  if (err) throw err;
});

// 递归创建多层目录
fs.mkdir('/path/to/deep/dir', { recursive: true }, (err) => {
  if (err) throw err;
});
```

### 2. `fs.readdir()` - 读取目录内容

```javascript
fs.readdir('/path/to/dir', (err, files) => {
  if (err) throw err;
  console.log(files); // ['file1.txt', 'file2.txt', 'subdir']
});

// 获取详细信息
fs.readdir('/path/to/dir', { withFileTypes: true }, (err, dirents) => {
  dirents.forEach(dirent => {
    console.log(dirent.name, dirent.isDirectory());
  });
});
```

### 3. `fs.rmdir()` / `fs.rm()` - 删除目录

```javascript
// 删除空目录
fs.rmdir('/path/to/dir', (err) => {
  if (err) throw err;
});

// 递归删除目录及其内容（推荐使用 fs.rm）
fs.rm('/path/to/dir', { recursive: true, force: true }, (err) => {
  if (err) throw err;
});
```

---

## 六、文件状态

### 1. `fs.stat()` - 获取文件信息

```javascript
fs.stat('/path/to/file.txt', (err, stats) => {
  if (err) throw err;
  console.log('是否是文件:', stats.isFile());
  console.log('是否是目录:', stats.isDirectory());
  console.log('文件大小:', stats.size);
  console.log('创建时间:', stats.birthtime);
  console.log('修改时间:', stats.mtime);
});
```

### 2. `fs.existsSync()` - 检查文件是否存在

```javascript
if (fs.existsSync('/path/to/file.txt')) {
  console.log('文件存在');
}
```

### 3. `fs.access()` - 检查文件权限

```javascript
fs.access('/path/to/file.txt', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.log('没有读写权限');
  } else {
    console.log('有读写权限');
  }
});
```

---

## 七、流操作（处理大文件）

### 1. `fs.createReadStream()` - 创建可读流

```javascript
const readStream = fs.createReadStream('/path/to/large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024 // 64KB 块大小
});

readStream.on('data', (chunk) => {
  console.log('读取到数据块:', chunk.length);
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('error', (err) => {
  console.error('读取错误:', err);
});
```

### 2. `fs.createWriteStream()` - 创建可写流

**基本语法：**
```javascript
fs.createWriteStream(path[, options])
```

**第二个参数 options 详解：**

```javascript
const writeStream = fs.createWriteStream('/path/to/output.txt', {
  flags: 'w',           // 文件打开模式，默认 'w'（覆盖写入） 
  encoding: 'utf8',     // 字符编码，默认 'utf8'
  fd: null,             // 文件描述符，如果指定则忽略 path
  mode: 0o666,          // 文件权限，默认 0o666
  autoClose: true,      // 是否自动关闭文件描述符，默认 true
  emitClose: true,      // 流销毁后是否触发 'close' 事件，默认 true
  start: 0,             // 开始写入的位置（字节偏移量）
  highWaterMark: 16384, // 内部缓冲区大小，默认 16KB
});
```

**常用 flags 选项：**

| Flag | 说明 |
|------|------|
| `'w'` | 覆盖写入，文件不存在则创建 |
| `'a'` | 追加写入，文件不存在则创建 |
| `'r+'` | 读写模式，文件必须存在 |
| `'w+'` | 读写模式，覆盖文件 |
| `'a+'` | 读写追加模式 |

**实际应用示例：**

```javascript
// 示例1：追加写入日志
const logStream = fs.createWriteStream('./app.log', {
  flags: 'a',           // 追加模式
  encoding: 'utf8'
});

logStream.write(`[${new Date().toISOString()}] 应用启动\n`);
logStream.write(`[${new Date().toISOString()}] 用户登录\n`);

// 示例2：从指定位置开始写入
const stream = fs.createWriteStream('./data.txt', {
  flags: 'r+',          // 读写模式（不会截断文件）
  start: 100            // 从第 100 字节开始写入
});
stream.write('插入的内容');
stream.end();

// 示例3：大文件写入，控制缓冲区
const bigFileStream = fs.createWriteStream('./big-file.txt', {
  highWaterMark: 64 * 1024  // 64KB 缓冲区
});

// 检测背压（backpressure）
function writeData(data) {
  const canContinue = bigFileStream.write(data);
  if (!canContinue) {
    // 缓冲区已满，等待 drain 事件
    bigFileStream.once('drain', () => {
      console.log('缓冲区已清空，可以继续写入');
    });
  }
}

// 示例4：配合 finish 和 error 事件
const safeStream = fs.createWriteStream('./output.txt', {
  flags: 'w',
  encoding: 'utf8'
});

safeStream.on('finish', () => {
  console.log('所有数据已写入磁盘');
});

safeStream.on('error', (err) => {
  console.error('写入出错:', err.message);
});

safeStream.write('第一行内容\n');
safeStream.write('第二行内容\n');
safeStream.end('最后一行'); // end() 会触发 finish 事件
```

**基本使用示例：**

```javascript
const writeStream = fs.createWriteStream('/path/to/output.txt');

writeStream.write('第一行内容\n');
writeStream.write('第二行内容\n');
writeStream.end('最后一行');

writeStream.on('finish', () => {
  console.log('写入完成');
});
```

### 3. 管道操作 - 复制大文件

```javascript
const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('dest.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('复制完成');
});
```

---

## 八、文件监听

### 1. `fs.watch()` - 监听文件/目录变化

```javascript
const watcher = fs.watch('/path/to/dir', { recursive: true }, (eventType, filename) => {
  console.log(`事件类型: ${eventType}`);
  console.log(`文件名: ${filename}`);
});

// 停止监听
watcher.close();
```

### 2. `fs.watchFile()` - 监听文件变化（轮询方式）

```javascript
fs.watchFile('/path/to/file.txt', { interval: 1000 }, (curr, prev) => {
  console.log('当前修改时间:', curr.mtime);
  console.log('之前修改时间:', prev.mtime);
});
```

---

## 九、Promises API（推荐）

Node.js 提供了基于 Promise 的 fs API，使用更加优雅：

```javascript
const fs = require('fs/promises');

async function fileOperations() {
  try {
    // 读取文件
    const content = await fs.readFile('input.txt', 'utf8');
    
    // 写入文件
    await fs.writeFile('output.txt', content.toUpperCase());
    
    // 获取文件信息
    const stats = await fs.stat('output.txt');
    console.log('文件大小:', stats.size);
    
    // 读取目录
    const files = await fs.readdir('.');
    console.log('目录内容:', files);
    
    // 创建目录
    await fs.mkdir('new-dir', { recursive: true });
    
    // 删除文件
    await fs.unlink('temp.txt');
    
  } catch (err) {
    console.error('操作失败:', err);
  }
}
```

---

## 十、常用 API 速查表

| API | 说明 | 同步版本 |
|-----|------|----------|
| `readFile` | 读取文件内容 | `readFileSync` |
| `writeFile` | 写入文件（覆盖） | `writeFileSync` |
| `appendFile` | 追加内容 | `appendFileSync` |
| `unlink` | 删除文件 | `unlinkSync` |
| `rename` | 重命名/移动 | `renameSync` |
| `copyFile` | 复制文件 | `copyFileSync` |
| `mkdir` | 创建目录 | `mkdirSync` |
| `rmdir` / `rm` | 删除目录 | `rmdirSync` / `rmSync` |
| `readdir` | 读取目录 | `readdirSync` |
| `stat` | 获取文件信息 | `statSync` |
| `access` | 检查文件权限 | `accessSync` |
| `existsSync` | 检查文件存在 | - |

---

## 十一、最佳实践

1. **优先使用异步 API**：避免阻塞事件循环
2. **处理大文件使用流**：避免内存溢出
3. **使用 `fs/promises`**：配合 async/await 更优雅
4. **始终处理错误**：文件操作可能失败
5. **检查文件存在性**：操作前先验证
6. **使用 `path` 模块**：处理跨平台路径问题

```javascript
const path = require('path');
const filePath = path.join(__dirname, 'data', 'file.txt');
```
