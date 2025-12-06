### 代码

```html
<h1>First heading 1 element</h1>
<p>First paragraph element</p>
<p>Second paragraph element</p>
<h2>First heading 2 element</h2>
<p>Third paragraph element</p>
<h3>First heading 3 element</h3>
<p>Fourth paragraph element</p>
<p>Fifth paragraph element</p>
```

```css
p:nth-child(3) {
  color: DeepPink;
}
p:nth-of-type(3) {
  color: skyblue;
}
```

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/nth-child-nth-of-type.png)

> 可以发现，`nth-child` 选择的是父元素下第 3 个子元素，而 `nth-of-type` 选择的是父元素下第 3 个类型为 `<p>` 的子元素。

### 语法

#### `:nth-child(n)`

`n` 可以是数字、关键字或公式。

- 关键字：`even` 和 `odd`，表示偶数和奇数。
- 公式：`an + b`，其中 `a` 和 `b` 是数字，`n` 是整数，表示每隔 `a` 个元素选择一个。

#### `:nth-of-type(n)`

`n` 可以是数字、关键字或公式。

- 关键字：`even` 和 `odd`，表示偶数和奇数。
- 公式：`an + b`，其中 `a` 和 `b` 是数字，`n` 是整数，表示每隔 `a` 个元素选择一个。
### 选择前 N 个元素和后 N 个元素

```css
/* 选择前 3 个元素 */
p:nth-child(-n + 3) {
  color: DeepPink;
}
/* 选择后 3 个元素 */
p:nth-last-child(-n + 3) {
  color: skyblue;
}
```