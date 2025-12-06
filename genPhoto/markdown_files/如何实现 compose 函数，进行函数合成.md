实现一个 `compose` 函数，进行函数合成

- 函数组合通常是从右到左依次应用函数的。这意味着最后一个函数最先执行，结果再依次传递给前面的函数。所以使用 `reduceRight` 方法
- `...args` 作为初始值，传递给第一个函数
- 执行 `fn(acc)` 的结果作为下一个函数的参数

```javascript
const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((acc, fn) => fn(acc), ...args);
```

```javascript
const add10 = (x) => x + 10;
const mul10 = (x) => x * 10;
const add100 = (x) => x + 100;

// (10 + 100) * 10 + 10 = 1110
compose(add10, mul10, add100)(10);
```