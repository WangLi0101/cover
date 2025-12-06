# Vue3 中 ref 和 reactive 的区别

![封面图](../photo/vue-ref-reactive-cover.webp)

## 一、基本概念

### ref

- 用于处理基本类型数据（也可以用于引用类型）
- 返回一个带有 `value` 属性的响应式对象
- 在模板中使用时不需要写 `.value`
- 在 JS 中需要通过 `.value` 访问和修改值

### reactive

- 用于处理对象类型数据（数组、对象等）
- 直接返回响应式对象
- 不需要通过 `.value` 访问
- 不能用于基本类型

## 二、基本用法对比

### 1. ref 的使用

```javascript
import { ref } from "vue";

// 基本类型
const count = ref(0);
const message = ref("Hello");

// 访问和修改值
console.log(count.value); // 0
count.value++;
console.log(count.value); // 1

// 用于对象
const user = ref({
  name: "张三",
  age: 25,
});

// 访问和修改对象属性
console.log(user.value.name); // '张三'
user.value.age = 26;
```

### 2. reactive 的使用

```javascript
import { reactive } from "vue";

// 对象类型
const state = reactive({
  count: 0,
  message: "Hello",
  user: {
    name: "张三",
    age: 25,
  },
});

// 访问和修改值
console.log(state.count); // 0
state.count++;
console.log(state.user.name); // '张三'
state.user.age = 26;
```

## 三、主要区别

### 1. 类型支持

```javascript
// ref - 支持所有类型
const numberRef = ref(0); // ✅ 支持
const stringRef = ref("Hello"); // ✅ 支持
const booleanRef = ref(false); // ✅ 支持
const arrayRef = ref([1, 2, 3]); // ✅ 支持
const objectRef = ref({ name: "张三" }); // ✅ 支持

// reactive - 只支持对象类型
const numberReactive = reactive(1); // ❌ 不支持
const stringReactive = reactive("Hello"); // ❌ 不支持
const arrayReactive = reactive([1, 2, 3]); // ✅ 支持
const objectReactive = reactive({ name: "张三" }); // ✅ 支持
```

### 2. 访问方式

```javascript
// ref 需要 .value
const count = ref(0);
count.value++; // ✅ 正确
count++; // ❌ 错误

// reactive 直接访问
const state = reactive({ count: 0 });
state.count++; // ✅ 正确
```

### 3. 解构行为

```javascript
// ref 解构会失去响应性
const user = ref({
  name: "张三",
  age: 25,
});
const { value: userData } = user; // ❌ 失去响应性

// reactive 解构会失去响应性
const state = reactive({
  user: {
    name: "张三",
    age: 25,
  },
});
const { user } = state; // ❌ 失去响应性
```

## 四、实际应用场景

### 1. 使用 ref 的场景

```javascript
// 基本类型数据
const count = ref(0);
const message = ref("Hello");
const isLoading = ref(false);
```

### 2. 使用 reactive 的场景

```javascript
// 1. 复杂的状态管理
const state = reactive({
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
});

// 2. 表单数据
const formData = reactive({
  username: "",
  password: "",
  remember: false,
});

// 3. 组件内部状态
const componentState = reactive({
  isOpen: false,
  selectedItems: [],
  filterOptions: {},
});
```

## 五、实现一个最简单的 ref

下面是一个最简单的 ref 实现，包含了基本的响应式功能：

```javascript
// 存储依赖关系的 WeakMap
const targetMap = new WeakMap();

// 当前正在执行的副作用函数
let activeEffect = null;

// 依赖收集
function track(target, key) {
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
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

// ref 实现
function ref(initialValue) {
  const wrapper = {
    get value() {
      track(wrapper, "value");
      return initialValue;
    },
    set value(newValue) {
      if (newValue === initialValue) return;
      initialValue = newValue;
      trigger(wrapper, "value");
    },
  };
  return wrapper;
}

// 创建副作用函数
function effect(fn) {
  activeEffect = fn;
  fn(); // 立即执行一次以收集依赖
  activeEffect = null;
}

// 测试代码
const count = ref(0);
const message = ref("Hello");

// 创建副作用
effect(() => {
  console.log(`计数发生变化：${count.value}`);
});

effect(() => {
  console.log(`消息发生变化：${message.value}`);
});

// 修改值，会自动触发对应的副作用函数
console.log("--- 修改计数 ---");
count.value++;

console.log("--- 修改消息 ---");
message.value = "World";
```

运行这段代码，你将看到以下输出：

```bash
计数发生变化：0
消息发生变化：Hello
--- 修改计数 ---
计数发生变化：1
--- 修改消息 ---
消息发生变化：World
```

## 八、ref 解构的注意事项

### 1. ref 的解构问题

ref 的任何解构操作都会导致响应性丢失：

```javascript
const count = ref(0);

// ❌ 以下两种解构方式都会失去响应性
const { value } = count;
const { value: countValue } = count;

// ✅ 正确的使用方式
console.log(count.value); // 直接访问 .value
count.value = 1; // 直接修改 .value
```

### 2. 为什么解构会失去响应性？

这是因为 ref 的响应性是通过包装对象的 getter/setter 实现的：

```javascript
// ref 的基本实现
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, "value"); // 依赖收集
      return value;
    },
    set value(newValue) {
      value = newValue;
      trigger(refObject, "value"); // 触发更新
    },
  };
  return refObject;
}

// 当解构时
const count = ref(0);
const { value } = count;
// 等同于
const value = count.value;
// 这实际上只是获取了值，而不是获取了 getter/setter，所以失去响应性
```

### 3. 保持响应性的正确方式

1. 直接使用 `.value`：

```javascript
const count = ref(0);
// ✅ 始终使用 .value
console.log(count.value);
count.value++;
```

2. 使用计算属性：

```javascript
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
```

3. 对于 reactive 对象，使用 toRefs：

```javascript
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
  message: "Hello",
});

// ✅ 使用 toRefs 保持响应性
const { count, message } = toRefs(state);
// count 和 message 现在是 ref，需要使用 .value
console.log(count.value);
console.log(message.value);
```

### 4. 最佳实践建议

1. ref 的使用建议：
   - 始终通过 `.value` 访问和修改值
   - 避免解构 ref
   - 需要派生值时使用计算属性

```javascript
// ✅ 推荐的使用方式
const count = ref(0);
const message = ref("Hello");

// 需要派生值时使用计算属性
const doubleCount = computed(() => count.value * 2);
const upperMessage = computed(() => message.value.toUpperCase());
```

2. reactive 的使用建议：
   - 需要解构时使用 toRefs
   - 或者直接访问属性
   - 避免直接解构

```javascript
const state = reactive({
  count: 0,
  message: "Hello",
});

// ✅ 方式1：直接访问
console.log(state.count);

// ✅ 方式2：使用 toRefs
const { count, message } = toRefs(state);
console.log(count.value);
```

## 重新赋值

```javascript
// reactive
const state = reactive({
  count: 0,
  message: "Hello",
});

// 重新赋值后，响应性丢失
state = reactive({
  count: 1,
  message: "World",
});

// ref
const count = ref({
  count: 0,
  message: "Hello",
});

// 重新赋值后，响应性还存在
count.value = {
  count: 1,
  message: "World",
};
```
