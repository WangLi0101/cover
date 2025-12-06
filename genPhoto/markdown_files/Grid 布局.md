#### 父元素的属性(Grid 容器)

#### display

定义一个元素为网格容器，并为其内容建立一个新的网格格式化上下文。

值：

- **`grid`** – 生成一个块级网格
- **`inline-grid`** – 生成一个行内级网格

```css
.container {
  display: grid | inline-grid;
}
```

#### grid-template-columns grid-template-rows

定义网格的列和行，使用一个由空格分隔的值列表。这些值表示轨道大小，轨道之间的空间表示网格线。

值：

- **`<track-size>`** – 可以是长度、百分比或网格自由空间的一部分（使用 `fr` 单位）
- **`<line-name>`** – 任意名称

```css
.container {
  grid-template-columns: ... ...;
  /* 例如：
      1fr 1fr
      minmax(10px, 1fr) 3fr
      repeat(5, 1fr)
      50px auto 100px 1fr
  */
  grid-template-rows: ... ...;
  /* 例如：
      min-content 1fr min-content
      100px 1fr max-content
  */
}
```

网格线自动分配正数（从这些分配中）（-1 是最后一个网格线的替代）。

![img](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/template-columns-rows-01.svg)

但是你可以选择明确命名这些线。注意行名称的括号语法：

```css
.container {
  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
}
```

![Grid with user named lines](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/template-column-rows-02.svg)

注意一个线可以有多个名称。例如，这里第二行将有两个名称：row1-end 和 row2-start:

```css
.container {
  grid-template-rows: [row1-start] 25% [row1-end row2-start] 25% [row2-end];
}
```

如果您的定义包含重复的部分，您可以使用 `repeat()` 表示法 来简化事情：

```css
.container {
  grid-template-columns: repeat(3, 20px [col-start]);
}
```

这等同于这个：

```css
.container {
  grid-template-columns: 20px [col-start] 20px [col-start] 20px [col-start];
}
```

如果多个线共享相同的名称，它们可以按其线名称和计数引用。

```css
.item {
  grid-column-start: col-start 2;
}
```

`fr` 单位允许您将轨道的尺寸设置为网格容器自由空间的一部分。例如，这将设置每个项目为网格容器宽度的三分之一：

```css
.container {
  grid-template-columns: 1fr 1fr 1fr;
}
```

自由空间在任何非灵活项目之后计算。在这个例子中，`fr` 单位可用的自由空间不包括 50px：

```css
.container {
  grid-template-columns: 1fr 50px 1fr 1fr;
}
```

#### grid-template-areas

定义一个网格模板，通过引用 `grid-area` 属性中指定的网格区域名称。重复网格区域名称会导致内容跨这些单元格。一个句号表示一个空单元格。语法本身提供了一个网格结构的视觉表示。

值：

- **`<grid-area-name>`** – 一个网格区域名称，使用 `grid-area` 指定
- **`.`** – 一个句号表示一个空网格单元格
- **`none`** – 没有定义网格区域

```css
.container {
  grid-template-areas:
    "<grid-area-name> | . | none | ..."
    "...";
}
```

Example:

```css
.item-a {
  grid-area: header;
}
.item-b {
  grid-area: main;
}
.item-c {
  grid-area: sidebar;
}
.item-d {
  grid-area: footer;
}

.container {
  display: grid;
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto;
  grid-template-areas:
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer";
}
```

这将创建一个四列宽、三行高的网格。整个顶行将由 **header** 区域组成。中间一行将由两个 **main** 区域、一个空单元格和一个 **sidebar** 区域组成。最后一行全是 **footer**。

![Example of grid-template-areas](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/dddgrid-template-areas.svg)

每行在您的声明中需要具有相同数量的单元格。

您可以使用任何数量的相邻句号来声明单个空单元格。只要句号之间没有空格，它们就表示一个单元格。

注意，您不是使用这种语法命名线，只是命名区域。当您使用这种语法时，区域两端的线实际上会自动命名。如果网格区域的名称是 **\*foo\***，区域的起始行线和起始列线的名称将是 **\*foo\*-start**，其最后一行线和最后一列线的名称将是 **\*foo\*-end**。这意味着某些线可能具有多个名称，例如上例中最左边的线，它将具有三个名称：header-start、main-start 和 footer-start。

