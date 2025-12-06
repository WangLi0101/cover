### 1. **Composition API（组合式 API）**

- **Vue 2**：采用的是 **Options API**，即通过 `data`, `methods`, `computed`, `watch` 等选项定义组件的逻辑。
- **Vue 3**：引入了 **Composition API**，通过 `setup` 函数来组合组件的逻辑，代码更加灵活和可复用。`setup` 是组件的入口，可以在其中定义响应式变量、方法和生命周期钩子等。

示例：

- Vue 2：

  ```javascript
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
  ```

- Vue 3：

  ```javascript
  import { ref } from 'vue';

  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  }
  ```

### 2. **响应式系统**

- **Vue 2**：使用 **Object.defineProperty** 来实现响应式，存在性能瓶颈，尤其在处理大量数据或深层嵌套数据时会产生性能问题。
- **Vue 3**：使用 **Proxy** 实现响应式，性能显著提高，且支持更多复杂场景（如数组的索引变化、对象的动态属性等）。响应式系统的内部实现更加高效和灵活。

### 3. **性能提升**

- **Vue 2**：由于使用了 `Object.defineProperty`，在某些情况下（如大数据集、深度嵌套等）可能会导致性能问题。
- **Vue 3**：Vue 3 的性能优化较大，特别是在 Virtual DOM、响应式系统、编译等方面。Vue 3 在性能测试中比 Vue 2 快大约 2 倍，体积也更小。

**优化点**：

- 更快的 Virtual DOM。
- 更快的响应式系统。
- 编译时的优化（例如静态树的提升）。

### 4. **Fragments（片段）**

- **Vue 2**：每个组件必须有一个根元素。
- **Vue 3**：支持 **Fragments**，即一个组件可以返回多个根节点，而不需要包裹在一个单独的 DOM 元素内。

示例：

- Vue 2：

  ```html
  <div>
    <span>Content 1</span>
    <span>Content 2</span>
  </div>
  ```

- Vue 3：

  ```html
  <template>
    <span>Content 1</span>
    <span>Content 2</span>
  </template>
  ```

### 5. **Teleport（传送门）**

- **Vue 3** 引入了 **Teleport**，允许将组件的内容传送到 DOM 树的其他位置。比如可以把模态框渲染到 `body` 下，而不是组件的默认位置。

示例：

```html
<teleport to="body">
  <div class="modal">This is a modal</div>
</teleport>
```

### 6. **Suspense（悬停）**

- **Vue 3** 引入了 **Suspense**，这是一个用于处理异步组件的工具，它可以处理异步加载并允许你定义加载中的占位内容（loading state）。
- 这对于处理异步数据和组件加载（例如懒加载）非常有用。

示例：

```html
<template>
  <Suspense>
    <template #default>
      <MyAsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### 7. **新生命周期钩子**

- Vue 3

  ：添加了新的生命周期钩子来支持 Composition API，主要包括：

  - `onBeforeMount`
  - `onMounted`
  - `onBeforeUpdate`
  - `onUpdated`
  - `onBeforeUnmount`
  - `onUnmounted`
  - `onErrorCaptured`

- 这些新的钩子函数可以在 `setup` 中使用，替代了 Vue 2 中的生命周期钩子。

### 8. **TypeScript 支持**

- **Vue 2**：TypeScript 支持较弱，虽然可以使用 TypeScript，但需要通过额外的配置和插件。
- **Vue 3**：TypeScript 支持更加深入，Vue 3 本身是用 TypeScript 编写的，提供了更强的类型推导和开发体验，支持更加细粒度的类型定义。

### 9. **v-model 的变化**

- **Vue 2**：`v-model` 默认绑定 `value` 属性，并监听 `input` 事件。如果需要绑定其他属性或事件，需要通过 `model` 选项进行配置。
- **Vue 3**：`v-model` 支持多个绑定，并且可以自定义事件和属性名称。使用时可以通过 `modelValue` 来替代默认的 `value`，并通过 `@update:modelValue` 来替代 `@input`。

示例：

```html
<!-- Vue 2 -->
<template>
  <input v-model="message" />
  <!-- 默认绑定 value 属性，监听 input 事件 -->
</template>

<script>
  export default {
    data() {
      return {
        message: "",
      };
    },
  };
</script>

<!-- Vue 3 -->
<template>
  <input v-model="message" />
  <!-- 默认绑定 modelValue 属性，监听 update:modelValue 事件 -->
</template>

<script setup>
  import { ref } from "vue";
  const message = ref("");
</script>
```

### 10. **异步组件和动态导入**

- **Vue 2**：异步组件通过 `Vue.component` 配置来实现。
- **Vue 3**：引入了更加简洁的 **动态导入** 语法，可以使用 `defineAsyncComponent` 函数来定义异步组件。

示例：

- Vue 2：

  ```javascript
  Vue.component("async-component", () => import("./AsyncComponent.vue"));
  ```

- Vue 3：

  ```javascript
  import { defineAsyncComponent } from "vue";

  const AsyncComponent = defineAsyncComponent(() =>
    import("./AsyncComponent.vue")
  );
  ```

### 11. **Tree Shaking 和更小的打包体积**

- **Vue 3** 支持更好的 **Tree Shaking**，使得打包时可以移除未使用的代码，进一步减小了最终构建的体积。
- Vue 3 的整个代码库经过了优化和模块化，提供了更小的文件体积和更高效的编译过程。
