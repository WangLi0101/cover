更多描述 实现一个 sum 函数如下所示：

```javascript
sum(1, 2, 3).valueOf(); //6
sum(2, 3)(2).valueOf(); //7
sum(1)(2)(3)(4).valueOf(); //10
sum(2)(4, 1)(2).valueOf(); //9
sum(1)(2)(3)(4)(5)(6).valueOf(); // 21
```

#### 代码

```javascript
const sum = (...args) => {
  const f = (...rest) => sum(...args, ...rest);
  f.valueOf = () => args.reduce((x, y) => x + y, 0);
  return f;
};
```

#### 拓展

> 如果不使用 valueOf，可直接进行计算，如下示例，应如何处理。

```javascript
//=> 15
sum(1, 2, 3) + sum(4, 5);
 
//=> 100
sum(10) * sum(10);
```

#### 代码

> 我们可以通过重写 `toString` 或 `Symbol.toPrimitive` 方法来实现。

JavaScript 提供了 `Symbol.toPrimitive`，这个方法在对象需要转换为原始值时（比如在运算时）会被调用。我们可以利用它来返回累加结果，从而支持直接进行加法、乘法等运算。


```javascript
function sum(...args) {
  const f = (...rest) => sum(...args, ...rest); // 累积参数
  f[Symbol.toPrimitive] = () => args.reduce((x, y) => x + y, 0); // 在进行运算时返回累加结果
  return f;
}
```