# HTTP 请求头中的 Range 字段详解

## 什么是 Range 请求头？

`Range` 是 HTTP 请求头中的一个字段，用于向服务器请求资源的特定部分，而不是整个资源。这种请求方式也被称为**范围请求（Range Requests）**或**部分内容请求（Partial Content Requests）**。

通过使用 `Range` 请求头，客户端可以只下载文件的某一部分，这在以下场景中非常有用：
- **断点续传**：下载中断后，从中断位置继续下载
- **视频/音频流媒体**：按需加载媒体片段
- **大文件下载**：分段下载大文件，提高下载效率
- **PDF 预览**：只加载 PDF 的某些页面

---

## Range 请求头的语法

### 基本格式

```http
Range: <unit>=<range-start>-<range-end>
```

### 参数说明

- **unit**：范围单位，通常是 `bytes`（字节）
- **range-start**：起始位置（包含），从 0 开始
- **range-end**：结束位置（包含），可选

### 常见格式示例

```http
# 1. 请求前 500 字节
Range: bytes=0-499

# 2. 请求从第 500 字节到第 999 字节
Range: bytes=500-999

# 3. 请求从第 500 字节到文件末尾
Range: bytes=500-

# 4. 请求最后 500 字节
Range: bytes=-500

# 5. 请求多个范围（多范围请求）
Range: bytes=0-499, 1000-1499, 2000-2499
```

---

## Range 请求的工作流程

### 1. 客户端发起 Range 请求

```http
GET /video.mp4 HTTP/1.1
Host: example.com
Range: bytes=0-1023
```

### 2. 服务器检查是否支持范围请求

服务器通过响应头 `Accept-Ranges` 来告知客户端是否支持范围请求：

```http
Accept-Ranges: bytes     # 支持字节范围请求
Accept-Ranges: none      # 不支持范围请求
```

### 3. 服务器返回部分内容

如果服务器支持范围请求，会返回 **206 Partial Content** 状态码：

```http
HTTP/1.1 206 Partial Content
Content-Type: video/mp4
Content-Length: 1024
Content-Range: bytes 0-1023/5000000
Accept-Ranges: bytes

[二进制数据...]
```

---

## 相关的 HTTP 响应头

### 1. Content-Range

`Content-Range` 响应头用于指示返回的部分内容在整个资源中的位置：

```http
Content-Range: bytes <start>-<end>/<total>
```

**示例**：

```http
Content-Range: bytes 0-1023/5000000
```

- `0-1023`：返回的字节范围
- `5000000`：资源的总字节数
- 如果总大小未知，可以使用 `*` 代替：`bytes 0-1023/*`

### 2. Accept-Ranges

`Accept-Ranges` 响应头表示服务器是否支持范围请求：

```http
Accept-Ranges: bytes     # 支持
Accept-Ranges: none      # 不支持
```

---

## HTTP 状态码

### 206 Partial Content

表示服务器成功处理了范围请求，返回了部分内容。

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 500-999/5000
```

### 416 Range Not Satisfiable

表示请求的范围无效或超出了资源的实际大小。

```http
HTTP/1.1 416 Range Not Satisfiable
Content-Range: bytes */5000
```

**常见原因**：
- 起始位置大于或等于文件大小
- 范围格式错误

### 200 OK

如果服务器不支持范围请求，或者忽略了 `Range` 请求头，会返回完整的资源内容：

```http
HTTP/1.1 200 OK
Content-Length: 5000
```

---

## 实际应用场景

### 1. 断点续传

当下载大文件时，如果连接中断，客户端可以记录已下载的字节数，然后使用 `Range` 请求头继续下载：

```javascript
// 假设已经下载了 1MB (1048576 字节)
fetch('https://example.com/largefile.zip', {
  headers: {
    'Range': 'bytes=1048576-'
  }
})
.then(response => {
  if (response.status === 206) {
    console.log('继续下载...');
    return response.blob();
  }
})
.then(blob => {
  // 将新下载的部分追加到已有文件
});
```

### 2. 视频流媒体播放

HTML5 视频播放器使用范围请求来加载视频片段，实现快进/后退功能：

```javascript
// 浏览器自动发送 Range 请求
const video = document.createElement('video');
video.src = 'https://example.com/video.mp4';
video.currentTime = 30; // 跳转到第30秒

