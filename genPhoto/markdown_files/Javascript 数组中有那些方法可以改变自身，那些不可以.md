### 一、**改变原数组的方法**

这些方法会**直接修改原数组**的内容或结构。

1. **`push()`**

   - 向数组末尾添加一个或多个元素，返回新数组的长度。

   - 语法：`array.push(item1, item2, ...)`

   - 参数：

     - `item1, item2, ...`：要添加到数组中的新元素。

   - 返回值：新数组的长度。

   - 示例：

     ```javascript
     let arr = [1, 2, 3];
     arr.push(4); // arr: [1, 2, 3, 4]
     ```

2. **`pop()`**

   - 删除数组的最后一个元素，并返回该元素。

   - 语法：`array.pop()`

   - 返回值：被删除的元素。

   - 示例：

     ```javascript
     let arr = [1, 2, 3];
     arr.pop(); // arr: [1, 2], 返回 3
     ```

3. **`shift()`**

   - 删除数组的第一个元素，并返回该元素。

   - 语法：`array.shift()`

   - 返回值：被删除的元素。

   - 示例：

     ```javascript
     let arr = [1, 2, 3];
     arr.shift(); // arr: [2, 3], 返回 1
     ```

4. **`unshift()`**

   - 在数组的开头添加一个或多个元素，返回新数组的长度。

   - 语法：`array.unshift(item1, item2, ...)`

   - 参数：

     - `item1, item2, ...`：要添加到数组中的新元素。

   - 返回值：新数组的长度。

   - 示例：

     ```javascript
     let arr = [1, 2, 3];
     arr.unshift(0); // arr: [0, 1, 2, 3]
     ```

5. **`splice()`**

   - 用于添加、删除、替换数组中的元素。可以返回被删除的元素。

   - 语法：`array.splice(start, deleteCount, item1, item2, ...)`

   - 参数：

     - `start`：开始操作的索引。
     - `deleteCount`：要删除的元素数量。
     - `item1, item2, ...`：要添加到数组中的新元素。

   - 返回值：被删除的元素组成的数组。

   - 示例：

     ```javascript
     let arr = [1, 2, 3, 4];
     // 删除索引 1 开始的 2 个元素，返回 [2, 3]
     arr.splice(1, 2); // arr: [1, 4]
     // 在索引 1 处插入元素 5，返回 [1, 5, 4]
     arr.splice(1, 0, 5); // arr: [1, 5, 4]
     ```

6. **`sort()`**

   - 对数组进行排序，默认是按字典顺序（UTF-16 字符顺序）排序，也可以提供自定义的比较函数。直接修改原数组。

   - 语法：`array.sort([compareFunction])`

   - 参数：

     - `compareFunction`：可选，用于指定排序的比较函数。

   - 返回值：排序后的数组。

   - 示例：

     ```javascript
     let arr = [3, 1, 4, 2];
     arr.sort(); // arr: [1, 2, 3, 4]
     ```

7. **`reverse()`**

   - 反转数组的顺序。

   - 语法：`array.reverse()`

   - 返回值：反转后的数组。

   - 示例：

     ```javascript
     let arr = [1, 2, 3];
     arr.reverse(); // arr: [3, 2, 1]
     ```

8. **`copyWithin()`**

   - 将数组中的一部分复制到同一数组中的另一个位置，并覆盖现有元素。不会改变数组长度。

   - 语法：`array.copyWithin(target, start, end)`

   - 参数：

     - `target`：开始复制的位置。
     - `start`：开始复制的索引。
     - `end`：结束复制的索引。

   - 返回值：修改后的数组。

   - 示例：

     ```javascript
     let arr = [1, 2, 3, 4, 5];
     // 将索引 3 开始的元素复制到索引 0 处, end 没有指定，默认复制到数组末尾，也就是 4 和 5 复制到索引 0 和 1 处
     arr.copyWithin(0, 3); // arr: [4, 5, 3, 4, 5]
     // 将索引 3 开始的元素复制到索引 0 处, end 指定为 4，也就是 4 复制到索引 0 处
     arr.copyWithin(0, 3, 4); // arr: [4, 2, 3, 4, 5]
     ```

