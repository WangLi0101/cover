### 实现 `flat` 函数

```javascript
const flat = (arr) => {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flat(val) : val);
  }, []);
};
```

> `concat` 如果参数是数组，会将数组的元素添加到新数组中， 只是一层
```javascript
[].concat(1) // [1]
[].concat([1]) // [1]
[].concat([1, [2]]) // [1, [2]]
```


### 实现 `flatMap` 函数

```javascript
// 先 flat 再 map
const flatMap = (arr, fn) => {
  return flat(arr).map(fn);
};
const arr = [1, [2, [3, [4, 5]]]];
console.log(flatMap(arr, (item) => item + 1)); // [1, 2, 3, 4, 5]
```

### `Array.prototype.flatMap`

> `Array.prototype.flatMap` 已经是 EcmaScript 的标准, 但是它是先 map 再 flat，而不是先 flat 再 map

```javascript
const arr = [1, [2, [3, [4, 5]]]];
arr.flatMap((item) => item + 1); // [2, '2,3,4,51']
```