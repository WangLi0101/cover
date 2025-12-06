### 1. **默认插槽（Default Slot）**

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <Child>
    <p>This is the default slot content</p>
  </Child>
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

#### Vue 3 示例：

Vue 3 默认插槽的用法与 Vue 2 基本相同。

```html
<!-- Parent.vue -->
<template>
  <Child>
    <p>This is the default slot content</p>
  </Child>
</template>

<script setup>
  import Child from "./Child.vue";
</script>

<!-- Child.vue -->
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

### 2. **具名插槽（Named Slots）**

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <Child>
    <template v-slot:header>
      <h1>This is the header content</h1>
    </template>
    <template v-slot:footer>
      <p>This is the footer content</p>
    </template>
  </Child>
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

#### Vue 3 示例：

Vue 3 在具名插槽上做了语法糖的改进，可以直接使用 **`v-slot`** 指令，简化了插槽的写法，并且可以更直观地使用作用域插槽。

```html
<!-- Parent.vue -->
<template>
  <Child>
    <template v-slot:header>
      <h1>This is the header content</h1>
    </template>
    <template v-slot:footer>
      <p>This is the footer content</p>
    </template>
  </Child>
</template>

<script setup>
  import Child from "./Child.vue";
</script>

<!-- Child.vue -->
<template>
  <div>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

### 3. **作用域插槽（Scoped Slots）**

作用域插槽允许父组件传递数据给插槽内的内容。Vue 2 和 Vue 3 都支持作用域插槽，但在 Vue 3 中，语法更加简洁。

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <Child>
    <template v-slot:default="slotProps">
      <p>{{ slotProps.message }}</p>
    </template>
  </Child>
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <slot :message="childMessage"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        childMessage: "Hello from Child!",
      };
    },
  };
</script>
```

#### Vue 3 示例：

Vue 3 简化了作用域插槽的语法，可以直接使用 `v-slot` 语法糖并简化绑定。

```html
<!-- Parent.vue -->
<template>
  <Child v-slot:mySlot="slotProps">
    <p>{{ slotProps.message }}</p>
  </Child>

  <!-- 或者 -->
  <Child #mySlot="slotProps">
    <p>{{ slotProps.message }}</p>
  </Child>

  <!-- 或者 -->
  <Child #mySlot="{ message }">
    <p>{{ message }}</p>
  </Child>
</template>

<script setup>
  import Child from "./Child.vue";
</script>

<!-- Child.vue -->
<template>
  <div>
    <slot name="mySlot" :message="childMessage"></slot>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const childMessage = ref("Hello from Child!");
</script>
```
