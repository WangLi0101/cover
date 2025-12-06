### 实现一个批处理函数

#### 描述

实现一个 `batcher` 函数，它接受一个异步函数作为参数，并返回该函数的批处理版本。

批处理版本应该能够将多个并发调用合并成一个单一调用，以提高性能和效率。

#### 要求

- `batcher` 函数接受一个异步函数 `fn` 作为参数

- 多个并发调用应被合并成一个对原函数的调用

- 每个调用应该获得正确的结果，就像它们是单独调用的一样

- 批处理应该自动触发，无需手动干预

#### 函数签名

```javascript
const batcher = (fn) => {
  // 在这里实现批处理逻辑
};

// 以下是测试代码，请勿修改
let executeCount = 0;
const targetFn = async (nums) => {
  executeCount++;
  return nums.map((num) => 2 * num + 1);
};

const batchedFn = batcher(targetFn);

const main = async () => {
  const [result1, result2, result3] = await Promise.all([
    batchedFn([1, 2, 3]),
    batchedFn([4, 5]),
    batchedFn([6, 7]),
  ]);

  console.log(result1, result2, result3);
  console.log(executeCount); // 预期为 1
};

main();

// 预期输出：
// [3, 5, 7] [9, 11] [13, 15]
// 1
```

#### 解答

```javascript
const batcher = (fn) => {
  let allArgs = [];
  // 创建一个 Promise，在下一个微任务中执行批处理
  const wait = Promise.resolve().then(() => fn(allArgs));

  return async (args) => {
    // 将当前调用的参数添加到总参数列表中
    allArgs = [...allArgs, ...args];

    // 等待批处理执行完成
    const result = await wait;

    // 创建一个映射，将原始参数与其对应的结果关联
    const resultMap = result.reduce((acc, x, i) => {
      const v = allArgs[i];
      acc[v] = x;
      return acc;
    }, {});

    // 返回与当前调用参数对应的结果
    return args.map((a) => resultMap[a]);
  };
};
```

#### 解释

- `allArgs` 数组用于收集所有调用的参数。

- `wait Promise` 利用 `Promise.resolve().then()` 将批处理函数的执行推迟到下一个微任务，这允许在当前同步代码执行完毕后、事件循环的下一个迭代开始前执行批处理。

- 返回的函数是一个异步函数，它将当前调用的参数添加到 `allArgs` 中。

- 函数等待 `wait Promise` 解决，这时 `fn` 已经用所有收集到的参数执行过了。

- 使用 `reduce` 创建一个 `resultMap`，将原始参数值与其对应的结果关联起来。

- 最后，使用 `map` 返回与当前调用参数对应的结果。

这个实现巧妙地将多个调用合并为一个，同时保证每个调用都能获得正确的结果。它适用于需要频繁调用同一个异步函数的场景，可以显著减少函数的实际执行次数，从而提高性能。
