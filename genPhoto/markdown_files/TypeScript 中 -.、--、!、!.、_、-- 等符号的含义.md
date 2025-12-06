## 1. 可选链操作符（`?.`）

### **含义**

可选链操作符（`?.`）允许在访问对象属性或调用方法时，如果前面的表达式为 `null` 或 `undefined`，则短路返回 `undefined`，而不会抛出错误。

### **用途**

- 避免繁琐的空值检查。
- 提高代码的简洁性和可读性。

### **语法**

```typescript
object?.property;
object?.[expression];
object?.method?.();
```

### **示例**

```typescript
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

const user: User = {
  name: "Alice",
  // address 未定义
};

// 传统方式
const street = user.address ? user.address.street : undefined;

// 使用可选链
const streetOptional = user.address?.street;

console.log(streetOptional); // 输出: undefined
```

### **注意事项**

- 可选链操作符仅检查前面的表达式是否为 `null` 或 `undefined`。
- 它不会检查其他“假值”如 `false`、`0` 或空字符串。

---

## 2. 空值合并操作符（`??`）

### **含义**

空值合并操作符（`??`）返回其左侧的操作数，除非左侧的操作数是 `null` 或 `undefined`，此时返回右侧的操作数。

### **用途**

- 为变量提供默认值，仅在变量为 `null` 或 `undefined` 时使用默认值。
- 区分 `null`/`undefined` 与其他“假值”如 `0`、`false`、`''` 等。

### **语法**

```typescript
leftOperand ?? rightOperand;
```

### **示例**

```typescript
let foo: number | null | undefined = null;

// 使用 || 操作符
let result1 = foo || 42; // 输出: 42（因为 foo 是 null）

// 使用 ?? 操作符
let result2 = foo ?? 42; // 输出: 42

foo = 0;

// 使用 || 操作符
let result3 = foo || 42; // 输出: 42（因为 foo 是 0，即假值）

// 使用 ?? 操作符
let result4 = foo ?? 42; // 输出: 0（因为 foo 不是 null 或 undefined）
```

### **区别于逻辑或（`||`）**

- `||` 会在左侧操作数为任何“假值”时返回右侧操作数。
- `??` 只在左侧操作数为 `null` 或 `undefined` 时返回右侧操作数。

---

## 3. 非空断言操作符（`!`）

### **含义**

非空断言操作符（`!`）用于告诉 TypeScript 编译器某个值**绝对不会**是 `null` 或 `undefined`，从而绕过类型检查。

### **用途**

- 当开发者确定某个值在特定上下文中不会是 `null` 或 `undefined` 时使用。
- 提高类型的灵活性，但需谨慎使用，以避免运行时错误。

### **语法**

```typescript
variable!;
```

### **示例**

```typescript
function greet(name?: string) {
  // 传统方式
  if (name !== undefined && name !== null) {
    console.log(`Hello, ${name}!`);
  }

  // 使用非空断言
  console.log(`Hello, ${name!.toUpperCase()}!`);
}

greet("Alice"); // 输出: Hello, ALICE!
greet(); // 运行时会抛出错误: Cannot read property 'toUpperCase' of undefined
```

### **注意事项**

- 使用 `!` 需要确保值确实不为 `null` 或 `undefined`，否则可能导致运行时错误。
- 不建议滥用，应该优先通过类型保护（如条件检查）来处理 `null` 或 `undefined`。

---

## 4. 感叹号点操作符（`!.`）

### **含义**

在 TypeScript 和 JavaScript 中，并没有一个单独的 `!.` 操作符。这通常是 `!` 和 `.` 两个操作符的组合，出现在代码中用于非空断言后紧接着访问属性或方法。

### **用途**

- 通过非空断言后访问对象的属性或方法。

### **示例**

```typescript
interface Person {
  name?: string;
}

const person: Person = {};

// 使用非空断言和属性访问
console.log(person.name!.toUpperCase()); // 运行时会抛出错误: Cannot read property 'toUpperCase' of undefined
```

### **注意事项**

- `!.` 并非单独的操作符，而是 `!` 和 `.` 的组合。
- 需要确保在使用 `!.` 时，前面的值确实不为 `null` 或 `undefined`。

---

## 5. 下划线（`_`）

### **含义**

下划线（`_`）在 TypeScript 和 JavaScript 中并不是一个特殊的操作符，而是一种命名约定或占位符。它常用于以下几种情况：

### **用途**

1. **变量命名**：用于表示某些变量或参数不被使用，或作为临时变量。
2. **私有属性**：在一些编码约定中，前缀下划线表示属性或方法是私有的。
3. **库和框架**：一些库（如 Lodash）使用 `_` 作为全局对象名。

### **示例**

```typescript
// 1. 不使用的参数
function handleEvent(event: Event, _unusedParam: any) {
  console.log(event.type);
}

// 2. 私有属性约定
class Example {
  private _value: number;

  constructor(value: number) {
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

// 3. 使用 Lodash 库
import _ from "lodash";

const array = [1, 2, 3];
const doubled = _.map(array, (num) => num * 2);
console.log(doubled); // 输出: [2, 4, 6]
```

### **注意事项**

- 下划线本身没有特殊含义，更多是编码约定或库的使用习惯。
- 在某些情况下，TypeScript 的 ESLint 或 TSLint 规则可能对下划线的使用有特定要求。

---

## 6. 幂运算符（`**`）

### **含义**

幂运算符（`**`）用于执行指数运算，返回左操作数的右操作数次幂。

### **用途**

- 进行数学计算，尤其是需要幂运算的场景。

### **语法**

```typescript
base ** exponent;
```

### **示例**

```typescript
const base = 2;
const exponent = 3;
const result = base ** exponent;

console.log(result); // 输出: 8
```

### **等同于 Math.pow**

```typescript
const result = Math.pow(2, 3);
console.log(result); // 输出: 8
```

### **注意事项**

- 结合赋值操作符使用时，如 `**=`

```typescript
let num = 2;
num **= 3; // 相当于 num = num ** 3;
console.log(num); // 输出: 8
```
