### customRef

customRef 是 Vue3 提供的一个用于自定义响应式引用的 API，它让我们能够显式地控制依赖追踪和触发响应。本文将详细介绍 customRef 的使用方法

#### 类型

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

- track: 用于追踪依赖的函数
- trigger: 用于触发更新的函数
- get: 获取值时调用
- set: 设置值时调用

#### 实现字符串替换

```ts
const useReplaceRef = (value: string, reg: RegExp, rResult: string) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue.replace(reg, rResult);
        trigger();
      }
    };
  });
};

const value = useReplaceRef("123", / /g, "");
```
