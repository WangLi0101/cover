### 代码

```javascript
function flatten(arr, dep) {
  return arr.reduce((a, b) => {
    return dep > 1
      ? a.concat(Array.isArray(b) ? flatten(b, dep - 1) : b)
      : a.concat(b);
  }, []);
}
```

### 测试

```javascript
console.log(flatten([1, [2, [3, [4, 5], 6], 7], 8], 1)); // [1, 2, [3, [4, 5], 6], 7, 8]
console.log(flatten([1, [2, [3, [4, 5], 6], 7], 8], 2)); // [1, 2, 3, [4, 5], 6, 7, 8]
console.log(flatten([1, [2, [3, [4, 5], 6], 7], 8], 3)); // [1, 2, 3, 4, 5, 6, 7, 8]
```