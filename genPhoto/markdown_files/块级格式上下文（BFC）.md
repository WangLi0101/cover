`BFC`，全称为“块级格式上下文”（`Block Formatting Context`），是`Web`页面中的一种`CSS`渲染机制，用于控制块级元素的布局和定位。

`BFC`**是一个独立的渲染区域**，**内部的元素布局不会影响到外部元素，同时内部元素的布局也不会受到外部元素的影响。BFC 内部的元素会按照一定的规则进行排列和布局**，这些规则包括：

1. 内部的块级元素在垂直方向上一个接一个地排列，并且它们之间的间距由`margin`决定。
2. `BFC`区域不会与浮动元素重叠。
3. `BFC`区域会自适应其内部块级元素的高度，使得它们不会溢出到外部元素中。
4. `BFC`区域的左边界会挨着其容器的左边界，右边界会挨着其容器的右边界，形成一个独立的渲染块。

### 创建

要创建一个 `BFC`，可以使用以下方法之一：

- 根元素（`<html>`）
- 浮动元素（`float` 不为 `none`）
- 绝对定位元素（`position` 为 `absolute` 或 `fixed`）
- 行内块元素（`display` 为 `inline-block`）
- 弹性盒子（`display` 为 `flex` 或 `inline-flex`）
- 网格容器（`display` 为 `grid` 或 `inline-grid`）
- 表格单元格或表格标题
- `overflow` 不为 `visible` 的块级元素
- `contain` 属性值为 `layout`、`content` 或 `strict` 的元素
- `column-count` 或 column-width 不为 `auto` 的多列容器

### 用途

1. 清除浮动元素：将父元素设为`BFC`，可以避免浮动元素对父元素的影响。

```html
<style>
  .container {
    border: 3px solid tomato;
    /* 创建 BFC */
    overflow: hidden;
  }

  /* 清除浮动 */
  .float-left {
    width: 100px;
    height: 100px;
    background-color: skyblue;
    float: left;
  }
</style>

<!-- 清除浮动 -->
<div class="container">
  <div class="float-left">Float Left</div>
</div>
```

![image-20230301142828031](https://libra321.oss-cn-huhehaote.aliyuncs.com/img/image-20230301142828031.png)

2. 解决`margin`重叠问题：将相邻的块级元素包裹在不同的 BFC 中，可以避免`margin`重叠的问题。

```html
<style>
  .container {
    /* 创建 BFC */
    overflow: hidden;
  }

  .box {
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }

  .box1 {
    margin-bottom: 20px;
  }

  .box2 {
    margin-top: 20px;
  }
</style>

<!-- 防止外边距折叠 -->
<!-- 两个 box 处在两个不同的 BFC 中 -->
<div class="container">
  <div class="box box1">Box 1</div>
</div>
<div class="container">
  <div class="box box2">Box 2</div>
</div>
```

![image-20230301142315177](https://libra321.oss-cn-huhehaote.aliyuncs.com/img/image-20230301142315177.png)

3. 实现多栏布局：通过将容器元素设为`BFC`，可以实现多栏布局，同时避免子元素溢出到容器外部。

```html
<style>
  /* 两栏布局 */
  .container {
    width: 100%;
    border: 3px solid red;
    overflow: hidden;
    /* 防止高度塌陷 */
  }

  .left {
    width: 30%;
    background-color: skyblue;
    float: left;
    /* 创建 BFC */
  }

  .right {
    width: 70%;
    background-color: pink;
    float: right;
    /* 创建 BFC */
  }
</style>

<!-- 两栏布局 -->
<div class="container">
  <div class="left">Left</div>
  <div class="right">Right</div>
</div>
```

> 上面的两栏布局是利用浮动元素创建 `BFC`，让左右两个元素在同一行显示，并占据父元素的宽度。如果没有创建 `BFC`，那么左右两个元素就会按照正常的文档流排列，即从上到下，而不是从左到右，并且父元素的高度会塌陷为 `0`，因为浮动元素不占据文档流的空间。三栏布局同理

![image-20230301143509778](https://libra321.oss-cn-huhehaote.aliyuncs.com/img/image-20230301143509778.png)