#### grid-template

一个用于设置 `grid-template-rows`、`grid-template-columns` 和 `grid-template-areas` 的简写属性。

值：

- **`none`** – 将所有三个属性设置为其初始值
- **`<grid-template-rows>` / `<grid-template-columns`>** – 将 `grid-template-columns` 和 `grid-template-rows` 设置为指定的值，分别，并将 `grid-template-areas` 设置为 `none`

```css
.container {
  grid-template: none | <grid-template-rows> / <grid-template-columns>;
}
```

它还接受一个更复杂但非常方便的语法来指定所有三个。这是一个例子：

```css
.container {
  grid-template:
    [row1-start] "header header header" 25px [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end]
    / auto 50px auto;
}
```

这等同于这个：

```css
.container {
  grid-template-rows: [row1-start] 25px [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;
  grid-template-areas:
    "header header header"
    "footer footer footer";
}
```

自从 Since `grid-template` 不重置 _隐式_ 网格属性 (`grid-auto-columns`, `grid-auto-rows`, 和 `grid-auto-flow`), 这可能是在大多数情况下你想做的，推荐使用 `grid` 属性而不是 `grid-template`。

#### column-gap row-gap grid-column-gap grid-row-gap

指定网格线的尺寸。你可以把它想象成设置列/行之间缝隙的宽度。

值：

- **`<line-size>`** – 一个长度值

```css
.container {
  /* standard */
  column-gap: <line-size>;
  row-gap: <line-size>;

  /* old */
  grid-column-gap: <line-size>;
  grid-row-gap: <line-size>;
}
```

例子:

```css
.container {
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px;
  column-gap: 10px;
  row-gap: 15px;
}
```

![Example of grid-column-gap and grid-row-gap](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/dddgrid-gap.svg)

缝隙仅在列/行之间创建，不在外边缘。

注意：`grid-` 前缀将删除，`grid-column-gap` 和 `grid-row-gap` 将重命名为 `column-gap` 和 `row-gap`。未加前缀的属性已经在 Chrome 68+、Safari 11.2 Release 50+ 和 Opera 54+ 中支持。

#### gap grid-gap

一个用于 `row-gap` 和 `column-gap` 的简写属性

值：

- **`<grid-row-gap>` `<grid-column-gap>`** – 长度值

```css
.container {
  /* standard */
  gap: <grid-row-gap> <grid-column-gap>;

  /* old */
  grid-gap: <grid-row-gap> <grid-column-gap>;
}
```

例子:

```css
.container {
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px;
  gap: 15px 10px;
}
```

如果没有指定 `row-gap`，它将设置为与 `column-gap` 相同的值

**注意**：`grid-` 前缀已弃用（但谁知道，可能永远不会从浏览器中实际删除）。本质上 `grid-gap` 重命名为 `gap`。未加前缀的属性已经支持在 Chrome 68+、Safari 11.2 Release 50+ 和 Opera 54+ 中。

#### justify-items

沿 _inline (row)_ 轴对齐网格项目（与沿 _block (column)_ 轴对齐的 `align-items` 相反）。此值适用于容器内的所有网格项目。

值：

- **`start`** – 将项目对齐到其单元格的开始边缘
- **`end`** – 将项目对齐到其单元格的结束边缘
- **`center`** – 将项目对齐到其单元格的中心
- **`stretch`** – 填充整个单元格的宽度（这是默认值）

```css
.container {
  justify-items: start | end | center | stretch;
}
```

例子：

```css
.container {
  justify-items: start;
}
```

![Example of justify-items set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-items-start.svg)

```css
.container {
  justify-items: end;
}
```

![Example of justify-items set to end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-items-end.svg)

```css
.container {
  justify-items: center;
}
```

![Example of justify-items set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-items-center.svg)

```css
.container {
  justify-items: stretch;
}
```

![Example of justify-items set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-items-stretch.svg)

