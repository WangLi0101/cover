### LRU Cache 的基本原理

- **缓存命中**：当请求的数据在缓存中时，称为缓存命中，此时将数据项移到链表的头部，表示其最近被使用。
- **缓存未命中**：当请求的数据不在缓存中时，称为缓存未命中。此时，需要将数据添加到缓存中。如果缓存已满，则需要移除链表尾部的节点（即最久未使用的数据项），然后将新数据项插入链表的头部。

### LRU Cache 的实现

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // 使用 Map 作为哈希表
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1; // 缓存未命中
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 如果存在，先删除再重新插入，以更新顺序
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // map.keys().next().value 是 JavaScript 中用于从 Map 对象中获取第一个键（key）的表达式
      // map.keys() 方法返回一个包含 Map 对象中所有键的迭代器对象（MapIterator）。这个迭代器对象可以用来遍历 Map 中的所有键。
      // 在 Map 对象中，最早插入的项通常就是最久未使用的项
      this.cache.delete(this.cache.keys().next().value);
    }
    // 插入新的键值对到链表头部
    this.cache.set(key, value);
  }
}
```

### 使用 LRU Cache

```javascript
const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // 返回 1
lru.put(3, 3); // 移除键 2
console.log(lru.get(2)); // 返回 -1 (未命中)
lru.put(4, 4); // 移除键 1
console.log(lru.get(1)); // 返回 -1 (未命中)
console.log(lru.get(3)); // 返回 3
console.log(lru.get(4)); // 返回 4
```
