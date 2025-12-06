### 1. `Set`

`Set` 是一种类似于数组的集合，它**存储一组唯一的值**，也就是说，它不会包含重复的元素。

#### 特性：

- **唯一性**：`Set` 中的元素是唯一的，不会出现重复值。
- **顺序性**：`Set` 会按照插入的顺序迭代元素。
- **值类型**：`Set` 可以存储任何类型的值：原始类型（如字符串、数字）、对象、函数等。

#### 基本用法：

```javascript
let mySet = new Set();

mySet.add(1);
mySet.add(2);
mySet.add(2);  // 重复的值不会被添加

console.log(mySet);  // 输出：Set(2) {1, 2}

console.log(mySet.has(1));  // 输出：true
console.log(mySet.size);    // 输出：2

console.log(mySet.values()); // 输出 [Set Iterator] { 1, 2 }
console.log(mySet.keys());   // 输出 [Set Iterator] { 1, 2 }
console.log(mySet.entries()); // 输出 [Set Entries] { [1, 1], [2, 2] }

mySet.delete(1);            // 删除元素
console.log(mySet);         // 输出：Set(1) {2}

mySet.clear();              // 清空 Set
console.log(mySet);         // 输出：Set(0) {}
```

#### 迭代：

`Set` 可以通过 `for...of` 或者 `forEach` 进行迭代。

```javascript
mySet.add(1).add(2).add(3);

for (let value of mySet) {
  console.log(value);   // 1, 2, 3
}

mySet.forEach(value => console.log(value));  // 1, 2, 3
```

#### 场景：

- 去重：`Set` 可以用于数组去重。
- 存储唯一值：`Set` 可以用于存储唯一值，例如用户 ID、IP 地址等。
- 数据结构：`Set` 可以用于实现集合、多重集等数据结构。

------

### 2. `WeakSet`

`WeakSet` 是 `Set` 的一种变体，但与 `Set` 不同的是，它只能**存储对象引用**，并且这些对象是弱引用，即如果没有其他引用指向这些对象，它们可以被垃圾回收（GC）。

#### 特性：

- **只能存储对象**：不能存储原始类型（如字符串、数字等），只能存储对象。
- **弱引用**：`WeakSet` 中的对象不会阻止垃圾回收，因此，如果对象没有其他引用，则它们会被回收。
- **不可迭代**：`WeakSet` 不能被迭代，也没有 `size` 属性。

#### 基本用法：

```javascript
let obj1 = { name: "Alice" };
let obj2 = { name: "Bob" };

let weakSet = new WeakSet();
weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1));  // 输出：true
weakSet.delete(obj1);            // 删除 obj1
console.log(weakSet.has(obj1));  // 输出：false
```

#### 场景：

- `WeakSet` 常用于需要临时存储对象的场景，并且不希望这些对象阻止垃圾回收，例如 DOM 元素监听器。
- `WeakSet` 跟踪已处理的 DOM 元素，特别是在动态页面中，不需要长期保存 DOM 的引用。
- `WeakSet` 存储对象的私有状态或标记，例如标记访问过的用户，或者对象是否已经经过某个处理。
- `WeakSet` 对象缓存，用于防止对同一对象的重复处理，同时不会阻止对象的垃圾回收。


------

### 3. `Map`

`Map` 是一种键值对集合，它允许**任何类型的值**作为键（包括对象、函数等），并且**维护插入顺序**。

#### 特性：

- **键的类型不限**：可以使用任何类型的值作为键（与普通对象只能使用字符串/符号作为键不同）。
- **键值对存储**：每个键对应一个值，可以快速根据键查找值。
- **按插入顺序遍历**：`Map` 会按照插入的顺序进行迭代。

#### 基本用法：

```javascript
let myMap = new Map();

myMap.set('name', 'Alice');
myMap.set(42, 'Answer to the Ultimate Question');
myMap.set({ key: 'object' }, 'Object Key');

console.log(myMap.get('name'));  // 输出：Alice
console.log(myMap.has(42));      // 输出：true
console.log(myMap.size);         // 输出：3

console.log(myMap.keys());  // 输出：[Map Iterator] { 'name', 42, { key: 'object' } }
console.log(myMap.values());  // 输出：[Map Iterator] { 'Alice', 'Answer to the Ultimate Question', 'Object Key' }
console.log(myMap.entries());  // 输出：[Map Entries] { [ 'name', 'Alice' ], [ 42, 'Answer to the Ultimate Question' ], [ { key: 'object' }, 'Object Key' ] }

myMap.delete(42);                // 删除键为 42 的条目
console.log(myMap.size);         // 输出：2
```

#### 迭代：

`Map` 可以使用 `for...of` 和 `forEach` 进行迭代，它支持 `keys()`、`values()` 和 `entries()` 方法来分别迭代键、值和键值对。

```javascript
for (let [key, value] of myMap) {
  console.log(`${key}: ${value}`);
}
// 输出：
// 'name': 'Alice'
// { key: 'object' }: 'Object Key'
```

------

### 4. `WeakMap`

`WeakMap` 是 `Map` 的一种变体，它与 `Map` 的区别在于键必须是**对象**，且这些键是**弱引用**，因此键不会阻止垃圾回收。

#### 特性：

- **只能使用对象作为键**：`WeakMap` 的键只能是对象，不能是原始类型。
- **弱引用键**：`WeakMap` 的键是弱引用，意味着如果对象没有其他引用，它会被垃圾回收。
- **不可迭代**：`WeakMap` 无法被迭代，也没有 `size` 属性。

#### 基本用法：

```javascript
let weakMap = new WeakMap();

let obj1 = { name: "Alice" };
let obj2 = { name: "Bob" };

weakMap.set(obj1, 'Employee');
weakMap.set(obj2, 'Manager');

console.log(weakMap.get(obj1));   // 输出：Employee
console.log(weakMap.has(obj2));   // 输出：true

weakMap.delete(obj1);             // 删除键 obj1
console.log(weakMap.has(obj1));   // 输出：false
```

#### 场景：

`WeakMap` 常用于存储与对象相关的私有数据。例如，某些框架使用 `WeakMap` 来存储对象的私有状态，而不担心这些状态会影响对象的生命周期。

------

### 总结

| 特性           | `Set`              | `WeakSet`                | `Map`                            | `WeakMap`                                  |
| -------------- | ------------------ | ------------------------ | -------------------------------- | ------------------------------------------ |
| **存储类型**   | 任意类型（值集合） | 只能存储对象引用         | 任意类型的键值对                 | 键只能是对象，值可以是任意类型             |
| **键类型**     | N/A                | N/A                      | 任意类型（原始类型和对象）       | 只能是对象                                 |
| **是否弱引用** | 否                 | 是                       | 否                               | 是                                         |
| **是否可迭代** | 是                 | 否                       | 是                               | 否                                         |
| **重复性**     | 不允许重复值       | 不允许重复对象           | 不允许重复键                     | 不允许重复对象键                           |
| **用例场景**   | 存储唯一值，去重   | 存储可能被垃圾回收的对象 | 键值对存储，可以使用任意类型的键 | 临时关联对象的数据，不会影响对象的垃圾回收 |