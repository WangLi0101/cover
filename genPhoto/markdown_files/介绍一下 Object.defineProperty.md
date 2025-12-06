<!--
 * @Author: Libra
 * @Date: 2024-08-13 09:47:58
 * @LastEditors: Libra
 * @Description:
-->

`Object.defineProperty` 是一个内置方法，用于在对象上定义新属性或修改现有属性的属性描述符。

语法：

```javascript
Object.defineProperty(obj, prop, descriptor);
```

参数解释：

- obj：要定义属性的对象。
- prop：要定义或修改的属性的名称。
- descriptor：属性描述符对象，在其中定义属性的特性，包括 value（属性的值）、writable（属性是否可写）、enumerable（属性是否可枚举）、configurable（属性是否可配置）、getter（获取属性值时的行为）、setter（设置属性值时的行为）等属性。

当使用`Object.defineProperty`时，我们可以通过`descriptor`参数来定义或修改属性的属性描述符，包括以下六个属性：

1. `value`
2. `writable`
3. `enumerable`
4. `configurable`
5. `getter`
6. `setter`

以下是这六个属性的举例说明：

### 1. value

```javascript
let obj = {};

Object.defineProperty(obj, "name", {
  value: "Alice", // 设置属性值为 'Alice'
});

console.log(obj.name); // 输出 'Alice'
```

### 2. writable

```javascript
let obj = {};

Object.defineProperty(obj, "age", {
  value: 30,
  writable: false, // 属性不可写
});

obj.age = 35; // 尝试修改属性值，不会生效

console.log(obj.age); // 输出 30
```

### 3. enumerable

> 不可枚举（enumerable: false）： 当一个属性被设置为不可枚举时，意味着该属性不会出现在对象的枚举属性中，例如 for...in 循环、Object.keys()等。换句话说，不可枚举的属性不会被迭代器遍历。这可以用来隐藏一些内部属性，防止被外部访问到。

```javascript
let obj = {};

Object.defineProperty(obj, "gender", {
  value: "female",
  enumerable: false, // 属性不可枚举
});

for (let key in obj) {
  console.log(key); // 不会打印 'gender'
}
```

### 4. configurable

> 不可配置（configurable: false）： 当一个属性被设置为不可配置时，意味着该属性的描述符不可被修改，也不可被删除。一旦属性被定义为不可配置，就无法再将其改为可配置，而且无法删除该属性。非常重要的一点是，不可配置属性的 writable 属性也无法改变。

```javascript
let obj = {};

Object.defineProperty(obj, "city", {
  value: "New York",
  configurable: false, // 属性不可配置
});

// 尝试删除属性
delete obj.city; // 将会抛出错误(在严格模式下)

// 更新属性值
Object.defineProperty(obj, "city", {
  value: "Los Angeles", // 尝试修改属性值，将会抛出错误
});
```

### 5. getter

- `get` 方法用于获取属性值时的行为。

```javascript
let obj = {
  _name: "Alice", // 前面加下划线表示私有属性
  get name() {
    return this._name.toUpperCase();
  },
};

console.log(obj.name); // 输出 'ALICE'
```

### 6. setter

- `set` 方法用于设置属性值时的行为。

```javascript
let obj = {
  _age: 0,
  set age(newAge) {
    if (newAge >= 0) {
      this._age = newAge;
    } else {
      console.error("Age cannot be negative");
    }
  },
};

obj.age = 30;
console.log(obj.age); // undefined, 没有getter方法

obj.age = -5; // 设置负数会报错 'Age cannot be negative'
console.log(obj.age); // 仍然输出 undefined, 没有setter方法
```

### 注意

当我们试图同时定义访问器（getter 和/或 setter）和数据描述符（value 或 writable）时，就会报错，这两种描述符是互斥的，不能在同一个属性定义中同时使用。

```javascript
"use strict";
let obj = {
  name: "Alice",
  age: 20,
};

let city = "New York";

// 这个会报错，因为同时定义了 value 和 getter/setter
Object.defineProperty(obj, "city", {
  value: "Shanghai",
  get() {
    return city;
  },
  set(newCity) {
    city = newCity;
  },
});

obj.city = "Beijing";
console.log(obj.city); // Beijing
```

### 拓展

```javascript
"use strict";
let obj = {
  name: "Alice",
  age: 20,
};

Object.defineProperty(obj, "city", {
  value: "New York",
});

console.log(Object.getOwnPropertyDescriptor(obj, "city"));
/**
 * {
    value: 'New York',
    writable: false,
    enumerable: false,
    configurable: false
  }
 */
// 获取所有属性名（包括不可枚举的属性）
console.log(Object.getOwnPropertyNames(obj)); // [ 'name', 'age', 'city' ]
// 获取所有可枚举的属性名
console.log(Object.keys(obj)); // [ 'name', 'age' ]
```