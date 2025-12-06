# useEffectEvent - React 19 Hook 详解

## 📌 概述

`useEffectEvent` 是 React 19 中的一个 Hook，用于从 Effect 中提取非响应式逻辑。它允许你创建一个"Effect 事件"（Effect Event），这个事件总是能读取到 props 和 state 的最新值，但不会触发 Effect 重新执行。

> ✅ **React 19 正式 API**: 此 Hook 已在 React 19 中正式发布，可以在生产环境中使用。

## 🎯 为什么需要 useEffectEvent？

### 问题场景

在使用 `useEffect` 时，我们经常遇到这样的困境：

```jsx
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      // 我们想使用最新的 theme 值
      showNotification('已连接!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]); // 😕 但把 theme 加入依赖会导致重连
}
```

**问题**：
- 我们需要在回调中使用 `theme` 的最新值
- 但如果把 `theme` 加入依赖数组，每次 `theme` 变化都会断开并重新连接聊天室
- 这不是我们想要的行为！

### 解决方案：useEffectEvent

```jsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    // ✅ 总是读取最新的 theme 值
    showNotification('已连接!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected(); // 调用 Effect 事件
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 不需要声明 theme 作为依赖
}
```

## 🔧 基本语法

```jsx
import { useEffectEvent, useEffect } from 'react';

function MyComponent() {
  const onSomething = useEffectEvent((param) => {
    // 这里可以读取最新的 props 和 state
    // 而不会触发 Effect 重新运行
  });
}
```

## 📚 详细示例

### 示例 1：聊天室连接通知（官方经典示例）

**场景描述**：我们有一个聊天室组件，当连接成功时需要显示一个通知。通知的样式由 `theme` 决定。

#### ❌ 错误做法：把 theme 加入依赖

```jsx
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    
    connection.on('connected', () => {
      // 需要使用 theme 来显示通知
      showNotification('已连接到 ' + roomId, theme);
    });
    
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]); // 😕 问题：theme 变化也会导致断开重连！
}
```

**问题**：用户只是切换了深色/浅色主题，聊天室却断开重连了，这显然不合理。

#### ✅ 正确做法：使用 useEffectEvent

```jsx
function ChatRoom({ roomId, theme }) {
  // 把"显示通知"这个逻辑提取为 Effect 事件
  const onConnected = useEffectEvent(() => {
    // ✅ 这里始终能读取到最新的 theme 值
    showNotification('已连接到 ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    
    connection.on('connected', () => {
      onConnected(); // ✅ 在 Effect 内部调用
    });
    
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 只有 roomId 变化才会重连，theme 变化不影响
}
```

**效果**：
- 切换房间 → 断开旧连接，连接新房间 ✅
- 切换主题 → 只影响下次通知的样式，不会重连 ✅

### 示例 2：定时器轮询与配置

```jsx
function PollingData({ endpoint, pollingInterval }) {
  const [data, setData] = useState(null);
  const [notifyOnUpdate, setNotifyOnUpdate] = useState(true);

  // Effect 事件：读取最新的通知设置
  const onDataReceived = useEffectEvent((newData) => {
    setData(newData);
    // ✅ 始终读取最新的 notifyOnUpdate 值
    if (notifyOnUpdate) {
      showNotification('数据已更新!');
    }
  });

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newData = await fetchData(endpoint);
      onDataReceived(newData); // ✅ 在 Effect 内部调用
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [endpoint, pollingInterval]); // ✅ 不需要声明 notifyOnUpdate

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={notifyOnUpdate}
          onChange={(e) => setNotifyOnUpdate(e.target.checked)} 
        />
        更新时通知我
      </label>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

**解释**：
- 我们希望根据 `endpoint` 和 `pollingInterval` 来重新设置轮询
- 用户可以随时切换是否需要通知
- 但切换通知设置不应该导致重新设置定时器

### 示例 3：数据可视化动画

**场景描述**：一个股票价格图表组件，当价格更新时触发动画。用户可以调整动画速度和缓动效果，但调整这些设置不应该打断正在进行的动画。

```jsx
function StockChart({ stockId, price }) {
  const chartRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState('normal'); // 'slow' | 'normal' | 'fast'
  const [easing, setEasing] = useState('easeOut'); // 'linear' | 'easeOut' | 'bounce'

  // Effect 事件：执行动画时读取最新的动画配置
  const animatePrice = useEffectEvent((newPrice) => {
    const chart = chartRef.current;
    // ✅ 始终使用最新的速度和缓动设置
    const duration = { slow: 1000, normal: 500, fast: 200 }[animationSpeed];
    chart.animateTo(newPrice, { duration, easing });
  });

  useEffect(() => {
    animatePrice(price); // ✅ 在 Effect 内部调用
  }, [stockId, price]); // ✅ 只在股票或价格变化时触发动画

  return (
    <div>
      <canvas ref={chartRef} />
      
      <div className="controls">
        <select value={animationSpeed} onChange={e => setAnimationSpeed(e.target.value)}>
          <option value="slow">慢速</option>
          <option value="normal">正常</option>
          <option value="fast">快速</option>
        </select>
        
        <select value={easing} onChange={e => setEasing(e.target.value)}>
          <option value="linear">线性</option>
          <option value="easeOut">缓出</option>
          <option value="bounce">弹跳</option>
        </select>
      </div>
    </div>
  );
}
```

**为什么需要 useEffectEvent**：
- 价格变化时需要播放动画 → `price` 是响应式依赖
- 用户调整动画速度/缓动效果 → 不应该打断当前动画或重新触发
- 下次价格变化时，使用**新的**动画设置

### 示例 4：WebSocket 连接与通知设置

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  // Effect 事件：处理新消息时读取最新的声音设置
  const onNewMessage = useEffectEvent((message) => {
    setMessages(prev => [...prev, message]);
    
    // ✅ 始终读取最新的 soundEnabled 和 volume
    if (soundEnabled) {
      playNotificationSound(volume);
    }
  });

  useEffect(() => {
    const socket = new WebSocket(`wss://chat.example.com/${roomId}`);
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onNewMessage(message); // ✅ 在 Effect 内部调用
    };

    return () => socket.close();
  }, [roomId]); // ✅ 只在 roomId 变化时重连，声音设置变化不会导致重连

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)} 
        />
        开启消息提示音
      </label>
      <input 
        type="range" 
        value={volume} 
        onChange={(e) => setVolume(e.target.value)} 
      />
      
      {messages.map((msg, i) => <Message key={i} {...msg} />)}
    </div>
  );
}
```

**为什么需要 useEffectEvent**：
- 用户随时可以切换是否开启提示音、调整音量
- 这些设置变化**不应该**导致 WebSocket 断开重连
- 但收到新消息时，我们需要读取**最新的**声音设置

如果不用 `useEffectEvent`，要么：
1. 把 `soundEnabled`/`volume` 加入依赖 → 每次调音量都重连 ❌
2. 不加依赖 → 声音设置永远是初始值（陈旧闭包）❌
```