// 浏览器会发送类似这样的请求：
// Range: bytes=5242880-
```

### 3. 分段下载（多线程下载）

下载工具可以同时请求文件的不同部分，然后合并：

```javascript
// 假设文件大小为 10MB (10485760 字节)
const fileSize = 10485760;
const chunkSize = 2097152; // 2MB per chunk

// 分成 5 个部分下载
const chunks = [];
for (let i = 0; i < 5; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize - 1, fileSize - 1);
  
  chunks.push(
    fetch('https://example.com/largefile.zip', {
      headers: {
        'Range': `bytes=${start}-${end}`
      }
    })
  );
}

Promise.all(chunks).then(responses => {
  // 合并所有片段
});
```

### 4. PDF 文档预览

只加载 PDF 的前几页进行快速预览：

```http
GET /document.pdf HTTP/1.1
Host: example.com
Range: bytes=0-102399    # 只请求前 100KB
```

---

## Node.js 中处理 Range 请求

### 服务端实现示例

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'video.mp4');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // 解析 Range 请求头
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    // 检查范围是否有效
    if (start >= fileSize || end >= fileSize) {
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`
      });
      return res.end();
    }

    // 创建文件读取流
    const file = fs.createReadStream(filePath, { start, end });

    // 设置响应头
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });

    // 发送文件流
    file.pipe(res);
  } else {
    // 没有 Range 请求头，返回完整文件
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  }
}).listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

