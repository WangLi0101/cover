### Number.isNaN 与 globalThis.isNaN 有何区别

```javascript
Number.isNaN(NaN) // true
isNaN(NaN) // true

Number.isNaN(undefined) // false
isNaN(undefined) // true

Number.isNaN('NaN') // false
isNaN('NaN') // true
```

- `Number.isNaN` 不会强制将参数转换为数字，而 `isNaN` 会强制将参数转换为数字
- `Number.isNaN` 比 `isNaN` 更严格，不会将非数字字符串视为数字
