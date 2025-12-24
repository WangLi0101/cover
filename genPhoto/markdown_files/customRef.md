### customRef

`customRef` 是 Vue3 提供的一个用于**自定义响应式引用**的 API，它让我们能够显式地控制依赖追踪和触发响应。与普通的 `ref` 不同，`customRef` 可以让开发者完全控制 getter 和 setter 的行为，非常适合实现**数据格式化**，**数据持久化**等场景。

---

## 核心概念

### 类型定义

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

### 参数说明

| 参数 | 作用 | 调用时机 |
|------|------|----------|
| `track` | 追踪依赖 | 在 `get` 中调用，告诉 Vue 这个值被读取了 |
| `trigger` | 触发更新 | 在 `set` 中调用，告诉 Vue 这个值变化了 |
| `get` | 获取当前值 | 当访问 `.value` 时调用 |
| `set` | 设置新值 | 当给 `.value` 赋值时调用 |

> ⚠️ **注意**：`track()` 和 `trigger()` 的调用时机非常重要，遗漏调用会导致响应式失效

---

## 实用示例

### 1. 字符串格式化 Ref

设置值时自动进行格式化处理：

```ts
function useReplaceRef(initialValue: string, pattern: RegExp, replacement: string) {
  let value = initialValue
  
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      value = newValue.replace(pattern, replacement)
      trigger()
    }
  }))
}

// 使用示例：自动去除空格
const phoneNumber = useReplaceRef('', /\s/g, '')

// 使用示例：只保留数字
const numericInput = useReplaceRef('', /[^\d]/g, '')
```

### 2. LocalStorage 同步 Ref

自动与 LocalStorage 同步的响应式数据：

```ts
function useLocalStorageRef<T>(key: string, defaultValue: T) {
  // 初始化时从 localStorage 读取
  const stored = localStorage.getItem(key)
  let value: T = stored ? JSON.parse(stored) : defaultValue
  
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      value = newValue
      localStorage.setItem(key, JSON.stringify(newValue))
      trigger()
    }
  }))
}

// 使用示例
const theme = useLocalStorageRef('theme', 'light')
```



## 与普通 ref 的对比

| 特性 | `ref` | `customRef` |
|------|-------|-------------|
| 使用复杂度 | 简单 | 较复杂 |
| 自定义 getter/setter | ❌ | ✅ |
| 防抖/节流 | 需要额外处理 | 内置支持 |
| 数据格式化 | 需要 watch | 直接在 set 中处理 |
| 验证逻辑 | 需要额外代码 | 可在 set 中拦截 |
| 性能 | 标准 | 可优化 |

---

## 注意事项

- `customRef` 返回的是一个标准的 `Ref` 对象，使用 `.value` 访问和修改
- 不要在 `get` 中修改值，保持 getter 的纯净性
- 避免在 `set` 中进行耗时操作，可能阻塞渲染
- 对于复杂逻辑，考虑结合 `computed` 和 `watch` 使用
