凭据`credentials` 是指包含用户名和密码的 Cookie、TLS 客户端证书或身份验证头（如 Basic Auth 或 Bearer Token）。


要控制浏览器是否发送凭据以及是否接受任何 `Set-Cookie` 响应头，可以设置 `credentials` 选项，该选项可以取以下三种值之一：

1. **omit**：永远不在请求中发送凭据，也不在响应中包含凭据。
2. **same-origin**（默认值）：仅为同源请求发送并包含凭据。
3. **include**：总是包含凭据，即使是跨源请求。

请注意，如果一个 Cookie 的 `SameSite` 属性被设置为 `Strict` 或 `Lax`，即使 `credentials` 设置为 `include`，该 Cookie 也不会在跨站点请求中发送。

### 示例说明

假设你有以下服务器响应，其中包含 `Set-Cookie` 头：

```http
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; Path=/; HttpOnly
Content-Type: application/json

{
  "message": "Success"
}
```

如果客户端使用 `fetch` 并将 `credentials` 设置为 `omit`：

```javascript
fetch('https://example.com/api/data', {
  method: 'GET',
  credentials: 'omit' // 不发送或接收任何凭据
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 结果：

- **发送部分**：请求头中不会包含任何与 `https://example.com` 相关的 Cookies 或身份验证信息。
- **接收部分**：尽管服务器在响应中设置了 `Set-Cookie`，浏览器也不会存储 `sessionId=abc123` 这个 Cookie。下次对 `https://example.com` 的请求仍然不会包含该 Cookie。