此行为也可以通过 `justify-self` 属性在单个网格项目上设置。

#### align-items

沿 _block (column)_ 轴对齐网格项目（与沿 _inline (row)_ 轴对齐的 `justify-items` 相反）。此值适用于容器内的所有网格项目。

值：

- **`stretch`** – 填充整个单元格的高度（这是默认值）
- **`start`** – 将项目对齐到其单元格的开始边缘
- **`end`** – 将项目对齐到其单元格的结束边缘
- **`center`** – 将项目对齐到其单元格的中心
- **`baseline`** – 沿文本基线对齐项目。有 `baseline` 的修饰符 — `first baseline` 和 `last baseline` 将使用第一行或多行文本的基线。

```css
.container {
  align-items: start | end | center | stretch;
}
```

例子：

```css
.container {
  align-items: start;
}
```

![Example of align-items set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-items-start.svg)

```css
.container {
  align-items: end;
}
```

![Example of align-items set to end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-items-end.svg)

```css
.container {
  align-items: center;
}
```

![Example of align-items set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-items-center.svg)

```css
.container {
  align-items: stretch;
}
```

![Example of align-items set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-items-stretch.svg)

此行为也可以通过 `align-self` 属性在单个网格项目上设置。

还有修饰关键字 `safe` 和 `unsafe`（用法像 `align-items: safe end`）。`safe` 关键字表示“尝试像这样对齐，但如果这意味着将项目对齐到无法访问的溢出区域，则不这样做”，而 `unsafe` 将允许将内容移动到无法访问的区域（“数据丢失”）。

#### place-items

`place-items` 设置 `align-items` 和 `justify-items` 属性在单个声明中。

值：

- **`<align-items>` / `<justify-items>`** – 第一个值设置 `align-items`，第二个值设置 `justify-items`。如果省略第二个值，则将第一个值分配给两个属性。

这是一个非常实用的快速多方向居中的示例：

```css
.center {
  display: grid;
  place-items: center;
}
```

#### justify-content

有时网格的总大小可能小于其网格容器的大小。这可能发生在所有网格项目都使用非弹性单位（如 `px`）进行大小设置的情况下。在这种情况下，您可以设置网格在其网格容器中的对齐方式。此属性沿 _inline (row)_ 轴对齐网格（与沿 _block (column)_ 轴对齐的 `align-content` 相反）。

值：

- **`start`** – 将网格对齐到网格容器的开始边缘
- **`end`** – 将网格对齐到网格容器的结束边缘
- **`center`** – 将网格对齐到网格容器的中心
- **`stretch`** – 调整网格项目的大小以允许网格填充网格容器
- **`space-around`** – 在每个网格项目之间放置等量的空间，在两端留有半大小的空间
- `**space-between**` – 在每个网格项目之间放置等量的空间，在两端不留空间
- **`space-evenly`** – 在每个网格项目之间放置等量的空间，包括两端

```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between
    | space-evenly;
}
```

例子:

```css
.container {
  justify-content: start;
}
```

![Example of justify-content set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-start.svg)

```css
.container {
  justify-content: end;
}
```

![Example of justify-content set to end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-end.svg)

```css
.container {
  justify-content: center;
}
```

![Example of justify-content set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-center.svg)

```css
.container {
  justify-content: stretch;
}
```

![Example of justify-content set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-stretch.svg)

```css
.container {
  justify-content: space-around;
}
```

![Example of justify-content set to space-around](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-space-around.svg)

```css
.container {
  justify-content: space-between;
}
```

![Example of justify-content set to space-between](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-space-between.svg)

```css
.container {
  justify-content: space-evenly;
}
```

![Example of justify-content set to space-evenly](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-content-space-evenly.svg)

#### align-content

有时网格的总大小可能小于其网格容器的大小。这可能发生在所有网格项目都使用非弹性单位（如 `px`）进行大小设置的情况下。在这种情况下，您可以设置网格在其网格容器中的对齐方式。此属性沿 _block (column)_ 轴对齐网格（与沿 _inline (row)_ 轴对齐的 `justify-content` 相反）。

