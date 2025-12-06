# useSyncExternalStore 钩子

`useSyncExternalStore` 是 React 18 中引入的一个钩子，用于订阅外部数据源。它提供了一种与外部状态系统（如 Redux、MobX 或自定义存储）同步的方式，特别适用于处理频繁更新的数据。

## 基本语法

```jsx
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

### 参数说明

- **subscribe**: 一个接收回调函数的订阅函数，当存储更新时调用该回调
- **getSnapshot**: 一个返回存储当前值的函数
- **getServerSnapshot**: (可选) 一个返回服务器端渲染期间使用的快照的函数

## 实际使用案例

下面是一个使用 `useSyncExternalStore` 监听 localStorage 变化的例子：

```ts
import { useSyncExternalStore } from 'react';

export const useStorage = (key, initialValue) => {
  // 更新存储并触发事件
  const updateStorage = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("storage"));
  };
  
  // 订阅函数：添加和移除事件监听器
  const subscribe = (callback) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };

  // 获取当前值的快照
  const getSnapshot = () => {
    return Number(localStorage.getItem(key)) || initialValue;
  };

  // 使用useSyncExternalStore获取同步的值
  const value = useSyncExternalStore(subscribe, getSnapshot);

  return [value, updateStorage];
};
```

## 组件使用示例

```jsx
import { useStorage } from './useStorage';

const ExternalStore = () => {
  const [value, updateStorage] = useStorage("count", 0);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      <button 
        onClick={() => updateStorage(value + 1)} 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        增加
      </button>
    </div>
  );
};
```

## 使用场景

1. **浏览器API**: 订阅窗口大小、网络状态等
2. **第三方库**: 与Redux、MobX等状态管理库集成
3. **自定义存储**: 创建自定义的外部数据存储
4. **实时数据**: 处理WebSocket或Server-Sent Events

## 优势

- **并发渲染安全**: 专为React的并发渲染模式设计
- **一致性保证**: 确保在渲染过程中值不会改变
- **性能优化**: 自动处理订阅和取消订阅，避免不必要的重渲染
- **服务器端渲染支持**: 通过可选的getServerSnapshot参数支持SSR
