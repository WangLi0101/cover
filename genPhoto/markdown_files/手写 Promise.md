### `Promise` 规范

- `promise` 有三个状态：`pending`，`fulfilled`，和 `rejected`；
- `new promise` 时， 需要传递一个 `executor()` 执行器，执行器立即执行；
- `executor` 接受两个参数，分别是 `resolve` 和 `reject`；
- `promise` 的默认状态 `status` 是 `pending`；
- `promise` 有一个 `value` 保存成功状态的值，可以是 `undefined/thenable/promise`；
- `promise` 有一个 `reason` 保存失败状态的值；
- `promise` 只能从 `pending` 到 `rejected`, 或者从 `pending` 到 `fulfilled`，状态一旦确认，就不会再改变；
- `promise` 必须有一个 `then` 方法，`then` 接收两个参数，分别是 `promise` 成功的回调 `onFulfilled`，和 `promise` 失败的回调 `onRejected`；
- 如果调用 `then` 时，`promise` 已经成功，则执行 `onFulfilled`，参数是 `promise` 的 `value`；
- 如果调用 `then` 时，`promise` 已经失败，那么执行 `onRejected`，参数是 `promise` 的 `reason`；
- 如果 `then` 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 `then` 的失败的回调 `onRejected`；
- `then` 的参数 `onFulfilled` 和 `onRejected` 可以缺省，如果 `onFulfilled` 或者 `onRejected` 不是函数，将其忽略，且依旧可以在下面的 `then` 中获取到之前返回的值；
- `promise` 可以 `then` 多次，每次执行完 `promise.then` 方法后返回的都是一个新的 `promise`；
- 如果 `then` 的返回值 `x` 是一个普通值，那么就会把这个结果作为参数，传递给下一个 `then` 的成功的回调中；
- 如果 `then` 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 `then` 的失败的回调中；
- 如果 `then` 的返回值 `x` 是一个 `promise`，那么会等这个 `promise` 执行完，`promise` 如果成功，就走下一个 `then` 的成功；如果失败，就走下一个 `then` 的失败；如果抛出异常，就走下一个 `then` 的失败；
- 如果 `then` 的返回值 `x` 和 `promise` 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 `then` 的失败的回调中；
- 如果 `then` 的返回值 `x` 是一个 `promise`，且 `x` 同时调用 `resolve` 函数和 `reject` 函数，则第一次调用优先，其他所有调用被忽略；

```javascript
// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

const resolvePromise = (promise2, x, resolve, reject) => {
  // 避免循环引用
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  // 为了避免 resolve 和 reject 被多次调用，使用了 called 变量来判断是否已经调用过其中之一。
  let called;
  // 判断 x 是否为对象或函数
  if ((typeof x === "object" && x != null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        // 不要写成 x.then，直接 then.call 就可以了，否则可能会再次触发 getter，Object.defineProperty 的 getter 是可以无限套的
        then.call(
          x,
          (y) => {
            // 根据 promise 的状态决定是成功还是失败
            if (called) return;
            called = true;
            // 递归解析的过程（因为可能 promise 中还有 promise）
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            // 只要失败就失败
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 如果 x 是个普通值就直接返回 resolve 作为结果
    resolve(x);
  }
};

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      // 如果 value 是个 promise，递归执行
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    //解决 onFufilled，onRejected 没有传值的问题
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 使用 setTimeout， 根据规范，Promise 的 .then 回调应该在当前同步代码执行完毕后异步执行。
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
```

### 为什么使用 `setTimeout`

```javascript
let promise = new MyPromise((resolve) => {
  resolve("Success");
});

promise
  .then((value) => {
    console.log("Then 1:", value);
    return "Next Value";
  })
  .then((value) => {
    console.log("Then 2:", value);
  });

console.log("End of script");
```

#### 执行顺序（如果没有 `setTimeout`）：

如果没有使用 `setTimeout`, `Then1` 会最先输出

#### 执行顺序（使用 `setTimeout`）：

使用 `setTimeout` 后，日志输出顺序会是：

