### 守卫(Guard)
在 NestJS 中，守卫（Guards）是一种用于处理请求前的逻辑的机制。守卫用于控制路由处理程序的执行，它们的主要功能是决定请求是否应该继续执行，或者在某些条件下阻止请求的处理。
<img src="https://betterme-blog.oss-cn-beijing.aliyuncs.com/common/17341674570861699964021173787.png" alt="image" />
#### 守卫的主要作用
1. 认证（Authentication） 守卫可以用于验证用户的身份。比如，你可以在守卫中检查用户的令牌（token）或会话（session），确保请求来自合法用户。如果认证失败，守卫可以阻止请求的继续处理并返回适当的错误响应。
2. 授权（Authorization） 守卫可以根据用户的角色或权限，控制是否允许用户访问某个特定的路由。例如，你可以检查用户是否拥有访问某个资源的权限，只有具备特定角色或权限的用户才能访问某些路由。
3. 请求过滤和控制 守卫不仅仅用于认证和授权，还可以在请求到达处理程序之前，基于业务需求对请求进行额外的验证和过滤操作。例如，你可以检查请求头、参数、IP 地址等信息，以确保请求满足某些条件。
4. 处理特殊逻辑 有时，守卫可以用于处理一些通用的前置逻辑，比如跨域请求验证、日志记录、限流等。这些都可以在守卫中处理，避免在控制器中直接编写重复代码。
#### 守卫的工作流程
守卫在处理请求时，会在控制器方法之前执行，返回一个布尔值或 Promise<boolean>。如果守卫返回 true，请求会继续执行；如果返回 false，请求会被拦截，并且 NestJS 会阻止请求的进一步处理（通常会返回一个 403 Forbidden 或 401 Unauthorized 的错误响应）。

#### 守卫的类型
1. 全局守卫
```ts
 app.useGlobalGuards(new AuthGuard());
// 或者在AppModule中
  {
      provide: APP_GUARD,
      useClass: AuthGuard,
  }
```
2. 路由守卫
 路由守卫应用于特定的控制器或路由方法上，只有当请求匹配特定的路由时，守卫才会被执行。

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
@Controller('cats')
export class CatsController {
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return 'This action returns all cats';
  }
}
```
#### 实现认证（Authentication）
```ts
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import jwtConstants from 'src/utils/jwtConstants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new HttpException('无权限', HttpStatus.FORBIDDEN);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('token过期', HttpStatus.UNAUTHORIZED); // 处理过期的 token
      }
      throw new HttpException('无权限', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}

```
#### 实现角色授权
```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthRoles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private matchRoles(roles: string[], userRoles: string[]) {
    return roles.some((el) => userRoles.includes(el));
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(AuthRoles, context.getHandler());

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles;
    const isAuth = this.matchRoles(roles, userRoles);
    if (!isAuth) throw new HttpException('无权限', HttpStatus.FORBIDDEN);
    return true;
  }
}

```