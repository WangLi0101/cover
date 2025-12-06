## 1. `any`

### 概述

- **定义**：`any` 类型表示任意类型，允许赋值为任何类型的值。
- **用途**：用于跳过类型检查，尤其在逐步迁移现有 JavaScript 代码到 TypeScript 时非常有用。

### 特点

- **类型检查**：使用 `any` 时，TypeScript 不会对其进行类型检查，允许对其执行任何操作。
- **不安全**：过度使用 `any` 会失去 TypeScript 的类型安全优势，可能导致运行时错误。

### 示例

```typescript
let value: any = 10;
value = "Hello";
value = { key: "value" };

// 可以调用任何方法
value.foo();
value.bar = 123;
```

### 使用建议

- **谨慎使用**：尽量避免使用 `any`，除非确实无法确定变量的类型。
- **替代方案**：考虑使用 `unknown` 或更具体的类型来保持类型安全。

## 2. `unknown`

### 概述

- **定义**：`unknown` 类型表示未知类型，是 `any` 的类型安全版本。
- **用途**：用于需要表示任意类型但同时保持类型安全的场景。

### 特点

- **类型检查**：`unknown` 类型的值在被使用前必须进行类型检查或类型断言。
- **类型安全**：相比 `any`，`unknown` 提供了更好的类型安全性，防止意外的运行时错误。

### 示例

```typescript
let value: unknown = 10;
value = "Hello";
value = { key: "value" };

// 需要进行类型检查
if (typeof value === "string") {
  console.log(value.toUpperCase()); // 合法
}

// 类型断言
let str: string = value as string;
```

### 使用建议

- **优先选择 `unknown`**：当需要表示一个可能是任何类型的值时，优先选择 `unknown` 而不是 `any`，以保持类型安全。
- **结合类型检查**：使用 `unknown` 时，结合类型检查和类型守卫来安全地操作值。

## 3. `never`

### 概述

- **定义**：`never` 类型表示那些永不存在的值的类型，如总是抛出异常或无限循环的函数。
- **用途**：用于表示函数**不会正常返回**，以及类型推断中的不可能状态。

### 特点

- **不可赋值**：`never` 类型的变量无法赋值任何值，因为它表示不存在的值。
- **类型收窄**：常用于类型收窄的终结点，确保所有可能的类型分支都被处理。

### 示例

```typescript
// 函数永不返回
function throwError(message: string): never {
  throw new Error(message);
}

// 无限循环函数
function infiniteLoop(): never {
  while (true) {}
}

// 使用 never 进行类型收窄
type Shape = Circle | Square;

function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else if (shape.kind === "square") {
    return shape.side * shape.side;
  } else {
    // shape 的类型为 never，确保所有情况都已被处理
    const _exhaustiveCheck: never = shape;
    return _exhaustiveCheck;
  }
}
```

### 使用建议

- **类型保护**：在复杂的类型收窄逻辑中使用 `never` 来确保所有可能的类型分支都已被处理。
- **错误处理**：使用 `never` 类型的函数来表示永不返回的逻辑，如错误抛出或无限循环。

## 4. `null` & `undefined`

### 概述

- **定义**：

  - `null`：表示空值，通常用于指示变量应有对象但当前为空。
  - `undefined`：表示未定义，通常用于指示变量尚未被赋值。

- **用途**：表示缺失的值或未初始化的变量。

### 特点

- **严格模式下的行为**：
  - 当启用 `--strictNullChecks` 编译选项时，`null` 和 `undefined` 是独立的类型，不可赋值给其他类型，除非显式包含在联合类型中。
  - 在非严格模式下，`null` 和 `undefined` 可以赋值给任何类型。

### 示例

```typescript
let u: undefined = undefined;
let n: null = null;

// 在启用 strictNullChecks 时
let x: number;
// x = null; // 错误
// x = undefined; // 错误

// 使用联合类型
let y: number | null | undefined;
y = 10;
y = null;
y = undefined;
```

### 使用建议

- **启用严格空值检查**：建议启用 `--strictNullChecks` 以提高代码的类型安全性。
- **明确处理空值**：在需要时，通过联合类型显式处理 `null` 和 `undefined`，确保代码正确处理缺失的值。

## 5. `void`

### 概述

- **定义**：`void` 类型表示没有任何类型，通常用于函数没有返回值。
- **用途**：用于标注函数不返回值，或明确表示某些操作不需要返回任何内容。

### 特点

- **函数返回类型**：常用作函数的返回类型，表示函数不返回任何值。
- **限制赋值**：只能赋值为 `undefined` 或 `null`（在非严格模式下），但通常不用于变量声明。

### 示例

```typescript
// 函数返回 void
function logMessage(message: string): void {
  console.log(message);
}

let v: void = undefined;
// v = null; // 在 strictNullChecks 下错误
```

### 使用建议

- **函数返回类型**：当函数不需要返回值时，使用 `void` 作为返回类型。
- **避免变量使用**：通常不需要声明类型为 `void` 的变量，除非特殊需求。
