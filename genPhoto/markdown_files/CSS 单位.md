### 1. **`em`**

`em` 是相对于父元素的字体大小进行缩放的单位。

- 如果父元素的字体大小是 `16px`，则 `1em = 16px`，`2em = 32px`。
- 在不同的元素层级中，`em` 会根据父元素的字体大小进行级联。

```html
<div style="font-size: 16px;">
  <p style="font-size: 2em;">此段落的字体大小是32px。</p>
</div>
```

### 2. **`rem`**

`rem` 是相对于根元素 (`<html>`) 的字体大小，而不是相对父元素的大小。

- 通常根元素的默认字体大小是 `16px`，所以 `1rem = 16px`，`2rem = 32px`。

```html
<p style="font-size: 2rem;">此段落的字体大小是32px，无论它在文档的哪一层级。</p>
```

### 3. **`vh`（Viewport Height）** 和 **`vw`（Viewport Width）**

`vh` 是相对于视口高度的单位，1 `vh` 等于视口高度的 1%。

- 如果视口高度是 `1000px`，那么 `1vh = 10px`。

```css
.box {
  height: 50vh; /* 视口高度的50% */
}
```

`vw` 是相对于视口宽度的单位，1 `vw` 等于视口宽度的 1%。

- 如果视口宽度是 `1200px`，那么 `1vw = 12px`。

```css
.box {
  width: 50vw; /* 视口宽度的50% */
}
```

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/93fa9987-bd91-4ec7-8ab7-ed667b294815.png)

### 4. **`dvh` 和 `dvw`**

`dvh` 和 `dvw` 是“动态视口”的高度和宽度单位，动态指的是视口在设备上有 UI 变化时（例如软键盘出现）会实时调整。例如在移动设备上，浏览器地址栏和下面的快捷工具栏会压缩视口高度。

- `1dvh` 是当前设备动态视口高度的 1%。

```css
.box {
  height: 50dvh; /* 当前动态视口高度的50% */
}
```

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/dvh.png)

### 5. **`lvh` 和 `lvw`**

`lvh` 和 `lvw` 是指“最大视口”的高度和宽度单位，通常指不受动态 UI 元素（如软键盘、浏览器工具栏）影响的初始视口大小。

- `1lvh` 是视口的最大可能高度的 1%。

```css
.box {
  height: 100lvh; /* 视口的最大高度（不包含动态 UI 元素） */
}
```

### 6. **`svh` 和 `svw`**

`svh` 和 `svw` 是指“最小视口”的高度和宽度单位，通常是包括了 UI 元素（例如移动设备上的地址栏等）影响的最小视口。

- `1svh` 是当前可视视口的最小高度的 1%。

```css
.box {
  height: 100svh; /* 视口的最小可能高度 */
}
```

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/svh-lvh.png)