值：

- **`start`** – 将网格对齐到网格容器的开始边缘
- **`end`** – 将网格对齐到网格容器的结束边缘
- **`center`** – 将网格对齐到网格容器的中心
- **`stretch`** – 调整网格项目的大小以允许网格填充网格容器
- **`space-around`** – 在每个网格项目之间放置等量的空间，在两端留有半大小的空间
- **`space-between`** – 在每个网格项目之间放置等量的空间，在两端不留空间
- **`space-evenly`** – 在每个网格项目之间放置等量的空间，包括两端

```css
.container {
  align-content: start | end | center | stretch | space-around | space-between |
    space-evenly;
}
```

例子:

```css
.container {
  align-content: start;
}
```

![Example of align-content set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-start.svg)

```css
.container {
  align-content: end;
}
```

![Example of align-content set to end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-end.svg)

```css
.container {
  align-content: center;
}
```

![Example of align-content set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-center.svg)

```css
.container {
  align-content: stretch;
}
```

![Example of align-content set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-stretch.svg)

```css
.container {
  align-content: space-around;
}
```

![Example of align-content set to space-around](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-space-around.svg)

```css
.container {
  align-content: space-between;
}
```

![Example of align-content set to space-between](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-space-between.svg)

```css
.container {
  align-content: space-evenly;
}
```

![Example of align-content set to space-evenly](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-content-space-evenly.svg)

#### place-content

`place-content` 设置 `align-content` 和 `justify-content` 属性在单个声明中。

值：

- **`<align-content>` / `<justify-content>`** – 第一个值设置 `align-content`，第二个值设置 `justify-content`。如果省略第二个值，则将第一个值分配给两个属性。

所有主要浏览器都支持 `place-content` 简写属性，除了 Edge。

#### grid-auto-columns grid-auto-rows

指定任何自动生成的网格轨道的大小（又名 _隐式网格轨道_）。隐式轨道在网格中的单元格多于网格项目或网格项目位于显式网格之外时创建。

值：

- **`<track-size>`** – 可以是长度、百分比或网格自由空间的一部分（使用 `fr` 单位）

```css
.container {
  grid-auto-columns: <track-size>...;
  grid-auto-rows: <track-size>...;
}
```

为了说明如何创建隐式网格轨道，请考虑以下内容：

```css
.container {
  grid-template-columns: 60px 60px;
  grid-template-rows: 90px 90px;
}
```

![Example of 2x2 grid](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-auto-columns-rows-01.svg)

这创建了一个 2 x 2 网格。

但现在想象一下，您使用 `grid-column` 和 `grid-row` 将网格项目定位如下：

```css
.item-a {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.item-b {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
}
```

![Example of implicit tracks](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-auto-columns-rows-02.svg)

我们告诉 .item-b 从列线 5 开始并在列线 6 结束，_但我们从未定义过列线 5 或 6_。因为我们引用了不存在的线，所以会创建隐式轨道，宽度为 0 以填补空白。我们可以使用 `grid-auto-columns` 和 `grid-auto-rows` 来指定这些隐式轨道的宽度：

```css
.container {
  grid-auto-columns: 60px;
}
```

![grid-auto-columns-rows](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-auto-columns-rows-03.svg)

#### grid-auto-flow

如果您有未明确放置在网格上的网格项目，则 _自动放置算法_ 会启动以自动放置这些项目。此属性控制自动放置算法的工作方式。

值：

- **`row`** – 告诉自动放置算法依次填充每一行，根据需要添加新行（默认）
- **`column`** – 告诉自动放置算法依次填充每一列，根据需要添加新列
- **`dense`** – 告诉自动放置算法尝试在网格中较早的孔中填充较小的项目，如果较小的项目出现在后面

```css
.container {
  grid-auto-flow: row | column | row dense | column dense;
}
```

注意，**dense** 仅更改项目的视觉顺序，这可能会导致它们看起来顺序不对，这对可访问性不好。

例子：

考虑以下 HTML：

