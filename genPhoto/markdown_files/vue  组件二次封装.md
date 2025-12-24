# 组件二次封装

![封面图](../photo/vue-wrapper-cover.webp)

组件二次封装应该考虑一下3点

1. props如何穿透过去
2. 插槽如何穿透过去
3. 组件的方法如何暴露

### 1.props如何穿透过去

通过 `$attrs`
在 Vue 3 中，` $attrs` 是一个非常重要的特性，它包含了父组件传递给子组件的所有属性，这些属性没有被子组件声明为 props 或 emits 的自定义事件。简单来说， $attrs 包含了「透传属性」。

```ts
<template>
  <el-input v-bind="{ ...props, ...$attrs }" />
</template>

<script setup lang="ts">
import { InputProps } from "element-plus";
// 为了能有更好的ts类型提示
const props = defineProps<Partial<InputProps>>();
</script>
```

### 2.插槽如何穿透过去

#### 方法一 插槽通过 `$slots` 来获取，然后遍历`$slots`

```ts
<template>
  <el-input v-bind="{ ...props, ...$attrs }">
    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </el-input>
</template>
```

#### 方法二 通过component组件和h函数

 h函数可以用来动态创建组件，它的第一个参数是组件的标签名，第二个参数是组件的属性，第三个参数是组件的插槽，第四个参数是组件的内容

```ts
<template>
  <component
    :is="h(ElInput, { ...$attrs, ...props, ref: getRefInstance }, $slots)"
  />
</template>
```

### 3. 组件的方法如何暴露

通过 ref 来获取组件实例，然后通过 exposed 来暴露组件的方法

```ts
<template>
  <component
    :is="h(ElInput, { ...$attrs, ...props, ref: getRefInstance }, $slots)"
  />
</template>

<script setup lang="ts">
import { ElInput, InputInstance, InputProps } from "element-plus";
import { getCurrentInstance, h } from "vue";

const props = defineProps<Partial<InputProps>>();
const vm = getCurrentInstance();
const getRefInstance = (inputInstance: InputInstance) => {
  vm.exposed = inputInstance || {};
  vm.exposeProxy = inputInstance || {};
};
</script>
```

#### 原理解析

**1. `vm.exposed` 和 `vm.exposeProxy` 是什么？**

这两个是 Vue 3 组件实例的内部属性，通常不需要手动操作，但在二次封装场景下非常有用。

*   **`vm.exposed`**: 存储组件对外暴露的“公共接口”。
*   **`vm.exposeProxy`**: `vm.exposed` 的代理，确保访问正确响应。

代码逻辑 `vm.exposed = inputInstance || {}` 的作用是**将当前封装组件的“对外接口”直接替换成了内部 `el-input` 的实例**。这样父组件调用 `ref.value.focus()` 时，实际上直接调用的是内部 `el-input` 的 `focus()`。

**2. 为什么不直接用 `defineExpose`？**

*   **执行时机不同**：
    *   `defineExpose` 在 `setup()` 阶段同步执行。此时子组件（Template 中的 `el-input`）**还未挂载**，拿不到实例。
    *   `vm.exposed` 赋值是在 `getRefInstance` 回调中执行（Render 后），此时子组件已挂载完成，可以获取到实例。

*   **使用场景**：
    *   `defineExpose`：适用于暴露组件**自身定义**的方法（如 `const count = ref(0)`）。
    *   `vm.exposed` Hack 方式：适用于**全量透传**内部组件实例，让封装组件对使用者来说是“透明”的。
