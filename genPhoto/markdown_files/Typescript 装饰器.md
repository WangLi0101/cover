## 装饰器
在 TypeScript 中，装饰器是一种特殊的声明，它可以附加到类、方法、访问器、属性或参数上，以修改其行为。装饰器的主要用途包括记录日志、验证参数、依赖注入等。
### 启用装饰器
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```
### 装饰器的基本用法
装饰器是一个函数，可以接受一个或多个参数，通常会影响其所装饰的对象的行为。
#### 类装饰器
1. 执行时机，在类定义后执行
2. 函数接受一个参数，类本身
3. 返回值：返回一个新类 或者 返回void
4. 多个类装饰器执行顺序从下到上

```ts
/**
 * 给类添加新的属性
 */
function addTimeStamp<T extends { new (...args: any[]): {} }>(target: T) {
  return class extends target {
    timeStamp = new Date();
  };
}

interface Document {
  timeStamp: Date;
}
@addTimeStamp
class Document {
  public title: string;
  constructor(title: string) {}
}

const document = new Document("zage");
console.log(document.timeStamp);

```
#### 方法装饰器
1. 函数接收三个参数
  - 如果是静态方法，则为类的本身，如果是实例方法，则为类的原型
  - 固定一个字符串，表示方法名
  - 描述符对象

```ts
/**
 * 权限判断
 */
function Auth(role: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 获取原本的方法
    const originalMethod = descriptor.value;
    // 重写这个方法
    descriptor.value = function (...args: any[]) {
      if (role === "admin") {
        originalMethod.apply(this, args);
      } else {
        throw new Error("暂无权限");
      }
    };
  };
}
class User {
  role: string;
  constructor(role: string) {
    this.role = role;
  }
  @Auth("admin")
  delUser(id: string) {
    console.log("delete", id);
  }
}
const user = new User("common");
user.delUser("1");

```

#### 属性装饰器
1. 函数接收两个参数
  -  如果是静态属性，则为类本身；如果是实例属性则为原型
  - 固定为一个字符串，表示属性名

```ts
// 装饰器工厂，可以接受参数
function LogProperty(target: Object, propertyKey: string | symbol) {
    console.log(`Property Decorator called for: ${String(propertyKey)}`);

    // 可以在这里添加元数据或进行其他操作
    // 例如，使用 Reflect API 添加元数据
    Reflect.defineMetadata("log", true, target, propertyKey);
}

import "reflect-metadata";

class Person {
    @LogProperty
    name: string;

    @LogProperty
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

const person = new Person("张三", 30);

// 检查元数据
const hasLogName = Reflect.getMetadata("log", person, "name");
const hasLogAge = Reflect.getMetadata("log", person, "age");

console.log(`name has log metadata: ${hasLogName}`); // 输出: true
console.log(`age has log metadata: ${hasLogAge}`);   // 输出: true

```
#### 参数装饰器
参数装饰器用于方法的参数上，可以用来注解、记录或者修改方法参数的信息。参数装饰器在编译阶段被调用，允许开发者在运行时访问参数的元数据。多个参数装饰器执行顺序从左到右
```ts
function ParameterDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number): void;
```
- target: 目标对象，即类的原型对象
- propertyKey: 方法的名称。
- parameterIndex: 参数在函数参数列表中的索引（从0开始）。

### 装饰器的执行顺序
- 类装饰器
- 属性装饰器
- 方法装饰器
- 参数装饰器