```html
<section class="container">
  <div class="item-a">item-a</div>
  <div class="item-b">item-b</div>
  <div class="item-c">item-c</div>
  <div class="item-d">item-d</div>
  <div class="item-e">item-e</div>
</section>
```

您定义了一个包含五列和两行的网格，并将 `grid-auto-flow` 设置为 `row`（这也是默认值）：

```css
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: row;
}
```

在将项目放置在网格上时，您只指定其中两个的位置：

```css
.item-a {
  grid-column: 1;
  grid-row: 1 / 3;
}
.item-e {
  grid-column: 5;
  grid-row: 1 / 3;
}
```

因为我们设置了 `grid-auto-flow` 到 `row`，我们的网格将如下所示。注意我们没有放置的三个项目（**item-b**，**item-c** 和 **item-d**）如何跨过可用行流动：

![Example of grid-auto-flow set to row](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-auto-flow-01.svg)

如果我们将其设置为 `column`，**item-b**，**item-c** 和 **item-d** 将向下流动：

```css
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: column;
}
```

![Example of grid-auto-flow set to column](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-auto-flow-02.svg)

#### grid

一个简写，用于在一个声明中设置以下所有属性的值：`grid-template-rows`，`grid-template-columns`，`grid-template-areas`，`grid-auto-rows`，`grid-auto-columns` 和 `grid-auto-flow`（注意：您只能在单个网格声明中指定显式或隐式网格属性）。

值：

- **`none`** – 将所有子属性设置为其初始值。
- **`<grid-template>`** – 与 `grid-template` 简写的工作方式相同。
- **`<grid-template-rows> / [ auto-flow && dense? ] <grid-auto-columns>?`** – 将 `grid-template-rows` 设置为指定的值。如果 `auto-flow` 关键字在斜杠的右侧，则将 `grid-auto-flow` 设置为 `column`。如果还指定了 `dense` 关键字，则自动放置算法使用“密集”打包算法。如果省略 `grid-auto-columns`，则将其设置为 `auto`。
- **`[ auto-flow && dense? ] <grid-auto-rows>? / <grid-template-columns>`** – 将 `grid-template-columns` 设置为指定的值。如果 `auto-flow` 关键字在斜杠的左侧，则将 `grid-auto-flow` 设置为 `row`。如果还指定了 `dense` 关键字，则自动放置算法使用“密集”打包算法。如果省略 `grid-auto-rows`，则将其设置为 `auto`。

例子：

以下两个代码块是等价的：

```css
.container {
  grid: 100px 300px / 3fr 1fr;
}

.container {
  grid-template-rows: 100px 300px;
  grid-template-columns: 3fr 1fr;
}
```

以下两个代码块是等价的：

```css
.container {
  grid: auto-flow / 200px 1fr;
}

.container {
  grid-auto-flow: row;
  grid-template-columns: 200px 1fr;
}
```

以下两个代码块是等价的：

```css
.container {
  grid: auto-flow dense 100px / 1fr 2fr;
}

.container {
  grid-auto-flow: row dense;
  grid-auto-rows: 100px;
  grid-template-columns: 1fr 2fr;
}
```

以下两个代码块是等价的：

```css
.container {
  grid: 100px 300px / auto-flow 200px;
}

.container {
  grid-template-rows: 100px 300px;
  grid-auto-flow: column;
  grid-auto-columns: 200px;
}
```

它还接受一个更复杂但非常方便的语法来一次性设置所有内容。您指定 `grid-template-areas`，`grid-template-rows` 和 `grid-template-columns`，所有其他子属性都设置为其初始值。您正在做的是在各自的网格区域内指定行名称和轨道大小。这最容易通过一个例子来说明：

```css
.container {
  grid:
    [row1-start] "header header header" 1fr [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end]
    / auto 50px auto;
}
```

这等价于：

```css
.container {
  grid-template-areas:
    "header header header"
    "footer footer footer";
  grid-template-rows: [row1-start] 1fr [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;
}
```

#### 子元素（网格项目）的属性

`float`，`display: inline-block`，`display: table-cell`，`vertical-align` 和 `column-*` 属性对网格项目没有影响。

#### grid-column-start grid-column-end grid-row-start grid-row-end

