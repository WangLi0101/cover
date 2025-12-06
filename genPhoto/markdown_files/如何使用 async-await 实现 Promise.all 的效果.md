### 使用 `async/await` 实现 `Promise.all` 的效果

- `Promise.all` 会等待所有的 Promise 对象都变为 `fulfilled` 状态，或者其中一个变为 `rejected` 状态，才会返回结果。
- `Promise.all` 是并行执行所有任务，也就是说所有任务都是同时开始的，而不是一个接一个地执行。如果只是使用 `await` 来等待每个任务的完成，那么就会变成串行执行。

```javascript
async function runTasks(tasks) {
  let results = [];
  let completedTasks = 0;

  return new Promise((resolve, reject) => {
    // 这里必须使用 forEach，因为 forEach 会立即遍历整个数组，并且同步地调用每个元素的回调函数，不会等待任何异步操作完成。
    tasks.forEach(async (task, index) => {
      try {
        const result = await task();
        // 保证结果的顺序和任务的顺序一致
        results[index] = { status: "fulfilled", value: result };
      } catch (error) {
        reject({ status: "rejected", reason: error.message || error });
      }
      completedTasks++;
      if (completedTasks === tasks.length) {
        resolve(results);
      }
    });
  });
}
```

### 测试

```javascript
// 示例任务函数
async function task1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Task 1 failed");
    }, 1000);
  });
}

async function task2() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("Task 2 completed"), 500)
  );
}

async function task3() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("Task 3 completed"), 2000)
  );
}

// 运行所有任务
(async () => {
  const tasks = [task1, task2, task3];
  try {
    const results = await runTasks(tasks);
    console.log(results);
  } catch (error) {
    console.log(error);
  }
})();
```