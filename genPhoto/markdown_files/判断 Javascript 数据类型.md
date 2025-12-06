## 判断数据类型

下面将对如下数据进行判断它们的类型

```javascript
let bool = true
let num = 1
let nan = NaN
let str = 'abc'
let und = undefined
let nul = null
let arr = [1,2,3]
let obj = {name:'libra',age:18}
let sym = Symbol(1)
let m = new Map()
let wm = new WeakMap()
let mySet = new Set();
let myWeakSet = new WeakSet();
let myError = new Error("Something went wrong");
let myRegExp = /abc/;
let myDate = new Date();
let fun = function(){
    console.log('I am a function')
}
```

### 使用`typeof`

```jsx
console.log(typeof bool); //boolean
console.log(typeof num); //number
console.log(typeof nan); //number
console.log(typeof str); //string
console.log(typeof und); //undefined
console.log(typeof nul); //object
console.log(typeof arr); //object
console.log(typeof obj); //object
console.log(typeof sym); //symbol
console.log(typeof m); //object
console.log(typeof wm); //object
console.log(typeof mySet); // "object"
console.log(typeof myWeakSet); // "object"
console.log(typeof myError); // "object"
console.log(typeof myRegExp); // "object"
console.log(typeof myDate); // "object"
console.log(typeof fun); //function
```

> 由结果可知`typeof`可以测试出`number`、`string`、`boolean`、`undefined`及`function`，而对于`null`及数组、对象，`typeof`均检测出为object，不能进一步判断它们的类型。

### 使用`instanceof`

```javascript
console.log(bool instanceof Boolean);// false
console.log(num instanceof Number);// false
console.log(nan instanceof Number);// false
console.log(str instanceof String);// false
console.log(und instanceof Object);// false
console.log(arr instanceof Array);// true
console.log(nul instanceof Object);// false
console.log(obj instanceof Object);// true
console.log(sym instanceof Symbol); // false
console.log(m instanceof Map); // true
console.log(wm instanceof WeakMap); // true
console.log(mySet instanceof Set); // true
console.log(myWeakSet instanceof WeakSet); // true
console.log(myError instanceof Error); // true
console.log(myRegExp instanceof RegExp); // true
console.log(myDate instanceof Date); // true
console.log(fun instanceof Function);// true
let bool2 = new Boolean()
console.log(bool2 instanceof Boolean);// true
let num2 = new Number()
console.log(num2 instanceof Number);// true
let str2 = new String()
console.log(str2 instanceof String);//  true
function Person(){}
let per = new Person()
console.log(per instanceof Person);// true
function Student(){}
Student.prototype = new Person()
let libra = new Student()
console.log(libra instanceof Student);// true
console.log(libra instanceof Person);// true
```

> 从结果中看出`instanceof`不能区别`undefined`和`null`，而且对于基本类型如果不是用`new`声明的则也测试不出来，对于是使用`new`声明的类型，它还可以检测出多层继承关系。

### 使用`constructor`

> *undefined和null没有contructor属性*

```javascript
console.log(bool.constructor === Boolean);// true
console.log(num.constructor === Number);// true
console.log(nan.constructor === Number);// true
console.log(str.constructor === String);// true
console.log(arr.constructor === Array);// true
console.log(obj.constructor === Object);// true
console.log(sym.constructor === Symbol); // true
console.log(m.constructor === Map); // true
console.log(wm.constructor === WeakMap); // true
console.log(mySet.constructor === Set); // true
console.log(myWeakSet.constructor === WeakSet); // true
console.log(myError.constructor === Error); // true
console.log(myRegExp.constructor === RegExp); // true
console.log(myDate.constructor === Date); // true
console.log(fun.constructor === Function);// true
console.log(libra.constructor === Student);// false
console.log(libra.constructor === Person);// true
```

> `constructor`不能判断`undefined`和`null`，并且使用它是不安全的，因为`contructor`的指向是可以改变的

### 使用`Object.prototype.toString.call`

```javascript
console.log(Object.prototype.toString.call(bool));//[object Boolean]
console.log(Object.prototype.toString.call(num));//[object Number]
console.log(Object.prototype.toString.call(nan));//[object Number]
console.log(Object.prototype.toString.call(str));//[object String]
console.log(Object.prototype.toString.call(und));//[object Undefined]
console.log(Object.prototype.toString.call(nul));//[object Null]
console.log(Object.prototype.toString.call(arr));//[object Array]
console.log(Object.prototype.toString.call(obj));//[object Object]
console.log(Object.prototype.toString.call(sym));//[object Symbol]
console.log(Object.prototype.toString.call(m));//[object Map]
console.log(Object.prototype.toString.call(wm));//[object WeakMap]
console.log(Object.prototype.toString.call(mySet)); // [object Set]
console.log(Object.prototype.toString.call(myWeakSet)); // [object WeakSet]
console.log(Object.prototype.toString.call(myError)); // [object Error]
console.log(Object.prototype.toString.call(myRegExp)); // [object RegExp]
console.log(Object.prototype.toString.call(myDate)); // [object Date]
console.log(Object.prototype.toString.call(fun));// [object Function]
function Person(){}
function Student(){}
Student.prototype = new Person()
let haoxl = new Student()
console.log(Object.prototype.toString.call(haoxl));//[object Object]
```
#### 背景和原理

`Object.prototype.toString.call` 可以准确判断数据类型的原因在于它通过调用对象的内部 `[[Class]]` 属性，返回一个标准化的类型字符串。

每个对象在 JavaScript 中都有一个内部的 `[[Class]]` 属性，它表示对象的类型。虽然这个属性在规范中被描述，但无法直接访问。然而，当你调用 `Object.prototype.toString` 方法时，它会返回一个特定格式的字符串，其中包含了对象的 `[[Class]]` 值。