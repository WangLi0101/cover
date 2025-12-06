### What is "this"?

In JavaScript, "this" is a special keyword that refers to the current execution context which means what is happening right now.

It changes its value depending on how a function is invoked. Understanding how "this" works might seem a bit <span class="word" data-word="50">tricky</span>, but it'll get easier for you as we'll explore its different situations.

So, let's explore its different <span class="word" data-word="45">scenarios</span>.

### "this" in Global Context

When we use "this" in the global scope, then "this" refers to the global object.

For example, when we use "this" in a browser environment, then this is often the `window` object.

```javascript
console.log(this); // Window
```

**Now, what is** `window` **object?🤔**

The `window` object represents that browser window which contains the document. This object provides properties and methods, by using them you can interact with the browser environment.

### "this" in Regular Functions

When used in regular functions, "this" refers to the global object (`window` object in a browser environment).

```javascript
function myFunction() {
  console.log(this);
}

myFunction(); // Window
```

### "this" in Regular Functions (strict mode)

When we use "this" in functions, in strict mode, then "this" refers to `undefined`.

```javascript
"use strict";
function myFunction() {
  console.log(this);
}

myFunction(); // undefined
```
### "this" in Arrow Functions

Arrow functions don't have their own "this" context. Instead, they inherit it from their parent scope (which is called "lexical scoping").

For example:

```javascript
const myfunc = () => {
  console.log(this);
};
myfunc(); // Window
```

In the above example, `myfunc` is an arrow function. Since arrow functions inherit "this" from their parent scope, so in this case, it will be the global object (in a browser environment, `window` object).

### "this" in Event Handlers

When we use "this" in event handlers, then "this" refers to the DOM element that triggered the event.

For example:

```xml
<button>Click me</button>
```

JavaScript:

```javascript
const myBtn = document.querySelector("button");

myBtn.addEventListener("click", function () {
  console.log(this); // <button>Click me</button>
});
```

In the above example, when you click on the button, the event handler will execute and `console.log(this)` will output the element (`<button>` element) to the console because an event listener is attached to the `<button>` element.

Let's take another example.

```xml
<div>This is a div.</div>
```

JavaScript:

```javascript
const myDiv = document.querySelector("div");

myDiv.addEventListener("mouseover", function () {
  console.log(this); // <div>This is a div.</div>
});
```

In the above example, when your cursor will be over the `div`, the event handler will execute and `console.log(this)` will output the element (`<div>` element) to the console because an event listener is attached to the `<div>` element.

### "this" in Methods of an Object

When a function is a method of an object, then "this" refers to that object on which the method is called on.

### Example using regular function

```javascript
const myObj = {
  name: "Shefali",
  myMethod: function () {
    console.log(this.name);
  }
};

myObj.myMethod(); //Output: Shefali
```

In the above example,

- `myObj` is an object with a property `name` set to the string "Shefali" and with a method `myMethod` defined using a regular function.
- Inside the `myMethod` function, "this" refers to the object on which the method is called. In this case, it refers to `myObj`.
- So, the output of `this.name` will be `Shefali`, as `myObj` has a property `name` with the value `Shefali`.

### Example using arrow function

```javascript
const myObj = {
  name: "Shefali",
  myMethod: () => {
    console.log(this.name);
  }
};

myObj.myMethod(); //Output: undefined
```

In the above example,

- `myObj` is an object with a property `name` set to the string "Shefali" and with a method `myMethod` defined using an arrow function.
- Now, we are trying to log `this.name` using arrow function.
- Since arrow functions inherit "this" from their parent scope, so in this case, it will be the global scope (because `myObj` is defined in the global scope).
- The output of `this.name` will be `undefined`, as `this.name` in the arrow function does not refer to the `name` property of `myObj` but rather to the global scope and the global scope usually does not have a `name` property.

### "this" in Constructors of an Object

Constructor functions are used to create objects. "this" keyword inside a constructor refers to that object which is created by that constructor.

For example:

```javascript
function Person(name) {
  this.name = name;
}

const myPerson = new Person("Shefali");
console.log(myPerson.name); //Output: Shefali
```

Let's understand the above example,

- Here, the `Person` function is a constructor function.
- In the constructor function, "this" refers to that object which is created by that constructor. In this case, when you create a new object `myPerson` using `new Person("Shefali")`, "this" inside the constructor refers to the newly created `myPerson` object.
- When we pass the `name` parameter during object creation, this is assigned to the `name` property of the `myPerson` object using `this.name = name`.
- When you access `myPerson.name`, it retrieves the value of the `name` property from the `myPerson` object and logs `Shefali` to the console.

