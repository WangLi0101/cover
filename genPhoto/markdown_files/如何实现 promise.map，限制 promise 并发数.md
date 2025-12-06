### 如何实现 promise.map，限制 promise 并发数

有以下测试用例

```javascript
pMap([1, 2, 3, 4, 5], (x) => Promise.resolve(x + 1)).then(console.log);

pMap([Promise.resolve(1), Promise.resolve(2)], (x) => x + 1).then(console.log);

const start = Date.now();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
pMap([1, 1, 1, 1, 1, 1, 1, 1], () => sleep(1000), { concurrency: 2 }).then(
  () => {
    console.log(`Elapsed time: ${Date.now() - start}ms`);
  }
);
```

### 实现

```javascript
function pMap(iterable, mapper, { concurrency = Infinity } = {}) {
  return new Promise((resolve, reject) => {
    // 存储最终结果的数组，保证结果顺序与输入顺序一致
    const results = [];
    // 创建一个迭代器，遍历输入的可迭代对象
    const iterator = iterable[Symbol.iterator]();
    // 当前并发任务数
    let running = 0;
    // 当前索引，用于确保结果按顺序存储
    let index = 0;

    // 定义处理下一个任务的函数
    const next = () => {
      // 如果当前并发任务数已达到最大并发数，则等待
      if (running >= concurrency) return;

      // 从迭代器中获取下一个值
      const { value, done } = iterator.next();

      // 如果没有更多的任务要处理
      if (done) {
        // 当所有任务完成并且没有正在运行的任务时，resolve返回结果
        if (running === 0) resolve(results);
        return;
      }

      // 保存当前索引，确保异步操作完成后结果存储在正确的位置
      const currentIndex = index++;
      // 增加并发任务数
      running++;

      // 处理当前的任务，将其包装在 Promise 中
      Promise.resolve(value)
        .then(mapper) // 执行传入的映射函数
        .then((result) => {
          results[currentIndex] = result; // 将结果存储在对应的索引位置
        })
        .finally(() => {
          // 当前任务完成后，减少并发任务数
          running--;
          next(); // 继续处理下一个任务
        })
        .catch(reject); // 如果发生错误，直接 reject 整个 Promise

      next(); // 启动并发控制，可能启动多个任务
    };

    // 启动第一次任务处理
    next();
  });
}
```