### 示例 5：定时器与配置

```jsx
function AutoSave({ document, saveInterval }) {
  const [lastSaved, setLastSaved] = useState(null);

  // Effect 事件：保存时使用最新的文档内容
  const performSave = useEffectEvent(async () => {
    // ✅ 始终保存最新的 document 内容
    await saveToServer(document);
    setLastSaved(new Date());
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      performSave();
    }, saveInterval);

    return () => clearInterval(intervalId);
  }, [saveInterval]); // ✅ 只在保存间隔变化时重建定时器

  return <span>上次保存: {lastSaved?.toLocaleTimeString()}</span>;
}
```

## 🚫 使用限制

### 1. 只能在 Effect 内部调用

```jsx
function Timer({ onTick, interval }) {
  const onTickEvent = useEffectEvent(onTick);

  useEffect(() => {
    const id = setInterval(() => {
      onTickEvent(); // ✅ 在 Effect 内部调用
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  // ❌ 不要在 Effect 外部调用
  // onTickEvent(); 
}
```

### 2. 不要传递给其他组件或 Hook

```jsx
function Timer({ onTick, interval }) {
  const onTickEvent = useEffectEvent(onTick);

  // ❌ 不要这样做
  // useOtherHook(onTickEvent);
  
  // ❌ 也不要传递给子组件
  // return <Child onClick={onTickEvent} />;
}
```

## 🔄 与其他方案的对比

### 对比：使用 ref 的方案

```jsx
// 之前的解决方案：使用 ref
function ChatRoom({ roomId, theme }) {
  const themeRef = useRef(theme);
  
  useEffect(() => {
    themeRef.current = theme;
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('已连接!', themeRef.current);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}

// 使用 useEffectEvent 的方案（更简洁）
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('已连接!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

**useEffectEvent 的优势**：
- 代码更简洁
- 不需要手动同步 ref
- 更清晰地表达意图

## 💡 最佳实践

1. **只用于 Effect 中的非响应式逻辑**
   - 当你需要在 Effect 中读取最新值，但不想让这个值成为依赖时

2. **保持命名约定**
   - 使用 `on` 前缀命名 Effect 事件，如 `onConnected`、`onMessage`

3. **不要过度使用**
   - 如果值变化应该触发 Effect 重新运行，就让它成为依赖
   - 不要用 `useEffectEvent` 来避免在 Effect 的依赖数组中声明依赖，这可能会隐藏 bug

4. **配合 ESLint 插件使用**
   - `eslint-plugin-react-hooks`（6.1.1 或更高版本）会强制执行正确的使用方式

## 📖 总结

| 特性 | useEffectEvent | 普通函数在 Effect 中 |
|------|----------------|---------------------|
| 读取最新 props/state | ✅ 总是最新 | ✅ 总是最新 |
| 作为 Effect 依赖 | ❌ 不需要 | ✅ 需要 |
| 触发 Effect 重新运行 | ❌ 不会 | ✅ 会 |
| 适用场景 | 非响应式逻辑 | 响应式逻辑 |

`useEffectEvent` 完美解决了 "我需要读取最新值，但这个值不应该触发 Effect 重新运行" 这个常见问题，是 React 19 中处理 Effect 中非响应式逻辑的官方解决方案。

---

*参考资料: [React 中文官方文档 - useEffectEvent](https://zh-hans.react.dev/reference/react/useEffectEvent)*