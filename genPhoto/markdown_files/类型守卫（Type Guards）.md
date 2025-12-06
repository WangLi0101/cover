在 TypeScript 中，**类型守卫（Type Guards）** 是一种用于在运行时检查变量类型的方法。类型守卫允许开发者根据特定的条件动态地缩小变量的类型范围，从而在不同的类型分支中安全地访问属性和方法。通过类型守卫，TypeScript 能够更准确地推断变量的类型，增强代码的类型安全性和可维护性。

## 什么是类型守卫（Type Guards）

**类型守卫** 是 TypeScript 提供的一种机制，用于在运行时检查变量的类型，并根据检查结果缩小变量的类型范围。这使得开发者能够在不同的类型分支中执行特定的操作，而无需担心类型错误。

### 类型守卫的作用

- **类型缩小**：根据运行时的类型检查，缩小变量的类型范围，使得在特定代码块中可以安全地访问特定类型的属性和方法。
- **增强类型安全**：通过明确的类型检查，避免在操作变量时发生类型错误，提高代码的可靠性。
- **提升代码可读性和可维护性**：清晰的类型分支使得代码逻辑更加明确，便于理解和维护。

## 类型守卫的基本语法

TypeScript 提供了多种实现类型守卫的方法，包括：

1. **`typeof` 操作符**
2. **`instanceof` 操作符**
3. **自定义类型守卫函数**
4. **内置的类型守卫**
5. **可选链和非空断言**

### 1. `typeof` 操作符

`typeof` 操作符用于检查基本类型（`string`、`number`、`boolean` 等）。它返回一个表示操作数类型的字符串。

#### 示例

```typescript
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${typeof padding}'.`);
}

console.log(padLeft("Hello", 4)); // 输出: "    Hello"
console.log(padLeft("Hello", ">> ")); // 输出: ">> Hello"
```

### 2. `instanceof` 操作符

`instanceof` 操作符用于检查一个对象是否是某个类的实例。这在处理复杂类型（如类和接口）时特别有用。

#### 示例

```typescript
class Bird {
    fly() {
        console.log("Bird is flying");
    }
}

class Fish {
    swim() {
        console.log("Fish is swimming");
    }
}

type Pet = Bird | Fish;

function move(pet: Pet) {
    if (pet instanceof Bird) {
        pet.fly();
    } else {
        pet.swim();
    }
}

const bird = new Bird();
const fish = new Fish();

move(bird); // 输出: Bird is flying
move(fish); // 输出: Fish is swimming
```

### 3. 自定义类型守卫函数

自定义类型守卫函数是指返回类型谓词的函数，用于更复杂的类型检查。类型谓词的语法为 `parameterName is Type`，用于告诉 TypeScript 编译器变量的具体类型。

#### 示例

```typescript
interface Cat {
    meow(): void;
}

interface Dog {
    bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
    return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
    if (isCat(animal)) {
        animal.meow();
    } else {
        animal.bark();
    }
}

const cat: Cat = { meow: () => console.log("Meow!") };
const dog: Dog = { bark: () => console.log("Bark!") };

makeSound(cat); // 输出: Meow!
makeSound(dog); // 输出: Bark!
```

在这个例子中，自定义的类型守卫函数 `isCat` 用于判断 `animal` 是否为 `Cat` 类型，从而在 `makeSound` 函数中安全地调用相应的方法。

### 4. 内置的类型守卫

TypeScript 提供了一些内置的类型守卫，如 `in` 操作符和 `null` 检查，用于处理特定的类型情况。

#### 使用 `in` 操作符

`in` 操作符用于检查对象是否具有某个属性。

```typescript
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

type Pet = Bird | Fish;

function getPetAction(pet: Pet) {
    if ("fly" in pet) {
        pet.fly();
    } else {
        pet.swim();
    }
}

const bird: Bird = { fly: () => console.log("Flying"), layEggs: () => {} };
const fish: Fish = { swim: () => console.log("Swimming"), layEggs: () => {} };

getPetAction(bird); // 输出: Flying
getPetAction(fish); // 输出: Swimming
```

#### 检查 `null` 或 `undefined`

TypeScript 允许使用简单的条件语句检查变量是否为 `null` 或 `undefined`。

```typescript
function greet(name?: string) {
    if (name != null) { // 同时检查 null 和 undefined
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, stranger!");
    }
}

greet("Alice"); // 输出: Hello, Alice!
greet();        // 输出: Hello, stranger!
```

### 5. 可选链和非空断言

尽管不直接属于类型守卫，但 **可选链（Optional Chaining）** 和 **非空断言（Non-null Assertion）** 是处理类型不确定性的有力工具。

#### 可选链（Optional Chaining）

可选链允许在访问对象属性时，如果某个属性为 `null` 或 `undefined`，则表达式短路返回 `undefined`，而不会抛出错误。

```typescript
interface User {
    name: string;
    address?: {
        street: string;
        city: string;
    };
}

function getStreet(user: User): string | undefined {
    return user.address?.street;
}

const userWithAddress: User = { name: "Bob", address: { street: "123 Main St", city: "New York" } };
const userWithoutAddress: User = { name: "Charlie" };

console.log(getStreet(userWithAddress)); // 输出: "123 Main St"
console.log(getStreet(userWithoutAddress)); // 输出: undefined
```

#### 非空断言（Non-null Assertion）

非空断言用于告诉编译器某个变量在特定位置不会是 `null` 或 `undefined`，从而跳过类型检查。但需要谨慎使用，以避免运行时错误。

```typescript
function processInput(input?: string) {
    console.log(input!.length); // 告诉编译器 input 不会是 undefined
}

processInput("Hello"); // 输出: 5
processInput();        // 运行时抛出错误: Cannot read property 'length' of undefined
```