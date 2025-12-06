# TypeScript Utility Types 详解

TypeScript 提供了几种实用的工具类型（Utility Types），它们可以帮助我们进行常见的类型转换。下面我们详细介绍一些最常用的工具类型。

## 1. Partial<T>

将类型 T 的所有属性变为可选。

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// 所有属性变为可选
type PartialUser = Partial<User>;

// 等同于：
// {
//     name?: string;
//     age?: number;
//     email?: string;
// }

const updateUser: PartialUser = {
  name: "张三", // 只更新 name 属性也是合法的
};
```

## 2. Required<T>

将类型 T 的所有属性变为必需。

```typescript
interface Config {
  name?: string;
  age?: number;
}

// 所有属性变为必需
type RequiredConfig = Required<Config>;

// 必须提供所有属性
const config: RequiredConfig = {
  name: "配置1",
  age: 100,
};
```

## 3. Readonly<T>

将类型 T 的所有属性设为只读。

```typescript
interface Todo {
  title: string;
  description: string;
}

const todo: Readonly<Todo> = {
  title: "学习 TypeScript",
  description: "学习 Utility Types",
};

// 这将报错
// todo.title = "新标题";  // Error: Cannot assign to 'title' because it is a read-only property
```

## 4. Pick<T, K>

从类型 T 中选择一组属性 K。

```typescript
interface Article {
  title: string;
  content: string;
  author: string;
  comments: string[];
  createdAt: Date;
}

// 只选择 title 和 content 属性
type ArticlePreview = Pick<Article, "title" | "content">;

const preview: ArticlePreview = {
  title: "TypeScript 教程",
  content: "这是一篇关于 TypeScript 的教程",
};
```

## 5. Omit<T, K>

从类型 T 中删除一组属性 K。

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

// 创建新商品时不需要 id
type CreateProduct = Omit<Product, "id">;

const newProduct: CreateProduct = {
  name: "手机",
  price: 999,
  description: "最新款手机",
  category: "电子产品",
};
```

## 6. Record<K, T>

创建一个键类型为 K，值类型为 T 的对象类型。

```typescript
type Fruit = "apple" | "banana" | "orange";
type FruitPrice = Record<Fruit, number>;

const fruitPrices: FruitPrice = {
  apple: 5,
  banana: 3,
  orange: 4,
};
```

## 7. Extract<T, U>

提取 T 中可以赋值给 U 的类型。

```typescript
type Animal = "cat" | "dog" | "bird" | "fish";
type Pet = "dog" | "cat" | "hamster";

// 提取既是 Animal 又是 Pet 的类型
type PetAnimal = Extract<Animal, Pet>; // "cat" | "dog"
```

## 8. Exclude<T, U>

从 T 中剔除可以赋值给 U 的类型。

```typescript
type Status = "success" | "error" | "pending" | "cancelled";
type PositiveStatus = Exclude<Status, "error" | "cancelled">; // "success" | "pending"
```

## 9. NonNullable<T>

从类型 T 中剔除 null 和 undefined。

```typescript
type Response = string | null | undefined;
type ValidResponse = NonNullable<Response>; // string
```
