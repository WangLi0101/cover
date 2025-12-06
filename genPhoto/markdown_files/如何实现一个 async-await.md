### 将生成器函数转化为可以使用 `Promise` 的异步函数

```javascript
// 将生成器函数(genFunction)转换为可以处理Promise的异步函数
function asyncToGen(genFunction) {
  // 返回一个新的函数，这个函数接受任意数量的参数 (...args)
  return function (...args) {
    // 使用 apply 调用生成器函数，以当前的 this 和传入的参数为上下文
    const gen = genFunction.apply(this, args);
    // 返回一个新的 Promise，异步执行生成器函数
    return new Promise((resolve, reject) => {
      // 定义一个内部的 step 函数，用于递归地处理生成器的每一步
      function step(key, arg) {
        let genResult;
        try {
          // 使用 key ('next' 或 'throw') 调用生成器的对应方法
          // 初次调用时使用 'next'，后续根据 Promise 的结果调用 'next' 或 'throw'
          genResult = gen[key](arg);
        } catch (err) {
          // 如果在调用生成器方法时出现错误，则直接 reject Promise
          return reject(err);
        }
        // 从生成器结果中解构出 value 和 done
        const { value, done } = genResult;
        // 如果生成器已经完成 (done 为 true)，则 resolve 最终结果
        if (done) return resolve(value);
        // 如果生成器尚未完成 (done 为 false)，继续处理
        // 将当前生成器的 value 解析为 Promise，并在 Promise 完成后调用 step 函数继续执行
        return Promise.resolve(value).then(
          (val) => {
            // 使用 'next' 继续生成器的下一步
            step("next", val);
          },
          (err) => {
            // 如果 Promise 被拒绝，使用 'throw' 将错误传回生成器
            step("throw", err);
          }
        );
      }
      // 初次调用 step 函数，从生成器的第一步开始 ('next')
      step("next");
    });
  };
}
```

#### 用法

```javascript
const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve("data"), 1000));
function* testG() {
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}

const gen = asyncToGen(testG);
gen().then((res) => console.log(res));
```

> `asyncToGen` 的作用是将一个生成器函数（`generator function`）转换成一个可以使用 `Promise` 的异步函数，从而让生成器函数能够像 `async/await` 一样工作。如果你直接调用 `testG`，你将不能自动处理 `Promise`，而需要手动控制生成器的执行流，这样代码会变得复杂且难以维护。

> `gen.throw()` 方法用于向生成器内部抛出一个异常。通过调用这个方法，你可以在生成器函数中间的 `yield` 表达式处抛出一个错误，使生成器能够处理这个错误，或者将其传播出去。