### 手写 instanceof 方法

> `instanceof` 不能检测 `null` 和 `undefined`, 对于基本类型（不是通过 new 创建的），`instanceof` 也无法检测。

```javascript
function fakeInstanceOf(instance, parent) {
  if (!instance) return false;
  // 对于基本类型（不是通过 new 创建的），直接返回 false
  if (typeof instance !== "object" && typeof instance !== "function")
    return false;
  let proto = Object.getPrototypeOf(instance);
  while (proto !== null) {
    if (proto === parent.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

### 测试

```javascript
console.log(fakeInstanceOf([], Array)); // true
console.log(fakeInstanceOf([], Object)); // true
console.log(fakeInstanceOf((x) => x, Object)); // true
console.log(fakeInstanceOf("hello", Object)); // false
console.log(fakeInstanceOf(2, Number)); // false
console.log(fakeInstanceOf(new Number(1), Number)); // true
```