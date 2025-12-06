### return Promise 和 return await Promise 的区别

```javascript
async function rejectionWithReturnAwait() {
  try {
    return await Promise.reject(new Error());
  } catch (e) {
    return "Saved!";
  }
}

async function rejectionWithReturn() {
  try {
    return Promise.reject(new Error());
  } catch (e) {
    return "Saved!";
  }
}
```

- 在大多数情况下，在异步函数中使用 `return` 和 `return await` 没有明显的区别。
- 两个版本的行为是相同的，但是由于创建了一个中间的 Promise 对象，`return await` 版本可能会使用稍微更多的内存。
- 然而，在 try-catch 块中嵌套 `return` 或 `return await` 时会有区别：
  - 如果使用 `return await`，异步函数会在返回前等待 Promise，导致被拒绝的 Promise 被转换为异常并进入 catch 块。
  - 如果使用 `return`，异步函数直接返回被拒绝的 Promise，没有等待，导致拒绝被返回给调用者。

因此，在处理异步函数时，考虑在 try-catch 块中使用 `return await` 来确保异常处理正确。