通过引用特定的网格线来确定网格项目在网格中的位置。`grid-column-start`/`grid-row-start` 是项目的开始行，`grid-column-end`/`grid-row-end` 是项目的结束行。

值：

- **`<line>`** – 可以是数字引用编号网格线，或名称引用命名网格线
- **`span <number>`** – 项目将跨越提供的网格轨道数
- **`span <name>`** – 项目将跨越直到遇到下一个具有提供名称的行
- **`auto`** – 表示自动放置，自动跨度或默认跨度为 1

```css
.item {
  grid-column-start: <number> | <name> | span <number> | span <name> | auto;
  grid-column-end: <number> | <name> | span <number> | span <name> | auto;
  grid-row-start: <number> | <name> | span <number> | span <name> | auto;
  grid-row-end: <number> | <name> | span <number> | span <name> | auto;
}
```

例子:

```css
.item-a {
  grid-column-start: 2;
  grid-column-end: five;
  grid-row-start: row1-start;
  grid-row-end: 3;
}
```

![Example of grid-row/column-start/end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-column-row-start-end-01.svg)

```css
.item-b {
  grid-column-start: 1;
  grid-column-end: span col4-start;
  grid-row-start: 2;
  grid-row-end: span 2;
}
```

![Example of grid-row/column-start/end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-column-row-start-end-02.svg)

如果没有声明 `grid-column-end`/`grid-row-end`，项目将默认跨越 1 个轨道。

项目可以相互重叠。您可以使用 `z-index` 来控制它们的堆叠顺序。

#### grid-column grid-row

`grid-column-start` + `grid-column-end` 和 `grid-row-start` + `grid-row-end` 的简写。

值：

- **`<start-line>` / `<end-line>`** – 每个都接受与长属性相同的值，包括 `span`

```css
.item {
  grid-column: <start-line> / <end-line> | <start-line> / span <value>;
  grid-row: <start-line> / <end-line> | <start-line> / span <value>;
}
```

例子：

```css
.item-c {
  grid-column: 3 / span 2;
  grid-row: third-line / 4;
}
```

![Example of grid-column/grid-row](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-column-row.svg)

如果没有声明结束行值，项目将默认跨越 1 个轨道。

#### grid-area

给项目一个名称，以便可以通过使用 `grid-template-areas` 属性创建的模板引用。或者，这个属性也可以用作 `grid-row-start` + `grid-column-start` + `grid-row-end` + `grid-column-end` 的更短的简写。

值：

- **`<name>`** – 一个您选择的名称
- **`<row-start>` / `<column-start>` / `<row-end>` / `<column-end>`** – 可以是数字或命名行

```css
.item {
  grid-area: <name> | <row-start> / <column-start> / <row-end> / <column-end>;
}
```

例子：

作为给项目分配名称的一种方式：

```css
.item-d {
  grid-area: header;
}
```

作为 `grid-row-start` + `grid-column-start` + `grid-row-end` + `grid-column-end` 的简写：

```css
.item-d {
  grid-area: 1 / col4-start / last-line / 6;
}
```

![Example of grid-area](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/grid-area.svg)

#### justify-self

沿 _inline (row)_ 轴对齐网格项目（与 `align-self` 沿 _block (column)_ 轴对齐相反）。此值适用于单个网格项目中的单个单元格。

值：

- **`start`** – 将网格项目与单元格的开始边缘对齐
- **`end`** – 将网格项目与单元格的结束边缘对齐
- **`center`** – 将网格项目与单元格的中心对齐
- **`stretch`** – 填充整个单元格的宽度（这是默认值）

```css
.item {
  justify-self: start | end | center | stretch;
}
```

例子：

```css
.item-a {
  justify-self: start;
}
```

![Example of justify-self set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-self-start.svg)

```css
.item-a {
  justify-self: end;
}
```

