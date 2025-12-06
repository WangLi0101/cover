# TypeScript 中的 infer 关键字详解

`infer` 是 TypeScript 中的一个强大的类型推断关键字，主要用于条件类型中进行类型推导。它让我们能够从已有的类型中提取出类型信息，增强了类型系统的灵活性和表达能力。

## 基本概念

`infer` 关键字只能在条件类型的 `extends` 子句中使用。它可以声明一个类型变量，并且这个类型变量可以在条件类型的 true 分支中被引用。

## 常见使用场景

### 1. 提取函数返回类型

```typescript
// 检查 T 是否是一个函数，如果是，则返回其返回值类型 R，否则返回 any
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 示例
function foo(): number {
  return 42;
}

type FooReturn = ReturnType<typeof foo>; // type FooReturn = number
```

### 2. 提取函数参数类型

```typescript
// 检查 T 是否是一个函数，如果是，则返回其参数类型 P，否则返回 T
type ParamType<T> = T extends (param: infer P) => any ? P : T;

// 示例
function bar(x: string): void {
  console.log(x);
}

type BarParam = ParamType<typeof bar>; // type BarParam = string
```

### 3. 提取数组元素类型

```typescript
// 检查 T 是否是一个数组，如果是，则返回其元素类型 U，否则返回 never
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

// 示例
type StringArray = string[];
type ElementType = ArrayElementType<StringArray>; // type ElementType = string
```

### 4. 提取 Promise 类型

```typescript
// 检查 T 是否是一个 Promise，如果是，则返回其内部类型 U，否则返回 T
type PromiseType<T> = T extends Promise<infer U> ? U : T;

// 示例
type PromiseString = Promise<string>;
type UnwrappedType = PromiseType<PromiseString>; // type UnwrappedType = string
```

## 高级用法

### 1. 多重推断

```typescript
type Unpacked<T> = T extends Promise<infer U>
  ? U
  : T extends Array<infer U>
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T;
```

### 2. 递归类型推断

```typescript
type DeepUnwrapPromise<T> = T extends Promise<infer U>
  ? DeepUnwrapPromise<U>
  : T;

// 示例
type Deep = Promise<Promise<Promise<string>>>;
type Unwrapped = DeepUnwrapPromise<Deep>; // type Unwrapped = string
```

## 使用注意事项

1. `infer` 只能在条件类型的 `extends` 子句中使用
2. 推断的类型变量只能在条件类型的 true 分支中使用
3. 可以在同一个条件类型中使用多个 `infer` 声明

## 实际应用示例

```typescript
// 提取构造函数的实例类型
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : any;

// 提取函数的参数类型元组
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// 提取对象的属性类型
type PropertyType<T> = T extends { prop: infer P } ? P : never;
```
