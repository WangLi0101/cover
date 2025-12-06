### 1. **父传子：props**

**Vue 2 和 Vue 3** 中父组件传递给子组件的参数方式基本一致，都使用 `props` 来传递数据。

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <div>
    <Child :message="parentMessage" />
  </div>
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
    data() {
      return {
        parentMessage: "Hello from Parent!",
      };
    },
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      message: String,
    },
  };
</script>
```

#### Vue 3 示例（父传子）：

```html
<!-- Parent.vue -->
<template>
  <div>
    <Child :message="parentMessage" />
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import Child from "./Child.vue";

  const parentMessage = ref("Hello from Parent!");
</script>

<!-- Child.vue -->
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";

  const props = defineProps({
    message: String,
  });

  const { message } = props;
</script>
```

在 `Child.vue` 中，`message` 是通过 `defineProps` 获取的，这是 `<script setup>` 语法糖的优势，简化了原本的 `props` 结构。

### 2. **子传父：通过自定义事件**

Vue 2 和 Vue 3 都使用自定义事件（`$emit`）来实现子组件向父组件传递数据，但 Vue 3 中的 `v-model` 机制和 Composition API 使得事件的使用更加灵活。

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <div>
    <Child @updateMessage="handleMessageUpdate" />
  </div>
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
    methods: {
      handleMessageUpdate(newMessage) {
        console.log("Received message from child:", newMessage);
      },
    },
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <button @click="sendMessage">Send Message to Parent</button>
  </div>
</template>

<script>
  export default {
    methods: {
      sendMessage() {
        this.$emit("updateMessage", "Hello from Child!");
      },
    },
  };
</script>
```

#### Vue 3 示例（子传父）：

```html
<!-- Parent.vue -->
<template>
  <div>
    <Child @updateMessage="handleMessageUpdate" />
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import Child from "./Child.vue";

  const handleMessageUpdate = (newMessage) => {
    console.log("Received message from child:", newMessage);
  };
</script>

<!-- Child.vue -->
<template>
  <div>
    <button @click="sendMessage">Send Message to Parent</button>
  </div>
</template>

<script setup>
  import { defineEmits } from "vue";

  const emit = defineEmits();

  const sendMessage = () => {
    emit("updateMessage", "Hello from Child!");
  };
</script>
```

在 `Child.vue` 中，使用 `defineEmits()` 来定义事件并触发。通过 `emit('updateMessage', data)` 向父组件发送数据。

### 3. **`v-model` 的变化**

在 Vue 3 中，`v-model` 的用法发生了变化，允许同时绑定多个 `v-model`，并且默认的事件名称从 `input` 变为 `update:modelValue`。

#### Vue 2 示例：

```html
<!-- Parent.vue -->
<template>
  <Child v-model="parentMessage" />
</template>

<script>
  import Child from "./Child.vue";

  export default {
    components: { Child },
    data() {
      return {
        parentMessage: "Hello from Parent!",
      };
    },
  };
</script>

<!-- Child.vue -->
<template>
  <input :value="message" @input="$emit('input', $event)" />
</template>

<script>
  export default {
    props: ["value"],
  };
</script>
```

#### Vue 3 示例（`v-model` 语法）：

```html
<!-- Parent.vue -->
<template>
  <Child v-model:modelValue="parentMessage" />
</template>

<script setup>
  import { ref } from "vue";
  import Child from "./Child.vue";

  const parentMessage = ref("Hello from Parent!");
</script>

<!-- Child.vue -->
<template>
  <input :value="modelValue" @input="updateMessage" />
</template>

<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps({
    modelValue: String,
  });

  const emit = defineEmits();

  const updateMessage = (event) => {
    emit("update:modelValue", event.target.value);
  };
</script>
```
