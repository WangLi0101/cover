# Web Worker 详解

## 什么是 Web Worker

Web Worker 是 HTML5 引入的一种机制，允许 JavaScript 在**独立的后台线程**中运行脚本，从而避免阻塞主线程。这使得 Web 应用程序可以执行计算密集型或高延迟的任务（如图像处理、数据分析、复杂计算等），而不会导致页面卡顿或无响应。

## 为什么需要 Web Worker

JavaScript 是单线程的，所有任务都在主线程上执行。当遇到以下场景时，主线程可能会被阻塞：

- **复杂计算**：大数据量排序、加密解密运算
- **大文件处理**：文件读取、图片处理
- **数据转换**：JSON 解析大型数据
- **实时数据处理**：音视频编解码

使用 Web Worker 可以将这些耗时操作移到后台线程，保持 UI 的流畅响应。

## Web Worker 类型

### 1. 专用 Worker (Dedicated Worker)

最常见的类型，由单个脚本使用，与创建它的页面一一对应。

```javascript
// main.js
const worker = new Worker('worker.js');
```

### 2. 共享 Worker (Shared Worker)

可以被同源的多个页面共享使用，不同窗口、iframe 可以共享同一个 Worker。

```javascript
// main.js
const sharedWorker = new SharedWorker('shared-worker.js');
```

## 基本用法

### 创建 Worker

**主线程 (main.js)**

```javascript
// 方式一：引入外部脚本
const worker = new Worker('worker.js');

// 方式二：使用 Blob 创建内联 Worker
const workerCode = `
  self.onmessage = function(e) {
    const result = e.data * 2;
    self.postMessage(result);
  };
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

### 主线程与 Worker 通信

**主线程 (main.js)**

```javascript
// 创建 Worker
const worker = new Worker('worker.js');

// 发送消息给 Worker
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });

// 接收 Worker 返回的消息
worker.onmessage = function(event) {
  console.log('收到 Worker 计算结果:', event.data);
};

// 监听错误
worker.onerror = function(error) {
  console.error('Worker 发生错误:', error.message);
};

// 终止 Worker
// worker.terminate();
```

**Worker 脚本 (worker.js)**

```javascript
// 监听主线程发来的消息
self.onmessage = function(event) {
  const { type, data } = event.data;
  
  if (type === 'calculate') {
    // 执行耗时计算
    const result = data.reduce((sum, num) => sum + num, 0);
    
    // 返回结果给主线程
    self.postMessage({ type: 'result', result });
  }
};

// 也可以使用 addEventListener
self.addEventListener('message', function(event) {
  console.log('收到消息:', event.data);
});

// 主动关闭 Worker
// self.close();
```

## 传递数据的方式

### 1. 结构化克隆 (Structured Clone)

默认情况下，数据通过**结构化克隆算法**进行复制传递，发送的是数据的副本。

```javascript
// 主线程
const data = { name: 'test', values: [1, 2, 3] };
worker.postMessage(data);  // data 被克隆后发送
data.name = 'modified';    // 不影响 Worker 收到的数据
```

### 2. 可转移对象 (Transferable Objects)

对于大型二进制数据，可以使用**可转移对象**来避免复制，采用**所有权转移**方式，性能更高。

```javascript
// 创建 ArrayBuffer
const buffer = new ArrayBuffer(1024 * 1024); // 1MB

// 转移 buffer 所有权给 Worker
worker.postMessage(buffer, [buffer]);

// 转移后，主线程的 buffer.byteLength 变为 0
console.log(buffer.byteLength); // 0
```

支持转移的对象类型：
- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

### 3. 共享内存 (SharedArrayBuffer)

使用 `SharedArrayBuffer` 可以实现主线程和 Worker 之间的**内存共享**。

```javascript
// 主线程
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

worker.postMessage({ buffer: sharedBuffer });

// 修改共享数据
sharedArray[0] = 42;
```

```javascript
// worker.js
self.onmessage = function(event) {
  const sharedArray = new Int32Array(event.data.buffer);
  console.log(sharedArray[0]); // 42 - 可以读取主线程设置的值
  
  // 使用 Atomics 进行原子操作，避免竞态条件
  Atomics.add(sharedArray, 0, 10);
};
```

> ⚠️ **注意**：使用 `SharedArrayBuffer` 需要确保页面启用了 COOP 和 COEP 头部。

## Worker 中可用的 API

Worker 运行在独立的全局上下文中（`WorkerGlobalScope`），**不能访问 DOM**，但可以使用以下 API：

### ✅ 可以使用

| API | 说明 |
|-----|------|
| `fetch()` / `XMLHttpRequest` | 网络请求 |
| `setTimeout()` / `setInterval()` | 定时器 |
| `Promise` / `async/await` | 异步操作 |
| `WebSocket` | WebSocket 连接 |
| `IndexedDB` | 本地数据库 |
| `crypto` | 加密 API |
| `navigator` | 部分导航器信息 |
| `location` | 只读的 location 信息 |
| `importScripts()` | 导入外部脚本 |
| `Blob` / `FileReader` | 文件处理 |
| `atob()` / `btoa()` | Base64 编解码 |
| `console` | 调试输出 |

### ❌ 不能使用

| API | 说明 |
|-----|------|
| `document` | DOM 对象 |
| `window` | 全局 window 对象 |
| `parent` | 父级窗口 |
| `localStorage` / `sessionStorage` | 同步存储 |
| `alert()` / `confirm()` | 弹窗方法 |



