以下代码中，当用户点击 "Text" 时，为什么会弹出两次 `alert("hi")`？

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Bubbling Example</title>
</head>
<body>
    <label id="wow">
        <input type="checkbox" name="checkbox" value="value">Text
    </label>

    <script>
        window.onload = function() {
            var wow = document.getElementById("wow");
            wow.onclick = function() {
                alert("hi");
            };
        };
    </script>
</body>
</html>
```

- 当点击 `label` 中的文本时，事件冒泡和标签的默认行为导致 `onclick` 事件被触发两次：一次是点击 `label` 时，另一次是由于 `label` 的点击行为导致 `input` 的点击事件触发，并冒泡回 `label`，从而再次触发 `onclick` 事件。

> 标签默认行为：当一个 `<label>` 元素与某个 `<input>` 元素关联时，点击 `<label>` 元素会自动触发其关联的 `<input>` 元素的点击行为。

可以通过以下方法修改代码，避免重复触发：

- 将 `label` 和 `input` 分开，并使用 `for` 属性关联它们。
- 在 `input` 的 `onclick` 事件中阻止事件冒泡。

修改后的代码：

```html
<input id="wowcb" type="checkbox" name="checkbox" value="value">
<label id="wow" for="wowcb">Text</label>
```

或者：

```html
<label id="wow">
    <input type="checkbox" name="checkbox" value="value" onclick="event.stopPropagation();">Text
</label>
```