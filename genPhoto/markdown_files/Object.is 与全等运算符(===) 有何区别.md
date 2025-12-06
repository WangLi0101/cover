### Object.is 与全等运算符(===)有何区别

`Object.is`方法和全等运算符(===)都用于比较两个值是否严格相等，但它们有一些区别。

- `Object.is`的不同之处在于处理一些特殊情况，例如`NaN`与`NaN`相等，`+0`与`-0`不相等。
- `Object.is`是一个静态方法，而全等运算符是 JavaScript 语言内置的一个运算符。

> 在大多数情况下，`Object.is`和全等运算符会得到相同的结果，但在处理一些特殊情况时，`Object.is`可能会更符合预期的结果。

当比较 NaN 时：

```javascript
Object.is(NaN, NaN); // true
NaN === NaN; // false
```

当比较+0 和-0 时：

```javascript
Object.is(+0, -0); // false
+0 === -0; // true
```