If you want to understand objects more clearly, then you can [click here](https://shefali.dev/javascript-objects/).

### "this" in Object Prototypes

When we use "this" in object prototypes, it behaves similarly to constructors. The "this" keyword inside a prototype refers to that object which is created by that prototype.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hello, ${this.name}!`);
};
const myPerson = new Person('Shefali');
myPerson.greet(); //Output: Hello, Shefali!
```

In the above example,

- We have a function called `Person` and we are adding a method called `greet` to the `Person` prototype.
- Using the `Person` function, we create a object called `myPerson` with the name `Shefali`.
- Now we call the `greet` method on the `myPerson` object.
- Inside the `greet` method, `this.name` refers to the name of the `myPerson` object which is `Shefali`.
- So the output will be `Hello, Shefali!`.

### "this" in Class Methods

In JavaScript, the `class` keyword is used to define a constructor and methods for objects. When we define a method inside a class, then "this" keyword refers to the instance of the class on which the method is called.

For example:

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

   greet() {
     console.log(`Hello, I'm ${this.name}!`);
   }
}
const myPerson = new Person('Shefali');
myPerson.greet(); // Output: Hello, I'm Shefali!
```

In the above example,

- We create a new instance `myPerson` using `Person` class.
- `myPerson.greet()` calls the `greet` method on the `myPerson` instance.
- Here, "this" refers to the instance and properties of the class `Person`.
- So the output is `Hello, I'm Shefali!`.

### "this" in Call, Apply, or Bind Methods

JavaScript provides methods like `call`, `apply`, and `bind` to explicitly set the value of "this" keyword in a function.

### call() Method:

The `call()` method is used to invoke a function with a specified value of "this" and arguments provided individually.

For example:

```javascript
function greet() {
  console.log(`Hello, ${this.name}!`);
}
const person = { 
  name: 'Shefali' 
};
greet.call(person); // Output: Hello, Shefali!
```

In the above example,

- We have a function named `greet` and it logs a greeting message to the console using the `name` property of an object.
- We have an object named `person` with a property `name` set to `Shefali`.
- Now, the `call` method is used to invoke the `greet` function.
- Here, we pass the `person` object as an argument to `call`. Which means, within the `greet` function, "this" keyword will now refer to the `person` object.
- So it uses `this.name` to access the `name` property of the `person` object and gives the output `Hello, Shefali!`.

### apply() Method:

The `apply()` method is similar to `call()` method. The difference is that it takes arguments as an array.

For example:

```javascript
function greet(greeting, message) {
  console.log(`${greeting}, ${message} ${this.name}!`);
}
const person = { 
  name: 'Shefali' 
};
greet.apply(person, ['Hello', 'Welcome']); // Output: Hello, Welcome Shefali!
```

In the above example,

- We have a `greet` function, which takes two parameters, `greeting` and `message`.
- We have an object named `person` with a property `name` set to `Shefali`.
- Now, the `apply` method is used to invoke the `greet` function.
- Here, we pass the `person` object as an argument to `apply`. Which means, within the `greet` function, "this" keyword will now refer to the `person` object and the array `['Hello', 'Welcome']` provides values for the `greeting` and `message` parameters.
- So the function prints the `greeting`, `message`, and the `name` from the `person` object to the console as `Hello, Welcome Shefali!`.

### bind() Method:

The `bind()` method is used to create a new function with a specified value of "this" and initial arguments.

It doesn't immediately invoke the function but returns a new function which we can call later.

For example:

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}!`);
}

const person = { 
  name: 'Shefali' 
};

const greetPerson = greet.bind(person, 'Good morning');
greetPerson(); // Output: Good morning, Shefali!
```

In the above example,

- We have a `greet` function, which takes a parameter, `greeting`.
- We have an object named `person` with a property `name` set to `Shefali`.
- The `bind` method is used to create a new function `greetPerson` by associating the "this" value with the `person` object and providing a default value for the `greeting` parameter as `Good morning`.
- When we call `greetPerson()`, it uses the `greet` function, with value of "this" set to the `person` object and gives the output as `Good morning, Shefali!`.

That's all for today.

I hope it was helpful.

Thanks for reading.