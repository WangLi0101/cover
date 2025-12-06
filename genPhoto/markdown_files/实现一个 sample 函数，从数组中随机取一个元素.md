### 代码

```javascript
const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
```

### 测试

```javascript
const arr = [1, 2, 3, 4, 5];
const result = sample(arr);
console.log(result);
```