9. **`fill()`**

   - 用静态值填充数组中的所有元素，或部分元素。

   - 语法：`array.fill(value, start, end)`

   - 参数：

     - `value`：要填充的值。
     - `start`：开始填充的索引。
     - `end`：结束填充的索引， 不包括 end 索引。

   - 返回值：修改后的数组。

   - 示例：

     ```javascript
     let arr = [1, 2, 3, 4];
     arr.fill(0); // arr: [0, 0, 0, 0]
     let arr2 = [1, 2, 3, 4];
     // 从索引 1 开始，到索引 3 结束，填充 0，包括索引 1，不包括索引 3
     arr2.fill(0, 1, 3); // arr2: [1, 0, 0, 4]
     ```

---

### 二、**不改变原数组的方法**

这些方法会返回一个新数组或值，而不会修改原数组。

1.  **`concat()`**

    - 用于合并两个或多个数组，返回一个新的数组。

    - 语法：`array.concat(value1, value2, ..., valueN)`

    - 参数：

      - `value1, value2, ..., valueN`：要添加到数组中的新元素。

    - 返回值：新数组。

    - 示例：

      ```javascript
      let arr1 = [1, 2];
      let arr2 = [3, 4];
      let newArr = arr1.concat(arr2); // newArr: [1, 2, 3, 4], arr1: [1, 2], arr2: [3, 4]
      ```

2.  **`slice()`**

    - 提取数组的一部分，返回一个新的数组，不会修改原数组。

    - 语法：`array.slice([start, end])`

    - 参数：

      - `start`：开始提取的索引。
      - `end`：结束提取的索引，不包括 end 索引。

    - 返回值：新数组。

    - 示例：

      ```javascript
      let arr = [1, 2, 3, 4];
      let slicedArr = arr.slice(1, 3); // slicedArr: [2, 3], arr: [1, 2, 3, 4]
      ```

3.  **`map()`**

    - 对数组的每个元素进行一次映射，返回一个新数组。

    - 语法：`array.map(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：新数组。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let newArr = arr.map((x) => x * 2); // newArr: [2, 4, 6], arr: [1, 2, 3]
      ```

