> 如果你在对象上添加属性而不希望这些属性与对象上的其他属性（包括继承的属性）发生冲突，可以使用 `Symbol` 作为属性键。

### `call`

```javascript
Function.prototype.myCall = function (ctx, ...args) {
    // 如果 ctx 为 null 或 undefined，则将其设置为全局对象 (浏览器中为 window, Node.js 中为 globalThis)
    ctx = ctx || globalThis;
    // 创建一个唯一的 Symbol 值作为临时函数的键，以防止与 ctx 对象的其他属性冲突
    let fn = Symbol('fn');
    // 将当前函数（this）赋值给 ctx 对象的 fn 属性
    ctx[fn] = this;
    // 使用传递的参数调用函数，并将结果存储在 result 中
    const result = ctx[fn](...args);
    // 调用后删除 ctx 对象上的临时属性 fn，以免污染原始对象
    delete ctx[fn];
    // 返回调用函数的结果
    return result;
};
```

### `bind`

```javascript
Function.prototype.myApply = function (ctx, args = []) {    
    ctx = ctx || globalThis;    
    let fn = Symbol('fn');    
    ctx[fn] = this;    
    const result = ctx[fn](...args);    
    delete ctx[fn];    
    return result;
};
```

### `apply`

```javascript
Function.prototype.myBind = function (ctx, ...args1) {
    // 保留对当前函数的引用（即原始函数）
    const fn = this;
    // 返回一个新的函数，这个函数可以在之后被调用，并且可以接受其他参数（args2）
    return function (...args2) {
        // 将 ctx 设置为全局对象（如果为 null 或 undefined）
        ctx = ctx || globalThis;
        // 创建一个唯一的 Symbol 值作为临时函数的键，以防止与 ctx 对象的其他属性冲突
        let tempFn = Symbol('fn');
        // 将当前函数（this）赋值给 ctx 对象的 tempFn 属性
        ctx[tempFn] = fn;
        // 调用函数并传递合并后的参数列表（args1 和 args2），将结果存储在 result 中
        const result = ctx[tempFn](...args1.concat(args2));
        // 调用后删除 ctx 对象上的临时属性 tempFn，以免污染原始对象
        delete ctx[tempFn];
        // 返回调用函数的结果
        return result;
    };
};

```