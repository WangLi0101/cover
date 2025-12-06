<!--
 * @Author: Libra
 * @Date: 2024-10-12 20:45:27
 * @LastEditors: Libra
 * @Description:
-->

![img](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/01-container.svg)

## 父元素(flex 容器)的属性

#### display

这定义了一个 `flex` 容器;根据给定的值可以是 `inline-flex` 或 `flex`。

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

#### flex-direction

![flex-direction的四个可能值:从上到下、从下到上、从右到左和从左到右](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/flex-direction.svg)

这建立了主轴,从而定义了 flex 项目在 flex 容器中的放置方向。Flexbox 是一个单方向的布局概念。可以将 flex 项目主要视为在水平行或垂直列中排列。

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- `row` (默认): 在`ltr`中从左到右;在`rtl`中从右到左
- `row-reverse`: 在`ltr`中从右到左;在`ltl`中从左到右
- `column`: 与`row`相同,但从上到下
- `column-reverse`: 与`row-reverse`相同,但从下到上

#### flex-wrap

![两行盒子,第一行换行到第二行](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/flex-wrap.svg)

默认情况下,flex 项目都会试图排成一行。你可以改变这一点,允许项目根据需要换行。

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- `nowrap` (默认): 所有 flex 项目都在一行
- `wrap`: flex 项目会换行到多行,从上到下。
- `wrap-reverse`: flex 项目会换行到多行,从下到上。

这里有一些[`flex-wrap`的视觉演示](https://css-tricks.com/almanac/properties/f/flex-wrap/)。

#### flex-flow

这是`flex-direction`和`flex-wrap`属性的简写, 默认值是`row nowrap`。

```css
.container {
  flex-flow: column wrap;
}
```

#### justify-content

![flex容器内的flex项目展示了不同的间距选项](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content.svg)

这定义了沿主轴的对齐方式。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around
    | space-evenly;
}
```

- `flex-start` (默认): 项目排到 flex-direction 的起始处。
- `flex-end`: 项目排到 flex-direction 的末端。
- `center`: 项目在行上居中
- `space-between`: 项目在行中均匀分布;第一个项目在起始线上,最后一个项目在终止线上
- `space-around`: 项目在行中均匀分布,周围有相等的空间。注意,视觉上空间并不相等,因为所有项目两侧都有相等的空间。第一个项目在容器边缘会有一个单位的空间,但与下一个项目之间会有两个单位的空间,因为下一个项目也有自己的间距。
- `space-evenly`: 项目分布使得任意两个项目之间的间距(和到边缘的空间)相等。

#### align-items

![不同对齐选项的演示,如所有盒子贴在flex父元素的顶部、底部、拉伸或沿基线对齐](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-items.svg)

这定义了 flex 项目沿当前行的**交叉轴**如何默认布局。可以将其视为交叉轴(垂直于主轴)的`justify-content`版本。

```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
```

- `stretch` (默认): 拉伸以填满容器(仍然遵守 min-width/max-width)
- `flex-start`: 项目排到交叉轴的起始处。
- `flex-end`: 项目排到交叉轴的末端。
- `center`: 项目在交叉轴上居中
- `baseline`: 项目对齐,使它们的基线对齐

#### align-content

![align-content属性的例子,其中一组项目聚集在顶部或底部,或拉伸以填充空间,或有间距。](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content.svg)

当交叉轴上有额外空间时,这会对齐 flex 容器的行,类似于`justify-content`对齐主轴上的单个项目。

**注意:** 此属性仅对多行弹性容器生效,即`flex-wrap`设置为`wrap`或`wrap-reverse`的容器。单行弹性容器(即`flex-wrap`设置为其默认值`no-wrap`的容器)不会反映`align-content`。

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around |
    space-evenly | stretch;
}
```

