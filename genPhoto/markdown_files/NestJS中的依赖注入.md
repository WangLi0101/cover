### 依赖注入
依赖注入（Dependency Injection, DI）是面向对象编程中的一种设计模式，它通过将一个对象的依赖关系传递给该对象，而不是由该对象自己创建或管理依赖，来实现松耦合。这样可以让代码更加模块化、易于测试和维护。
在 NestJS 中，依赖注入是应用的核心概念之一。NestJS 使用 DI 来管理服务之间的依赖关系，并且自动解析这些依赖，避免了手动管理对象创建和依赖的繁琐。 下面就手动实现一个依赖注入
#### 1. 创建DI容器
DI 容器用来管理和解析依赖。
```ts
// DIContainer.ts
class DIContainer {
  private services = new Map<string, any>();

  register<T>(token: string, provider: { new (...args: any[]): T }): void {
    this.services.set(token, provider);
  }

// 解析依赖
  resolve<T>(token: string): T {
    const provider = this.services.get(token);
    if (!provider) {
      throw new Error(`Service not found: ${token}`);
    }

    // 获取依赖的参数类型
    const dependencies = Reflect.getMetadata('design:paramtypes', provider) || [];
    
    // 解析依赖并注入到构造函数
    const injections = dependencies.map((dependency: any) => this.resolve(dependency));
    
    // 创建类的实例，并注入依赖
    return new provider(...injections);
  }
}

export const container = new DIContainer();
```
#### 2.创建 @Injectable 和 @Inject 装饰器
```ts
// decorators.ts
import 'reflect-metadata';
import { container } from './DIContainer';

export function Injectable(token: string): ClassDecorator {
  return (target) => {
    container.register(token, target as any);
  };
}

export function Inject(token: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingDependencies =
      Reflect.getMetadata('design:paramtypes', target) || [];
    existingDependencies[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', existingDependencies, target);
  };
}
```
#### 3. 使用装饰器标记服务和依赖
###### Logger 实现
```ts
// Logger.ts
import { Injectable } from './decorators';

@Injectable('Logger')
export class Logger {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }
}

```
###### UserService 实现
```ts
// UserService.ts
import { Injectable, Inject } from './decorators';

@Injectable('UserService')
export class UserService {
  constructor(@Inject('Logger') private logger: Logger) {}

  createUser(username: string): void {
    this.logger.log(`User "${username}" created.`);
  }
}

```
#### 4.主程序自动解析依赖
```ts
// main.ts
import { container } from './DIContainer';
import { UserService } from './UserService';
import './Logger'; // 确保服务被注册

const userService = container.resolve<UserService>('UserService');
userService.createUser('Alice'); // 输出: [Logger] User "Alice" created.

```