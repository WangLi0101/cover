洗牌算法的目标是将一组数据（如数组）随机排列。理想的洗牌算法应该做到以下几点：

1. **等概率性**：每个元素都有相同的概率出现在数组的每个位置。
2. **时间复杂度低**：通常希望算法的时间复杂度为 `O(n)`。
3. **就地打乱**：洗牌在原数组上进行，而不生成新的数组。

### `Fisher-Yates` 洗牌算法

**`Fisher-Yates` 算法**是最常用且高效的洗牌算法之一。它通过从数组最后一个元素开始，随机选取一个未洗牌的元素，并将其与当前元素交换，从而保证所有元素的顺序是随机的。

#### 算法步骤

1. 从数组的最后一个元素开始，随机生成一个索引。
2. 将该索引对应的元素与当前元素进行交换。
3. 重复上述步骤，直到遍历完数组中的所有元素。

该算法的核心在于随机选择未处理的元素，然后将其与当前元素交换，确保每个元素有均等的机会出现在任何位置。

### 算法图解

![state](https://libra-blog.oss-cn-beijing.aliyuncs.com/src/fisher-yates.gif)

### 代码实现

```javascript
// Fisher-Yates 洗牌算法
function shuffle(array) {
  let currentIndex = array.length;
  
  // 当还有元素未洗牌时
  while (currentIndex !== 0) {
    // 随机选择剩余的一个元素
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // 交换当前元素和随机选择的元素
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  
  return array;
}

// 示例
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("洗牌前：", cards);
const shuffledCards = shuffle(cards);
console.log("洗牌后：", shuffledCards);
```

### 代码解析

1. `currentIndex` 用来跟踪还未处理的元素位置，初始值为数组的长度。
2. 在 `while` 循环中，算法会随机生成一个索引 `randomIndex`，它代表当前剩余元素中的一个随机位置。
3. 然后，使用ES6的数组解构赋值语法 `[a, b] = [b, a]` 来交换当前元素和随机选定的元素。
4. 重复上述步骤，直到数组的所有元素都已经被处理完毕。

### 时间复杂度与性能

Fisher-Yates洗牌算法的时间复杂度是 **O(n)**，因为它只遍历数组一次，并在每次迭代中进行常数时间的操作（生成随机索引并交换元素）。因此，该算法非常高效，适用于大规模数组的随机化操作。

### 结论

`Fisher-Yates` 洗牌算法提供了一个简单而高效的解决方案，能够均匀地随机打乱数组中的元素。它不仅适用于随机打乱数组中的数据，还可以用于各类随机化场景，如随机抽样、随机排列等。