![alt="Example](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-self-end.svg)

```css
.item-a {
  justify-self: center;
}
```

![Example of justify-self set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-self-center.svg)

```css
.item-a {
  justify-self: stretch;
}
```

![Example of justify-self set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/justify-self-stretch.svg)

要为网格中的所有项目设置对齐方式，此行为也可以通过 `justify-items` 属性在网格容器上设置。

#### align-self

沿 _block (column)_ 轴对齐网格项目（与 `justify-self` 沿 _inline (row)_ 轴对齐相反）。此值适用于单个网格项目中的内容。

值：

- **`start`** – 将网格项目与单元格的开始边缘对齐
- **`end`** – 将网格项目与单元格的结束边缘对齐
- **`center`** – 将网格项目与单元格的中心对齐
- **`stretch`** – 填充整个单元格的高度（这是默认值）

```css
.item {
  align-self: start | end | center | stretch;
}
```

例子：

```css
.item-a {
  align-self: start;
}
```

![Example of align-self set to start](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-self-start.svg)

```css
.item-a {
  align-self: end;
}
```

![Example of align-self set to end](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-self-end.svg)

```css
.item-a {
  align-self: center;
}
```

![Example of align-self set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-self-center.svg)

```css
.item-a {
  align-self: stretch;
}
```

![Example of align-self set to stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/align-self-stretch.svg)

要为网格中的所有项目设置对齐方式，此行为也可以通过 `align-items` 属性在网格容器上设置。

#### place-self

`place-self` 在一个声明中设置 `align-self` 和 `justify-self` 属性。

值：

- **`auto`** – 布局模式的“默认”对齐方式。
- **`<align-self>` / `<justify-self>`** – 第一个值设置 `align-self`，第二个值设置 `justify-self`。如果省略第二个值，则将第一个值分配给两个属性。

例子：

```css
.item-a {
  place-self: center;
}
```

![place self set to center](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/place-self-center.svg)

```css
.item-a {
  place-self: center stretch;
}
```

![place set set to center stretch](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/place-self-center-stretch.svg)

所有主要浏览器都支持 `place-self` 简写属性，除了 Edge。

## 特殊单位和函数

#### fr 单位

你可能会在 CSS Grid 中大量使用 分数单位，比如 `1fr`。它们基本上意味着“剩余空间的份额”。所以像这样的声明：

```css
grid-template-columns: 1fr 3fr;
```

大致意味着 `25% 75%`。除了这些百分比值比分数单位更严格。例如，如果你向这些百分比列添加填充，现在你已经打破了 100% 宽度（假设一个 `content-box` 盒子模型）。分数单位也更容易与其他单位组合，正如你所想象的：

```css
grid-template-columns: 50px min-content 1fr;
```

#### 尺寸关键字

当调整行和列的大小时，你可以使用所有你习惯的长度单位，比如 `px`, rem, % 等，但你也有关键字：

- `min-content`: 内容的最小大小。想象一个像 “E pluribus unum” 的文本行，min-content 可能是单词 “pluribus” 的宽度。
- `max-content`: 内容的最大大小。想象一个像 “E pluribus unum” 的文本行，max-content 可能是整个句子的长度。
- `auto`: 这个关键字很像 `fr` 单位，除了它们在分配剩余空间时“输掉”了。
- 分数单位：见上文

#### 尺寸函数

- `fit-content()` 函数使用可用空间，但不超过 `min-content` 和不超过 `max-content`。
- `minmax()` 函数正好做它看起来像的事情：它为长度设置一个最小值和最大值。这在与相对单位结合使用时非常有用。例如，你可能希望一列只能收缩到一定程度。这是非常有用，可能正是你想要的

```css
grid-template-columns: minmax(100px, 1fr) 3fr;
```

- `min()` 函数。
- `max()` 函数。

#### repeat() 函数和关键字

`repeat()` 函数可以节省一些打字：

```css
grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

/* easier: */
grid-template-columns: repeat(8, 1fr);

/* especially when: */
grid-template-columns: repeat(8, minmax(10px, 1fr));
```

但是 `repeat()` 可以与关键字结合使用时变得非常复杂：

- `auto-fill`: 在行中尽可能多地拟合列，即使它们是空的。
- `auto-fit:` 将所有列拟合到空间中。更喜欢扩展列以填充空间，而不是空列。

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```
