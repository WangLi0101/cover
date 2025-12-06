# extends

![封面图](../photo/ts-extends-cover.webp)

在 TypeScript 中，extends 关键字有多种用法，主要用于类的继承、泛型约束以及条件类型。以下是详细说明：

#### 1.类的继承
在面向对象编程中，extends 用于实现类的继承，使一个类可以继承另一个类的属性和方法。
```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} 发出声音。`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);  // 调用父类构造函数
  }
  speak() {
    console.log(`${this.name} 汪汪叫！`);
  }
}

const dog = new Dog('Buddy');
dog.speak(); // 输出: Buddy 汪汪叫！
```
#### 2.泛型约束
在泛型编程中，extends 用于对泛型类型进行约束，指定泛型类型必须满足某种条件或是某种类型的子类型。
```ts
function echo<T extends number | string>(arg: T): T {
  return arg;
}

echo(123);      // 合法
echo('hello');  // 合法
// echo(true);  // 错误，因为 boolean 不满足 number | string 的约束
```
#### 3. 条件类型（Conditional Types）
条件类型使用 extends 来检查类型之间的关系，根据判断结果返回不同的类型。
```ts
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false
```
#### 4. 泛型条件类型的高级应用
条件类型可以与泛型结合实现复杂的类型转换与计算。
```ts
type ElementType<T> = T extends (infer U)[] ? U : T;

type A = ElementType<number[]>;  // A 的类型为 number
type B = ElementType<string>;    // B 的类型为 string
```