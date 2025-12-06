`TypedArray` 是一种 JavaScript 对象，它表示一个类型化数组，可以存储和操作一组具有相同类型的数值。`TypedArray` 是为处理二进制数据而设计的，特别适合于 WebGL、文件操作和其他需要高效处理大量数据的场景。

### `TypedArray` 的特性

- **固定长度**：`TypedArray` 的长度在创建后是固定的，无法调整。
- **类型约束**：`TypedArray` 只能存储特定类型的数据，例如 8 位无符号整数、32 位浮点数等。
- **高效性**：`TypedArray` 在内存中是连续分配的，适合快速访问和操作大量数据。

### `TypedArray` 的类型

`TypedArray` 的类型是由多个具体的构造函数定义的，每种类型表示一种特定的数据类型。例如：

- `Int8Array`, `Uint8Array`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array` 等。
- 数字表示数据类型的字节长度，例如 `Int8Array` 表示 8 位有符号整数，占用 1 个字节。

### 创建 `TypedArray`

你可以通过多种方式创建 `TypedArray`，包括：

1. **通过长度创建空的 `TypedArray`**：

   ```javascript
   const intArray = new Int8Array(10); // 创建一个长度为 10 的 Int8Array，所有元素初始化为 0
   ```

2. **通过普通数组创建 `TypedArray`**：

   ```javascript
   const floatArray = new Float32Array([1.5, 2.5, 3.5]);
   ```

3. **通过另一个 `TypedArray` 创建**：

   ```javascript
   const anotherArray = new Uint8Array(new Uint16Array([400, 800]));
   ```

4. **通过 `ArrayBuffer` 创建 `TypedArray`**：

   ```javascript
   const buffer = new ArrayBuffer(16); // 创建一个 16 字节的缓冲区
   const intArray = new Int32Array(buffer); // 使用这个缓冲区创建一个 Int32Array
   ```

### 使用 `TypedArray`

`TypedArray` 提供了类似于普通数组的操作方法，如 `set`、`subarray`、`slice`、`forEach`、`map` 等，同时可以直接通过索引访问元素。

```javascript
const array = new Uint8Array([1, 2, 3, 4]);
console.log(array[0]); // 输出 1
array[1] = 255;
console.log(array); // 输出 Uint8Array(4) [1, 255, 3, 4]
```

### 应用场景

- **WebGL**：在图形编程中处理顶点、颜色等数据。
- **文件处理**：读取或生成二进制文件（如图像、音频等）。
- **网络传输**：在 WebSocket 或其他二进制协议中传输数据。
