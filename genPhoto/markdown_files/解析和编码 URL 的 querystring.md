### 解析

#### 方法一

```javascript
function url2Params(url) {
  const dict = {};
  // 当 ^ 出现在方括号 [] 内部时，它表示“非”
  // [^?&]* 即匹配除了 ? 和 & 以外的任何字符。
  url.replace(/([^?&]*)=([^&]*)/g, (_, key, val) => {
    key = decodeURIComponent(key);
    val = decodeURIComponent(val);
    // 如果 key 已经存在，则将其转换为数组
    if (dict[key]) return (dict[key] = [dict[key], val].flat());
    dict[key] = val;
  });
  return dict;
}
```

> 捕获组（Capturing Group）是在正则表达式中通过圆括号 () 来定义的一部分表达式，用于提取和保存与模式匹配的特定子字符串。每个捕获组会捕获正则表达式中匹配到的内容，并且可以通过访问这些捕获组来获取它们的值。 上面的代码中，`([^?&]*)` 和 `([^&]*)` 分别是两个捕获组，用于匹配 URL 中的键和值。

> **URL 编码**：在 URL 中，某些字符具有特殊含义，比如 `=`、`&`、`?` 等。为了在 URL 中包含这些字符，它们需要经过编码处理。URL 编码将这些特殊字符转换成 `%` 开头的十六进制表示，比如空格会被编码为 `%20`，`&` 会被编码为 `%26`。 `decodeURIComponent`() 函数可以对编码后的 URL 进行解码。

#### 方法二

```javascript
function url2Params(url) {
  // 使用 new URL() 来解析完整的 URL
  const urlObj = new URL(url);
  // 使用 URLSearchParams 来解析查询字符串
  const params = new URLSearchParams(urlObj.search);
  const dict = {};
  params.forEach((value, key) => {
    dict[key] = dict[key] ? [dict[key], value].flat() : value;
  });
  return dict;
}
```

#### 测试

```javascript
console.log(url2Params("https://www.example.com/?a=1&b=2&c=3"));
// { a: '1', b: '2', c: '3' }
console.log(url2Params("https://www.example.com/?a=1&b=2&a=3"));
// { a: ['1', '3'], b: '2' }
```

### 编码

#### 方法一

```javascript
function params2Url(params) {
  return Object.entries(params)
    .map(([key, val]) =>
      Array.isArray(val)
        ? val
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
}
```

> `Object.entries()` 方法返回一个给定对象自身可枚举属性的键值对数组。这里使用 `Object.entries()` 将对象转换为键值对数组，然后使用 `map()` 方法遍历数组，将每个键值对转换为 URL 编码后的字符串。最后使用 `join()` 方法将所有字符串连接起来。

#### 方法二

```javascript
function params2Url(params) {
  const urlObj = new URL("https://www.example.com");
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    Array.isArray(val)
      ? val.forEach((v) => searchParams.append(key, v))
      : searchParams.append(key, val);
  }
  urlObj.search = searchParams.toString();
  return urlObj.toString();
}
```

> 使用 `URLSearchParams` 对象来处理查询字符串。`URLSearchParams` 对象提供了一种方便的方式来处理 URL 查询字符串。`append()` 方法用于向查询字符串中添加一个新的键值对，`toString()` 方法用于将查询字符串转换为字符串。

#### 测试

```javascript
console.log(params2Url({ a: "1", b: "2", c: "3" }));
// "https://www.example.com/?a=1&b=2&c=3"
console.log(params2Url({ a: ["1", "3"], b: "2" }));
// "https://www.example.com/?a=1&a=3&b=2"
```