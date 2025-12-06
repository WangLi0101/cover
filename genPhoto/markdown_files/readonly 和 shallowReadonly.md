# Vue3 中的 readonly 和 shallowReadonly

## 一、基本概念

### readonly

- 接收一个对象（响应式或普通）并返回原始对象的只读代理
- 深层递归转换，使整个嵌套对象都是只读的
- 任何修改都会触发警告

### shallowReadonly

- 创建一个代理，使其自身的属性为只读
- 不执行嵌套对象的深层只读转换
- 只有根级别的属性是只读的

## 二、基本用法对比

### 1. readonly vs reactive

```javascript
import { reactive, readonly } from "vue";

const original = reactive({
  count: 0,
  nested: {
    value: 1,
  },
});

const copy = readonly(original);

// ❌ 以下修改都会触发警告
copy.count++; // 警告！
copy.nested.value++; // 警告！

// ✅ 但可以通过原始对象修改
original.count++; // 正常工作
original.nested.value++; // 正常工作
```

### 2. shallowReadonly vs readonly

```javascript
import { shallowReadonly, readonly } from "vue";

const state = {
  count: 0,
  nested: {
    value: 1,
  },
};

const deepReadonly = readonly(state);
const shallowReadonlyState = shallowReadonly(state);

// readonly - 深层只读
deepReadonly.count++; // ❌ 警告
deepReadonly.nested.value++; // ❌ 警告

// shallowReadonly - 浅层只读
shallowReadonlyState.count++; // ❌ 警告
shallowReadonlyState.nested.value++; // ✅ 正常工作
```

## 三、实际应用场景

### 1. readonly 的使用场景

```javascript
// 1. Props 的只读包装
const props = defineProps(["userData"]);
const readonlyProps = readonly(props);

// 2. Store 数据的只读视图
const store = reactive({
  user: {
    name: "张三",
    settings: {
      theme: "dark",
    },
  },
});
const readonlyStore = readonly(store);

// 3. 共享的配置对象
const config = readonly({
  apiUrl: "https://api.example.com",
  settings: {
    timeout: 5000,
    retries: 3,
  },
});
```

### 2. shallowReadonly 的使用场景

```javascript
// 1. 大型对象的性能优化
const bigObject = shallowReadonly({
  settings: {
    // 大量嵌套数据
    theme: "dark",
    language: "zh-CN",
  },
  data: {
    // 可修改的数据
    items: [],
  },
});

// 2. 第三方库集成
const libraryState = shallowReadonly({
  instance: new ThirdPartyLibrary(),
  config: {
    // 可修改的配置
  },
});

// 3. 混合读写权限
const state = shallowReadonly({
  // 只读的顶层配置
  config: {
    // 可修改的内部配置
    settings: {},
  },
  // 可修改的数据
  data: {
    items: [],
  },
});
```

## 四、实现原理

### 1. readonly 的实现

```javascript
function readonly(target) {
  return new Proxy(target, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // 递归处理嵌套对象
      return typeof res === "object" ? readonly(res) : res;
    },
    set(target, key) {
      console.warn(`Set operation on key "${key}" failed: target is readonly.`);
      return true;
    },
    deleteProperty(target, key) {
      console.warn(
        `Delete operation on key "${key}" failed: target is readonly.`
      );
      return true;
    },
  });
}
```

### 2. shallowReadonly 的实现

```javascript
function shallowReadonly(target) {
  return new Proxy(target, {
    get(target, key) {
      // 不递归处理嵌套对象
      return Reflect.get(target, key);
    },
    set(target, key) {
      console.warn(`Set operation on key "${key}" failed: target is readonly.`);
      return true;
    },
    deleteProperty(target, key) {
      console.warn(
        `Delete operation on key "${key}" failed: target is readonly.`
      );
      return true;
    },
  });
}
```