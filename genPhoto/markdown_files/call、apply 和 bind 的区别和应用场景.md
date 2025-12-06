### 区别

- `call`、`apply`与`bind`的差别

> `call`和 `apply` 改变了函数的 `this` 上下文后便执行该函数,而 `bind` 则是返回改变了上下文后的一个函数。
> 
- `call`、`apply`的区别

> 他们俩之间的差别在于参数的区别, `call` 和 `apply` 的第一个参数都是要改变上下文的对象，而 `call` 从第二个参数开始以参数列表的形式展现, `apply` 则是把除了改变上下文对象的参数放在一个数组里面作为它的第二个参数。
> 

```javascript
let arr1 = [1, 2, 19, 6];//例子：求数组中的最值
console.log(Math.max.call(null, 1,2,19,6)); // 19
console.log(Math.max.apply(null, arr1)); //  19 直接可以用arr1传递进去
```

例子2:

```javascript
function fn() {    
	console.log(this);
}// apply方法结果同下
fn.call(); // 普通模式下this是window，在严格模式下this是undefined
fn.call(null); // 普通模式下this是window，在严格模式下this是null
fn.call(undefined); // 普通模式下this是window，在严格模式下this是undefined
```

### 应用

#### 将伪数组转化为数组（含有`length`属性的对象，`dom`节点, 函数的参数`arguments`）

> 伪数组具有 `length` 属性，并且可以通过0、1、2…下标来访问其中的元素，但是没有 `Array` 中的方法。就可以利用 `call` ， `apply` 来转化成真正的数组，就可以使用数组的方法了
> 

- 节点列表

```html
<div class="div1">1</div>
<div class="div1">2</div>
<div class="div1">3</div>
<script>
	let div = document.getElementsByTagName('div');
	console.log(div); // HTMLCollection(3) [div.div1, div.div1, div.div1] 里面包含length属性
    // HTMLCollection 不是数组，但你想使用数组的方法（如 slice）来处理它。这时候你需要把 slice 方法的上下文从数组切换到 HTMLCollection。
	let arr2 = Array.prototype.slice.call(div);
	console.log(arr2); // 数组 [div.div1, div.div1, div.div1]
</script>
```

  - `fn`内的`arguments`

```javascript
function fn10() {    
	return Array.prototype.slice.call(arguments);
}
console.log(fn10(1,2,3,4,5)); // [1, 2, 3, 4, 5]
```

  - 含有`length`属性的对象

```javascript
let obj4 = {
    0: 1,
    1: 'thomas',
    2: 13,
    length: 3 // 一定要有length属性
};
console.log(Array.prototype.slice.call(obj4)); // [1, "thomas", 13]
```

#### 数组拼接，添加

```javascript
let arr1 = [1,2,3];
let arr2 = [4,5,6];//数组的concat方法：返回一个新的数组
let arr3 = arr1.concat(arr2);
console.log(arr3); // [1, 2, 3, 4, 5, 6]
console.log(arr1); // [1, 2, 3] 不变
console.log(arr2); // [4, 5, 6] 不变
// 用 apply方法
[].push.apply(arr1,arr2);  // 给arr1添加arr2
console.log(arr1); // [1, 2, 3, 4, 5, 6]
console.log(arr2); // 不变
```

#### 判断变量类型

```javascript
let arr1 = [1,2,3];
let str1 = 'string';
let obj1 = {
	name: 'thomas'
};
function isArray(obj) {  
	return Object.prototype.toString.call(obj) === '[object Array]';
}
console.log(Object.prototype.toString.call(arr1)); // [object Array]
console.log(Object.prototype.toString.call(str1)); // [object String]
console.log(Object.prototype.toString.call(obj1)); // [object Object]
console.log(Object.prototype.toString.call(null)); // [object Null]
```

#### 利用 `call` 和 `apply` 做继承

```javascript
function Animal(name){    
	this.name = name;    
	this.showName = function(){        
		console.log(this.name);    
	}
}
function Cat(name){    
	Animal.call(this, name);
}
// this 是指向新创建的 Cat 对象。
// Animal 构造函数会被调用，并且 this 指向这个新的 Cat 对象。
var cat = new Cat("TONY");
cat.showName();   // TONY
```

#### 多继承

```javascript
function Class1(a,b) {    
	this.showclass1 = function(a,b) {      
		console.log(`class1: ${a},${b}`);    
	}  
}  
function Class2(a,b) {    
	this.showclass2 = function(a,b) {      
		console.log(`class2: ${a},${b}`);    
	}  
}  
function Class3(a,b,c) {    
	Class1.call(this);    
	Class2.call(this);  
}  
let demo = new Class3();  
demo.showclass1(1); // class1: 1,undefined  
demo.showclass1(1,2); // class1: 1,1  
```