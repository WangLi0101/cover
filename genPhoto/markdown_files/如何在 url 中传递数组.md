在 URL 中传递数组有几种常见的方法，取决于你想如何解析这些数据。以下是几种常用的方式：

### 1. **通过多次传递同一参数名**

你可以通过多次使用相同的参数名来传递数组的值。例如，假设你有一个数组 `colors`，你可以这样传递它：

```bash
https://example.com/page?colors=red&colors=green&colors=blue
```

在服务器端或前端解析时，可以将这些值收集成一个数组。

### 2. **通过逗号分隔**

将数组的值用逗号分隔在一个参数中传递。例如：

```bash
https://example.com/page?colors=red,green,blue
```

在解析时，可以根据逗号将这些值拆分为一个数组。

### 3. **通过 JSON 字符串传递**

你可以将数组转换为 JSON 字符串，并将其作为参数传递。需要注意的是，JSON 字符串需要进行 URL 编码。例如：

```bash
https://example.com/page?colors=%5B%22red%22%2C%22green%22%2C%22blue%22%5D
```

这里的 `["red","green","blue"]` 被编码后传递，解析时需要先进行 URL 解码，再将字符串转换为数组。

### 4. **通过方括号表示法**

这种方法通常用于 PHP 或其他需要数组形式的场景。例如：

```bash
https://example.com/page?colors[]=red&colors[]=green&colors[]=blue
```

服务器端会将这些参数自动解析为一个数组。

### 5. **通过自定义格式**

你可以使用自定义的分隔符或格式来传递数组。例如用分号 `;` 分隔：

```bash
https://example.com/page?colors=red;green;blue
```

解析时根据自定义的分隔符进行拆分。

### **总结**

选择哪种方式取决于你应用的具体需求、服务器的解析方式以及你对 URL 的长度和可读性的要求。