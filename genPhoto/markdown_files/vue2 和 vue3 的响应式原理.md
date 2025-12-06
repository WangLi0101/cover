# Vue2 和 Vue3 响应式原理详解

![封面图](../photo/vue-reactivity-diff-cover.webp)

## 一、Vue2 响应式原理

### 1. 核心实现：Object.defineProperty()

Vue2 使用 `Object.defineProperty()` 来实现数据的响应式，这个 API 允许我们劫持对象属性的 getter 和 setter。

```javascript
// Vue2 响应式原理简化示例
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      // 通知更新
      dep.notify();
    },
  });
}
```

### 2. 依赖收集过程

```javascript
class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (Dep.target) {
      this.subscribers.add(Dep.target);
    }
  }

  notify() {
    this.subscribers.forEach((sub) => sub.update());
  }
}
```

### 3. Vue2 响应式系统的局限性

1. 对象的限制：

   - 无法检测对象属性的添加和删除
   - 需要使用 `Vue.set()` 或 `this.$set()` 来添加新属性

   ```javascript
   // Vue2 中添加新属性
   Vue.set(obj, "newKey", value);
   this.$set(obj, "newKey", value);
   ```

2. 数组的限制：
   - 无法检测通过索引直接修改数组元素
   - 无法检测数组长度的修改
   ```javascript
   // 这些修改无法被检测到
   this.array[index] = newValue;
   this.array.length = newLength;
   ```

## 二、Vue3 响应式原理

### 1. 核心实现：Proxy

Vue3 使用 ES6 的 `Proxy` 来实现响应式，这是一个更强大的方案：

```javascript
// Vue3 响应式原理简化示例
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key);
      const value = Reflect.get(target, key, receiver);
      return value;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
  });
}
```

## 三、性能对比

1. 内存占用：

   - Vue2: 每个属性都需要创建一个 getter/setter
   - Vue3: 每个对象只需要创建一个 Proxy

2. 初始化速度：

   - Vue2: 需要递归遍历所有属性
   - Vue3: 访问时才进行代理，更加惰性

## 四、最简单的 vue3 响应式

下面是一个最简单的 Vue3 响应式实现，包含了基本的依赖收集和触发更新功能：

```ts
// 存储副作用函数的全局变量
let activeEffect: null | (() => void) = null;
type Maps = WeakMap<object, Map<PropertyKey, Set<() => void>>>;
// 存储依赖关系的 WeakMap
const targetMap: Maps = new WeakMap();

// 依赖收集
const track = <T extends Object>(target: T, key: string | symbol) => {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
};

// 触发更新
const trigger = <T extends Object>(target: T, key: string | symbol) => {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((el) => el());
  }
};

// 创建响应式数据
const reactive = <T extends Object>(target: T) => {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
  });
};

const user = reactive({
  name: "zs",
  age: 18,
});

// 创建副作用函数
const effect = (fn: () => void) => {
  activeEffect = fn;
  // 立即收集一次依赖
  fn();
  activeEffect = null;
};

effect(() => {
  console.log(`年龄为:${user.age}`);
});

effect(() => {
  console.log(`姓名为:${user.name}`);
});

user.age = 22;
user.name = "wl";

```