- `normal` (默认): 项目打包在它们的默认位置,就像没有设置值一样。
- `flex-start`: 项目排到交叉轴的起始处。
- `flex-end`: 项目排到交叉轴的末端。
- `center`: 项目在容器中居中
- `space-between`: 项目均匀分布;第一行在容器的起始处,而最后一行在末端
- `space-around`: 项目均匀分布,每行周围有相等的空间
- `space-evenly`: 项目均匀分布,它们周围有相等的空间
- `stretch`: 行拉伸以占用剩余空间

#### gap, row-gap, column-gap

![img](https://css-tricks.com/wp-content/uploads/2021/09/gap-1.svg)

`gap`属性明确控制 flex 项目之间的空间。**它仅在项目之间应用该间距,而不是在外边缘**。

```css
.container {
  display: flex;
  ...
  gap: 10px;
  gap: 10px 20px; /* row-gap column gap */
  row-gap: 10px;
  column-gap: 20px;
}
```

这种行为可以被认为是一个*最小*间隙,因为如果间隙由于某种原因变大(比如因为`justify-content: space-between;`),那么只有当那个空间最终变小时 gap 才会生效。

> 它不是专门为 flexbox 设计的,`gap`在网格和多列布局中也有效。

![img](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/02-items.svg)

## 子元素(flex 项目)的属性

#### order

![展示flexbox顺序的图表。一个容器,项目为1 1 1 2 3, -1 1 2 5, 和2 2 99。](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/order.svg)

默认情况下,flex 项目按源顺序布局。然而,`order`属性控制它们在 flex 容器中出现的顺序。

```css
.item {
  order: 5; /* 默认为0 */
}
```

具有相同`order`的项目会恢复到源顺序。

#### flex-grow

![两行项目,第一行所有项目大小相等,flex-grow数字相等,第二行中间项目宽度是其他的两倍,因为其值为2而不是1。](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/flex-grow.svg)

这定义了 flex 项目在必要时增长的能力。它接受一个无单位的值,作为比例。它规定了项目应该占用 flex 容器内可用空间的数量。

如果所有项目的`flex-grow`设置为`1`,容器中的剩余空间将平均分配给所有子元素。如果其中一个子元素的值为`2`,那个子元素将占用两倍于其他子元素的空间(或者至少会尝试)。

```css
.item {
  flex-grow: 4; /* 默认0 */
}
```

负数无效。

#### flex-shrink

这定义了 flex 项目在必要时收缩的能力，如果空间不足，那么这个属性定义了当前项目收缩的比例。

比如

```css
.item {
  flex-shrink: 3; /* 默认1 */
}
```

负数无效。

#### flex-basis

这定义了在分配剩余空间之前,元素的默认大小。它可以是一个长度(例如 20%, 5rem 等)或一个关键字。

```css
.item {
  flex-basis: | auto; /* 默认auto */
}
```

如果设置为`0`,内容周围的额外空间不会被考虑在内。如果设置为`auto`,额外空间会根据其`flex-grow`值分配。

#### flex

这是`flex-grow,` `flex-shrink`和`flex-basis`的简写组合。第二和第三个参数(`flex-shrink`和`flex-basis`)是可选的。默认值是`0 1 auto`,但如果你用单个数字值设置它,比如`flex: 5;`,那会改变`flex-basis`为 0%,所以它就像设置`flex-grow: 5; flex-shrink: 1; flex-basis: 0%;`。

```css
.item {
  flex: none | [ < "flex-grow" > < "flex-shrink" >? || < "flex-basis" >];
}
```

**建议你使用这个简写属性**,而不是设置单独的属性。简写会智能地设置其他值。

#### align-self

![一个具有align-self值的项目被定位在flex父元素的底部,而不是所有其他项目所在的顶部。](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-self.svg)

这允许覆盖默认对齐方式(或由`align-items`指定的对齐方式)用于单个 flex 项目。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

注意,`float`、`clear`和`vertical-align`对 flex 项目没有影响。