4.  **`filter()`**

    - 过滤数组中的元素，返回符合条件的新数组。

    - 语法：`array.filter(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：新数组。

    - 示例：

      ```javascript
      let arr = [1, 2, 3, 4];
      let newArr = arr.filter((x) => x > 2); // newArr: [3, 4], arr: [1, 2, 3, 4]
      ```

5.  **`reduce()`**

    - 将数组中的每个元素与累积器函数一起合并，返回最终值（不是数组）。

    - 语法：`array.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `initialValue`：可选，用于指定累积器的初始值。

    - 返回值：最终值。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let sum = arr.reduce((acc, curr) => acc + curr, 0); // sum: 6, arr: [1, 2, 3]
      ```

6.  **`find()`**

    - 查找数组中**第一个**满足条件的元素，返回该元素，不修改原数组。

    - 语法：`array.find(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：满足条件的元素。

    - 示例：

      ```javascript
      let arr = [1, 2, 3, 4];
      let found = arr.find((x) => x > 2); // found: 3, arr: [1, 2, 3, 4]
      ```

7.  **`findIndex()`**

    - 查找数组中**第一个**满足条件的元素的索引，返回索引，不修改原数组。

    - 语法：`array.findIndex(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：满足条件的元素的索引。

    - 示例：

      ```javascript
      let arr = [1, 2, 3, 4];
      let index = arr.findIndex((x) => x > 2); // index: 2, arr: [1, 2, 3, 4]
      ```

8.  **`every()`**

    - 判断数组中的每个元素是否都满足条件，返回布尔值。

    - 语法：`array.every(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：布尔值。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let allPositive = arr.every((x) => x > 0); // allPositive: true, arr: [1, 2, 3]
      ```

9.  **`some()`**

    - 判断数组中是否有至少一个元素满足条件，返回布尔值。

    - 语法：`array.some(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：布尔值。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let hasNegative = arr.some((x) => x < 0); // hasNegative: false, arr: [1, 2, 3]
      ```

10. **`includes()`**

    - 判断数组中是否包含某个元素，返回布尔值。

    - 语法：`array.includes(searchElement, fromIndex)`

    - 参数：

      - `searchElement`：要查找的元素。
      - `fromIndex`：可选，开始查找的索引。

    - 返回值：布尔值。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let hasTwo = arr.includes(2); // hasTwo: true, arr: [1, 2, 3]
      ```

11. **`indexOf()`**

    - 查找元素在数组中的索引，返回该索引，找不到则返回 -1。

    - 语法：`array.indexOf(searchElement, fromIndex)`

    - 参数：

      - `searchElement`：要查找的元素。
      - `fromIndex`：可选，开始查找的索引。

    - 返回值：索引。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let index = arr.indexOf(2); // index: 1, arr: [1, 2, 3]
      ```

12. **`join()`**

    - 将数组的所有元素连接成一个字符串。

    - 语法：`array.join([separator])`

    - 参数：

      - `separator`：可选，用于分隔数组元素的字符串。

    - 返回值：字符串。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      let str = arr.join("-"); // str: "1-2-3", arr: [1, 2, 3]
      ```

13. **`flatMap()`**

    - 首先映射数组中的每个元素，然后将结果展平为一个新数组。直接改变数组长度。

    - 语法：`array.flatMap(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

      - 返回值：新数组。

    - 示例：

      ```javascript
      let arr = [1, 2, 3, 4];
      let resArr = arr.flatMap((x) => [x * 2]); // resArr: [2, 4, 6, 8], arr: [1, 2, 3, 4]
      let arr2 = [
        [1, 2, 3],
        [4, 5],
      ];
      // flatMap 会先执行 map 操作，然后执行 flat 操作
      let resArr2 = arr2.flatMap((x) => x); // resArr2: [1, 2, 3, 4, 5], arr2: [[1, 2, 3], [4, 5]]
      ```

14. **`flat()`**

    - 将嵌套数组展平为新数组。

    - 语法：`array.flat([depth])`

    - 参数：

      - `depth`：可选，展平的深度，默认为 1。

    - 返回值：新数组。

    - 示例：

      ```javascript
      let arr = [1, 2, [3, 4, [5, 6]]];
      let flatArr = arr.flat(); // flatArr: [1, 2, 3, 4, 5, 6], arr: [1, 2, [3, 4, [5, 6]]]
      let flatArr2 = arr.flat(2); // flatArr2: [1, 2, 3, 4, 5, 6], arr: [1, 2, [3, 4, [5, 6]]]
      ```

15. **`forEach()`**

    - 遍历数组中的每个元素，执行回调函数。

    - 语法：`array.forEach(callback(currentValue[, index[, array]])[, thisArg])`

    - 参数：

      - `callback`：用于处理每个元素的函数。
      - `thisArg`：可选，用于指定 callback 的 this 值。

    - 返回值：undefined。

    - 示例：

      ```javascript
      let arr = [1, 2, 3];
      arr.forEach((x) => console.log(x)); // 1 2 3, arr: [1, 2, 3]
      ```

---

### 总结

#### 改变原数组的方法：

- `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, `reverse()`, `copyWithin()`, `fill()`

#### 不改变原数组的方法：

- `concat()`, `slice()`, `map()`, `filter()`, `reduce()`, `find()`, `findIndex()`, `every()`, `some()`, `includes()`, `indexOf()`, `join()`, `flatMap()`, `flat()`, `forEach()`
