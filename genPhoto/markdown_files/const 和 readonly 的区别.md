<!--
 * @Author: Libra
 * @Date: 2024-08-13 09:47:58
 * @LastEditors: Libra
 * @Description:
-->

在 TypeScript 中，`const` 和 `readonly` 都用于实现不变性（immutability），但它们的应用场景和具体作用有所不同。以下是它们之间的主要区别和使用方法：

## 1. `const`

### 作用

- **变量声明**：`const` 用于声明常量变量，确保变量的引用地址不变。
- **适用范围**：适用于所有 JavaScript 环境，因为 `const` 是 ES6 引入的标准关键字。

### 特点

- **引用不可变**：声明为 `const` 的变量在初始化后，不能被重新赋值。
- **内容可变**：如果 `const` 变量引用的是对象或数组，其内部属性或元素仍然可以被修改。

### 示例

```typescript
const PI = 3.14159;
// PI = 3.14; // 错误: 不能重新赋值

const person = { name: "Alice", age: 30 };
person.age = 31; // 合法，属性可以被修改
// person = { name: "Bob", age: 25 }; // 错误: 不能重新赋值
```

在上面的例子中，`PI` 是一个基本类型的常量，不能被重新赋值。而 `person` 是一个对象，虽然其引用不可变，但对象内部的属性 `age` 可以被修改。

## 2. `readonly`

### 作用

- **属性声明**：`readonly` 用于类的属性或接口的属性，确保属性在初始化后不可被修改。
- **适用范围**：仅在 TypeScript 中使用，是类型系统的一部分。

### 特点

- **属性不可变**：被声明为 `readonly` 的属性在对象创建后不能被修改。
- **初始化时赋值**：`readonly` 属性必须在声明时或构造函数中初始化。

### 示例

```typescript
class Person {
  readonly name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  updateAge(newAge: number) {
    this.age = newAge; // 合法
    // this.name = "Bob"; // 错误: readonly 属性不能被修改
  }
}

interface Config {
  readonly url: string;
  method: string;
}

const config: Config = { url: "https://api.example.com", method: "GET" };
// config.url = "https://api.newexample.com"; // 错误: readonly 属性不能被修改
config.method = "POST"; // 合法
```

在上述例子中，`name` 属性被声明为 `readonly`，因此一旦初始化后，不能再被修改。而 `age` 属性则可以自由修改。

## 3. 主要区别总结

| 特性         | `const`                                        | `readonly`                                        |
| ------------ | ---------------------------------------------- | ------------------------------------------------- |
| **用途**     | 声明变量，确保变量引用不可变                   | 声明类或接口的属性，确保属性值不可变              |
| **适用范围** | 全局变量、函数内变量、块级作用域变量等         | 类的属性、接口的属性                              |
| **语言层面** | ES6 标准，JavaScript 原生支持                  | TypeScript 特有的类型系统特性                     |
| **不变性**   | 变量绑定不可变，引用类型的内部属性可变         | 属性值不可变，必须在初始化时赋值                  |
| **结合使用** | 可以与 `readonly` 一起使用，实现更严格的不变性 | 常与 `const` 一起使用，确保对象引用和属性都不可变 |