```bash
End of script
Then 1: Success
Then 2: Next Value
```

这种执行顺序是符合规范的，因为 `.then` 的回调是在当前事件循环结束后才执行。

### 为什么使用 `then.call` 而不是 `x.then`

```javascript
let x = {
  // getter 会返回一个函数并立即调用它
  get then() {
    console.log("`then` property accessed");
    return function (resolve, reject) {
      resolve("Resolved from thenable object");
    };
  },
};

// 获取 then 函数
let then = x.then;

// 使用 then.call
then.call(
  x,
  (value) => {
    console.log("Success:", value);
  },
  (reason) => {
    console.log("Error:", reason);
  }
);

// 直接调用 x.then
x.then(
  (value) => {
    console.log("Success:", value);
  },
  (reason) => {
    console.log("Error:", reason);
  }
);
```

#### 代码解释

- **`x` 对象**:
  - `x` 是一个对象，它有一个 `then` 属性，这个属性是通过 getter 实现的。每次访问 `x.then` 时，都会触发 getter，并输出 "`then` property accessed"`。
- **使用 `then.call(x, ...)`**:
  - `then.call(x, ...)` 只会触发一次 `x` 的 `then` 属性访问，因为 `then` 被立即提取并执行。
- **直接调用 `x.then(...)`**:
  - 如果你直接调用 `x.then(...)`，那么在属性访问时会触发 getter，这里实际上访问了两次 `then`：第一次是获取方法，第二次是调用方法。这会导致额外的不必要的属性访问。

### `Promise` 方法实现

#### `Promise.resolve`

```javascript
MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value);
  });
};
```

#### `Promise.reject`

```javascript
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};
```

#### `Promise.catch`

```javascript
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

#### `Promise.finally`

```javascript
// finally 方法实际上是 then 方法的一个特例，无论 promise 是成功还是失败，都会执行 finally 中的回调
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => value);
    },
    (reason) => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason;
      });
    }
  );
};
```

#### `Promise.all`

```javascript
// Promise.all 方法接收一个 promise 数组，返回一个新的 promise，只有所有的 promise 都成功才算成功，有一个失败就算失败
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    let result = [];
    let count = 0;
    let len = promises.length;
    for (let i = 0; i < len; i++) {
      promises[i].then(
        (value) => {
          result[i] = value;
          count++;
          if (count === len) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
};
```

#### `Promise.race`

```javascript
// Promise.race 方法接收一个 promise 数组，返回一个新的 promise，只要有一个 promise 成功或失败，新的 promise 就会成功或失败
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
};
```

#### `Promise.allSettled`

```javascript
// Promise.allSettled 方法接收一个 promise 数组，返回一个新的 promise，只有所有的 promise 都 settled（即不是 pending 状态）才算成功，返回一个包含所有 promise 状态的数组
MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve) => {
    let result = [];
    let count = 0;
    let len = promises.length;
    for (let i = 0; i < len; i++) {
      promises[i].then(
        (value) => {
          result[i] = { status: "fulfilled", value };
          count++;
          if (count === len) {
            resolve(result);
          }
        },
        (reason) => {
          result[i] = { status: "rejected", reason };
          count++;
          if (count === len) {
            resolve(result);
          }
        }
      );
    }
  });
};
```

#### `Promise.any`

```javascript
// Promise.any 方法接收一个 Promise 数组，只要其中的一个 Promise 成功就返回成功的值，只有当所有的 Promise 都失败时，才返回一个失败的原因（会返回一个 AggregateError，包含所有失败的原因）。
MyPromise.any = function (promises) {
  return new MyPromise((resolve, reject) => {
    let errors = [];
    let count = 0;
    let len = promises.length;

    if (len === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }

    for (let i = 0; i < len; i++) {
      promises[i].then(
        (value) => {
          resolve(value);  // 一旦有一个 promise 成功，立即 resolve
        },
        (reason) => {
          errors[i] = reason;
          count++;
          if (count === len) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    }
  });
};
```