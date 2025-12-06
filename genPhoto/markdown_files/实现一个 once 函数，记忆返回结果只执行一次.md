```javascript
function once(fn) {
  let result;
  return function(...args) {
    // 重新给 result 赋值
    result = result || fn.apply(this, args);
    return result; 
  };
}
```

### 测试

```javascript
function add(a, b) {
  console.log('Function executed');
  return a + b;
}

const addOnce = once(add);

console.log(addOnce(1, 2)); // 输出: Function executed \n 3
console.log(addOnce(5, 6)); // 输出: 3
```