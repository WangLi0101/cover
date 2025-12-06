### 代码

```html
<div class="container">
  我是<span class="item">行内元素</span>
  风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。万里悲秋常作客，百年多病独登台。艰难苦恨繁霜鬓，潦倒新停浊酒杯。
</div>
```

```css
.item {
  display: inline;
  padding: 10px;
  margin: 10px;
  border: 1px solid skyblue;
}
```

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/inline-padding-margin.png)

> 由上图可以看出，`display: inline` 的元素设置 `padding` 会生效，但是 `padding` 上下方向不会使其它元素受到挤压，仿佛不生效。

> 由上图可以看出，`display: inline` 的元素设置 `margin` 左右方向会生效，但是 `margin` 上下方向不会生效。
