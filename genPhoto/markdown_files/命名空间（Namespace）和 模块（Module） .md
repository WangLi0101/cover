## 命名空间（Namespace）

### 什么是命名空间

**命名空间（Namespace）**是 TypeScript 提供的一种组织代码的方式，用于将相关的变量、函数、类、接口等封装在一个逻辑单元中。命名空间通过内部模块化的方式，避免全局命名空间的污染，防止命名冲突。

### 命名空间的使用场景

- **大型项目**：在大型项目中，命名空间有助于将代码逻辑分组，便于管理和维护。
- **全局作用域**：当不使用模块化系统（如 ES6 模块）时，命名空间是组织代码的有效方式。

### 如何创建和使用命名空间

#### 示例 1：基本命名空间

```typescript
namespace Utility {
    export function greet(name: string): string {
        return `Hello, ${name}!`;
    }

    export const PI = 3.14159;
}

let message = Utility.greet("Alice");
console.log(message); // 输出: Hello, Alice!

console.log(Utility.PI); // 输出: 3.14159
```

#### 示例 2：命名空间的嵌套

```typescript
namespace Shapes {
    export namespace TwoD {
        export class Circle {
            constructor(public radius: number) {}
            area(): number {
                return Math.PI * this.radius ** 2;
            }
        }
    }

    export namespace ThreeD {
        export class Sphere {
            constructor(public radius: number) {}
            volume(): number {
                return (4 / 3) * Math.PI * this.radius ** 3;
            }
        }
    }
}

let circle = new Shapes.TwoD.Circle(5);
console.log(circle.area()); // 输出: 78.53975

let sphere = new Shapes.ThreeD.Sphere(5);
console.log(sphere.volume()); // 输出: 523.5983333333333
```

### 命名空间的合并

TypeScript 允许同名的命名空间在多个声明中合并，这对于将代码拆分到多个文件中特别有用。

#### 示例 3：命名空间合并

**File1.ts**

```typescript
namespace Animals {
    export class Dog {
        bark() {
            console.log("Woof!");
        }
    }
}
```

**File2.ts**

```typescript
namespace Animals {
    export class Cat {
        meow() {
            console.log("Meow!");
        }
    }
}

let dog = new Animals.Dog();
dog.bark(); // 输出: Woof!

let cat = new Animals.Cat();
cat.meow(); // 输出: Meow!
```

### 命名空间的最佳实践

- **使用模块化替代命名空间**：在现代 TypeScript 项目中，推荐使用 ES6 模块（`import` 和 `export`）来组织代码，而不是命名空间。命名空间主要适用于不使用模块系统的项目。
- **避免全局污染**：即使使用命名空间，也应尽量避免将过多内容暴露到全局作用域。

## 模块（Module）

### 什么是模块

**模块（Module）**是 TypeScript 和 ES6 中用于组织代码的核心机制。模块通过 `import` 和 `export` 语法，将代码分割成独立的、可复用的单元。每个模块都有自己的作用域，默认情况下，模块内的变量、函数、类等不会污染全局作用域。

### 模块的使用场景

- **代码复用**：模块化使得代码更易于复用和共享。
- **依赖管理**：模块化系统有助于管理代码之间的依赖关系。
- **现代开发**：在现代前端和后端开发中，模块是标准的代码组织方式。

### 如何创建和使用模块

#### 示例 1：导出和导入模块

**math.ts**

```typescript
export function add(a: number, b: number): number {
    return a + b;
}

export const PI = 3.14159;
```

**app.ts**

```typescript
import { add, PI } from './math';

console.log(add(2, 3)); // 输出: 5
console.log(PI);        // 输出: 3.14159
```

#### 示例 2：默认导出

每个模块可以有一个默认导出，使用 `export default` 语法。

**logger.ts**

```typescript
export default class Logger {
    log(message: string) {
        console.log(`[LOG]: ${message}`);
    }
}
```

**app.ts**

```typescript
import Logger from './logger';

const logger = new Logger();
logger.log("This is a log message."); // 输出: [LOG]: This is a log message.
```

### 模块解析策略

TypeScript 支持多种模块解析策略，最常用的是 **ES6 模块** 和 **CommonJS 模块**。开发者可以根据项目需求，通过 `tsconfig.json` 文件中的 `module` 选项来配置。

```typescript
{
  "compilerOptions": {
    "module": "es6", // 或 "commonjs", "amd", "umd", "system" 等
    // 其他配置项...
  }
}
```

### 动态导入

TypeScript 支持动态导入，允许在运行时按需加载模块。

```typescript
async function loadModule() {
    const module = await import('./math');
    console.log(module.add(5, 7)); // 输出: 12
}

loadModule();
```