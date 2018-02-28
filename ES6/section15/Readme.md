# Class的继承

- [**`1.简介`**](#简介)
- [**`2.Object.getPrototypeOf()`**](#getprototypeOf)
- [**`3.super关键字`**](#super关键字)
- [**`4.类的 prototype 属性和__proto__属性`**](#prototype和proto属性)
- [**`5.extends 的继承目标`**](#extends的继承目标)
- [**`6.实例的 __proto__ 属性`**](#proto属性)
- [**`7.原生构造函数继承`**](#原生构造函数继承)
- [**`8.Mixin模式的实现`**](#mixin模式的实现)

## 简介
> class可以通过extends关键字实现继承比同步改变原型链清晰的多。
```javascript
class Point {
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

> 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。
```javascript
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError  Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

> ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

> 如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。
```javascript
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

> 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有super方法才能返回父类实例。
```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```

## getprototypeOf
> `Object.getPrototypeOf`方法可以从子类获取他的父类。
```javascript
Object.getPrototypeOf(ColorPoint) === Point  // true
```

## super关键字
### super作为函数调用时
> 第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
```javascript
class A {}

class B extends A {
  constructor() {
    super();
  }
}
//上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。
```

> 注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。
```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
//上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。
```

> 作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。
```javascript
class A {}

class B extends A {
  m() {
    super(); // 报错
  }
}
```
### super作为对象时
> 第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```javascript
class A {
  p () {
    return 2;
  }
}

class B extends A {
  constructor () {
    super ();
    console.log(super.p()); // 2
  }
}

let b = new B();
// 上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。
```

> 这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
```javascript
class A {
  constructor () {
    this.y = 11
  }
}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.y) // undefined
    console.log(super.x) // 2
  }
}

let b = new B();
```

> 由于this指向子类，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```

> 如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

## prototype和proto属性
> 大多数浏览器的 ES5 实现之中，每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
- 1.子类的__proto__属性，表示构造函数的继承，总是指向父类。
- 2.子类的prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
```javascript
class A {

}

class B extends A {

}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
//上面代码中，子类B的__proto__属性指向父类A，子类B的prototype属性的__proto__属性指向父类A的prototype属性。
```

> 这样的结果是因为，类的继承是按照下面的模式实现的。
```javascript
class A {}
class B {}
// B的实例继承 A的实例
Object.setPrototypeOf(B.prototype, A.prototype)
// B的实例继承 A的静态属性
Object.setPrototypeOf(B, A)
const b = new B()

// 等效
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```


> 《对象的扩展》一章给出过Object.setPrototypeOf方法的实现。
```javascript
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

## extends的继承目标
> extends关键字后面可以跟多种类型的值
```javascript
class B extends A {
}
// 上面代码的A，只要是一个有prototype属性的函数，就能被B继承。由于函数都有prototype属性（除了Function.prototype函数），因此A可以是任意函数。
```
### 第一种特殊情况，子类继承Object类。
```javascript
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
// 这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。
```

### 第二种特殊情况，不存在任何继承。
```javascript
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
// 这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。
```

### 第三种特殊情况，子类继承null。
```javascript
class A extends null {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === undefined // true
//这种情况与第二种情况非常像。A也是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回的对象不继承任何方法，所以它的__proto__指向Function.prototype，即实质上执行了下面的代码

class C extends null {
  constructor() { return Object.create(null); }
}
```

## proto属性
> 子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性，就是说子类原型的原型是父类的原型。

## 原生构造函数继承
- [**`Boolean()`**]
- [**`Number()`**]
- [**`String()`**]
- [**`Array()`**]
- [**`Date()`**]
- [**`Fucntion()`**]
- [**`RegExp()`**]
- [**`Error()`**]
- [**`Object()`**]

> 以前这些原生构造函数是无法继承的，比如不能定义一个Array()子类
```javascript
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});
// 上面代码定义了一个继承 Array 的MyArray类。但是，这个类的行为与Array完全不一致。
var colors = new MyArray();
colors[0] = "red";
colors.length  // 0

colors.length = 0;
colors[0]  // "red"
```

> ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。下面是一个继承Array的例子。
```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

## mixin模式的实现
> mixin模式是指多个类的接口“混入”（mixin）另一个类，在ES6中实现如下。
```javascript
function mix(...mixins) {
  class Mix {}
  for (let minix of mixins) {
    copyProperties(Mix, minix)
    copyProperties(Mix.prototype, minix.prototype)
  }
  return Mix
}
function copyProperties (target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if(key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source,key)
      Object.defineProperty(target,key,desc)
    }
  }
}
```

> 上面的mix函数可以将多个对象合并为一个类，使用的时候只要继承这个类就行。
```javascript
class DistributeEdit extend mix (Loggable, Serializable) {
  // ....
}
```