```javascript
class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
    this.workers = [];
    this.taskQueue = [];
    this.workerStatus = [];
    
    // 创建 Worker 池
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
      this.workerStatus.push(false); // false 表示空闲
      
      worker.onmessage = (event) => {
        this.workerStatus[i] = false;
        const { resolve } = event.data._meta;
        delete event.data._meta;
        resolve(event.data);
        this.processQueue();
      };
    }
  }
  
  // 执行任务
  exec(data) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  // 处理队列
  processQueue() {
    if (this.taskQueue.length === 0) return;
    
    const idleIndex = this.workerStatus.findIndex(status => !status);
    if (idleIndex === -1) return; // 没有空闲 Worker
    
    const task = this.taskQueue.shift();
    this.workerStatus[idleIndex] = true;
    
    this.workers[idleIndex].postMessage({
      ...task.data,
      _meta: { resolve: task.resolve }
    });
  }
  
  // 销毁所有 Worker
  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.workerStatus = [];
  }
}

// 使用示例
const pool = new WorkerPool('compute-worker.js', 4);

const tasks = [1, 2, 3, 4, 5, 6, 7, 8].map(n => pool.exec({ value: n }));
Promise.all(tasks).then(results => {
  console.log('所有任务完成:', results);
  pool.terminate();
});
```

## 在现代框架中使用

### Vue 3 + Vite + Web Worker

**useWorker.ts（组合式函数）**

```typescript
import { ref, onUnmounted, shallowRef } from 'vue';

export function useWorker<T, R>(workerFactory: () => Worker) {
  const workerRef = shallowRef<Worker | null>(null);
  const result = ref<R | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 初始化 Worker
  const initWorker = () => {
    if (workerRef.value) return;
    
    workerRef.value = workerFactory();
    
    workerRef.value.onerror = (e) => {
      error.value = new Error(e.message);
      loading.value = false;
    };
  };

  // 发送消息并返回 Promise
  const postMessage = (data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      initWorker();
      
      if (!workerRef.value) {
        reject(new Error('Worker not initialized'));
        return;
      }

      loading.value = true;
      error.value = null;

      workerRef.value.onmessage = (e: MessageEvent<R>) => {
        result.value = e.data as R;
        loading.value = false;
        resolve(e.data);
      };

      workerRef.value.postMessage(data);
    });
  };

  // 终止 Worker
  const terminate = () => {
    workerRef.value?.terminate();
    workerRef.value = null;
  };

  // 组件卸载时自动清理
  onUnmounted(() => {
    terminate();
  });

  return {
    result,
    loading,
    error,
    postMessage,
    terminate
  };
}
```

**worker.ts（Worker 脚本）**

```typescript
// 监听主线程消息
self.onmessage = (e: MessageEvent<number>) => {
  const input = e.data;
  
  // 模拟耗时计算
  let result = 0;
  for (let i = 0; i <= input; i++) {
    result += i;
  }
  
  // 返回结果
  self.postMessage(result);
};

export {}; // 确保这是一个模块
```

**Calculator.vue（组件使用示例）**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useWorker } from './useWorker';

// 创建 Worker（Vite 特定语法）
// 使用 new URL() + import.meta.url 的方式引入 Worker 脚本
// 路径可以是相对路径，根据实际项目结构调整
const { result, loading, error, postMessage } = useWorker<number, number>(
  () => new Worker(
    new URL('../../webworker/worker.ts', import.meta.url),
    { type: 'module' }
  )
);

const inputValue = ref(1000000);

const handleCalculate = async () => {
  try {
    const res = await postMessage(inputValue.value);
    console.log('计算结果:', res);
  } catch (e) {
    console.error('计算失败:', e);
  }
};
</script>

<template>
  <div class="calculator">
    <input v-model.number="inputValue" type="number" />
    <button @click="handleCalculate" :disabled="loading">
      {{ loading ? '计算中...' : '开始计算' }}
    </button>
    <p v-if="result !== null">结果: {{ result }}</p>
    <p v-if="error" class="error">错误: {{ error.message }}</p>
  </div>
</template>
```

**vite.config.ts 配置**

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  worker: {
    format: 'es' // 使用 ES 模块格式
  }
});
```

## 调试 Worker

### Chrome DevTools

1. 打开 DevTools → Sources 面板
2. 在左侧文件树中找到 Worker 脚本
3. 可以像普通 JS 一样设置断点调试

### 日志输出

Worker 中的 `console.log()` 会输出到主页面的控制台。

```javascript
// worker.js
console.log('[Worker] 开始工作...');
console.table({ worker: 'data' });
```

## 注意事项与最佳实践

### ⚠️ 注意事项

1. **同源限制**：Worker 脚本必须与主页面同源
2. **文件协议**：在 `file://` 协议下 Worker 可能无法正常工作
3. **脚本类型**：Worker 接收的是脚本 URL，不是模块路径

### ✅ 最佳实践

1. **合理评估使用场景**：简单任务不需要 Worker，避免过度设计
2. **减少通信开销**：批量发送数据，减少 `postMessage` 调用次数
3. **使用 Transferable Objects**：大型二进制数据使用可转移对象
4. **及时终止 Worker**：任务完成后调用 `terminate()` 释放资源
5. **错误处理**：始终监听 `onerror` 事件
6. **Worker 池**：频繁创建 Worker 开销大，考虑使用 Worker 池复用

## 浏览器兼容性

Web Worker 在现代浏览器中得到广泛支持：

| 浏览器 | 专用 Worker | 共享 Worker | 模块 Worker |
|--------|-------------|-------------|-------------|
| Chrome | ✅ 4+ | ✅ 4+ | ✅ 80+ |
| Firefox | ✅ 3.5+ | ✅ 29+ | ✅ 114+ |
| Safari | ✅ 4+ | ⚠️ 部分 | ✅ 15+ |
| Edge | ✅ 12+ | ✅ 79+ | ✅ 80+ |

## 相关资源

- [MDN Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [Using Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Transferable Objects](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Transferable_objects)