### Express 中间件示例

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/video/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'videos', req.params.filename);
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('文件未找到');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).set({
        'Content-Range': `bytes */${fileSize}`
      });
      return res.end();
    }

    const file = fs.createReadStream(filePath, { start, end });
    res.status(206).set({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    file.pipe(res);
  } else {
    res.status(200).set({
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

---

## 浏览器中使用 Range 请求

### 使用 Fetch API

```javascript
async function downloadWithRange(url, start, end) {
  const response = await fetch(url, {
    headers: {
      'Range': `bytes=${start}-${end}`
    }
  });

  if (response.status === 206) {
    // 成功获取部分内容
    const blob = await response.blob();
    const contentRange = response.headers.get('Content-Range');
    console.log('Content-Range:', contentRange);
    return blob;
  } else if (response.status === 416) {
    console.error('请求的范围无效');
  } else {
    console.log('服务器返回完整内容');
  }
}

// 使用示例
downloadWithRange('https://example.com/video.mp4', 0, 1024*1024)
  .then(blob => {
    console.log('下载了 1MB 数据');
  });
```

### 检查服务器是否支持范围请求

```javascript
async function supportsRangeRequests(url) {
  const response = await fetch(url, {
    method: 'HEAD'  // 只获取响应头
  });
  
  const acceptRanges = response.headers.get('Accept-Ranges');
  return acceptRanges === 'bytes';
}

// 使用示例
supportsRangeRequests('https://example.com/video.mp4')
  .then(supported => {
    console.log('支持范围请求:', supported);
  });
```

### 实现简单的断点续传

```javascript
class ResumableDownloader {
  constructor(url, filename) {
    this.url = url;
    this.filename = filename;
    this.chunks = [];
    this.downloadedBytes = 0;
  }

  async getFileSize() {
    const response = await fetch(this.url, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    return parseInt(contentLength, 10);
  }

  async downloadChunk(start, end) {
    const response = await fetch(this.url, {
      headers: {
        'Range': `bytes=${start}-${end}`
      }
    });

    if (response.status === 206) {
      return await response.arrayBuffer();
    }
    throw new Error('范围请求失败');
  }

  async download(onProgress) {
    const fileSize = await this.getFileSize();
    const chunkSize = 1024 * 1024; // 1MB per chunk
    
    for (let start = 0; start < fileSize; start += chunkSize) {
      const end = Math.min(start + chunkSize - 1, fileSize - 1);
      
      try {
        const chunk = await this.downloadChunk(start, end);
        this.chunks.push(chunk);
        this.downloadedBytes += chunk.byteLength;
        
        if (onProgress) {
          onProgress({
            downloaded: this.downloadedBytes,
            total: fileSize,
            percentage: (this.downloadedBytes / fileSize * 100).toFixed(2)
          });
        }
      } catch (error) {
        console.error(`下载块 ${start}-${end} 失败:`, error);
        throw error;
      }
    }

    // 合并所有块
    const blob = new Blob(this.chunks);
    return blob;
  }

  save(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// 使用示例
const downloader = new ResumableDownloader(
  'https://example.com/largefile.zip',
  'largefile.zip'
);

downloader.download((progress) => {
  console.log(`下载进度: ${progress.percentage}%`);
}).then(blob => {
  downloader.save(blob);
  console.log('下载完成!');
}).catch(error => {
  console.error('下载失败:', error);
});
```

---

## 多范围请求（Multipart Range Requests）

客户端可以在一个请求中请求多个不连续的范围：

### 请求示例

```http
GET /document.pdf HTTP/1.1
Host: example.com
Range: bytes=0-499, 1000-1499, 2000-2499
```

### 响应示例

服务器返回 `multipart/byteranges` 类型的响应：

```http
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES
Content-Length: 1234

--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 0-499/5000

[第一段数据...]
--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 1000-1499/5000

[第二段数据...]
--THIS_STRING_SEPARATES
Content-Type: application/pdf
Content-Range: bytes 2000-2499/5000

[第三段数据...]
--THIS_STRING_SEPARATES--
```

---

## 注意事项和最佳实践

### 1. 验证范围请求

服务端应该验证请求的范围是否有效：

```javascript
function isValidRange(start, end, fileSize) {
  if (start < 0 || end < 0) return false;
  if (start >= fileSize) return false;
  if (end >= fileSize) return false;
  if (start > end) return false;
  return true;
}
```

### 2. 缓存控制

范围请求的响应应该包含适当的缓存控制头：

```http
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### 3. 条件范围请求

客户端可以结合 `If-Range` 头来进行条件范围请求：

```http
GET /video.mp4 HTTP/1.1
Host: example.com
Range: bytes=500-
If-Range: "abc123"    # 如果 ETag 匹配才返回范围内容
```

如果 ETag 不匹配（文件已更新），服务器应该返回完整的新文件（200 OK）。

### 4. 性能考虑

- **小文件**：对于小文件（< 1MB），范围请求可能不会带来性能提升
- **网络开销**：频繁的小范围请求会增加 HTTP 请求开销
- **服务器负载**：大量并发的范围请求可能增加服务器负载

### 5. 安全性

- **范围验证**：始终验证请求的范围，防止越界访问
- **权限检查**：范围请求也应该进行权限验证
- **DoS 防护**：限制单个客户端的并发范围请求数量

---

## 浏览器兼容性

`Range` 请求头在所有现代浏览器中都得到了良好支持：

- ✅ Chrome 1+
- ✅ Firefox 1+
- ✅ Safari 3+
- ✅ Edge（所有版本）
- ✅ Opera 9+
- ✅ IE 9+

---

## 总结

`Range` 请求头是 HTTP 协议中一个强大的特性，它允许客户端请求资源的特定部分，而不是整个资源。主要优势包括：

1. **断点续传**：支持下载中断后继续下载
2. **按需加载**：只加载需要的部分，节省带宽
3. **流媒体播放**：支持视频/音频的快进/后退
4. **并发下载**：支持多线程下载，提高速度

在实现范围请求时，需要注意：
- 服务端必须支持并正确处理范围请求
- 返回正确的状态码（206、416）
- 设置正确的响应头（Content-Range、Accept-Ranges）
- 进行适当的验证和错误处理

通过合理使用 `Range` 请求头，可以显著提升用户体验和应用性能。
