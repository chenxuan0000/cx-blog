# Class的基本语法

- [**`1.简介`**](#简介)
- [**`2.严格模式`**](#严格模式)
- [**`3.constructor方法`**](#constructor方法)
- [**`4.class表达式`**](#class表达式)
- [**`5.不存在变量提升`**](#不存在变量提升)
- [**`6.this的指向`**](#this的指向)
- [**`7.class的静态方法`**](#class的静态方法)
- [**`8.class的静态属性`**](#class的静态属性)
- [**`9.new.target属性`**](#newtarget属性)

## 简介
> 传统的方式是通过构造函数定义来生成新对象
```javascript
function Car(money) {
  this.money = money
}
Car.prototype.toString = function () {
  return this.money + '太贵'
} 
var c = new Car(200000)
```

> ES6中的class可以看成一个语法糖，它的绝大部分功能ES5都可以做到。
```javascript
class Car {
  constructor (money) {
    this.money = money
  }

  toString () {
    return this.money + '太贵'
  }
}
// typeof Car // 'function'
// Car  === Car.prototype.constructor  // true
// 类的数据类型就是函数，类本身指向构造函数

// class里面的所有方法都是不可枚举的
Object.keys(Car.prototype) // []
Object.getOwnPropertyNames(Car.prototype) // ["constructor", "toString"]

// ES5的行为不一样 所有方法都是可枚举的
Object.keys(Car.prototype) // ["toString"]
Object.getOwnPropertyNames(Car.prototype) // ["constructor", "toString"]
```
> 类的属性名可以采取表达式
```javascript
let method1 = 'getArea'
class Bar {
  constructor () {

  }
  [method1] () {

  }
}
```

## 严格模式
> 类和模块内部默认就是严格模式了，只要将代码写在其中就是默认严格模式运行。
> 考虑到未来所有的代码，所以ES6实际上已经把整个语言都写在了严格模式中。

## constructor方法
> constructor方法是类的默认方法，new命令生成对象实例时，会自动调用该方法。一个类必须有constructor方法，没有的话会默认添加
```javascript
class Person {

}
// 等同于
class Person {
  constructor () {

  }
}
```

> constructor方法是默认返回实例对象(this),不过可以自定义返回
```javascript
// 等同于
class Person {
  constructor () {
    return Object.create(null)
  }
}
new Person() // {}
new Person() instanceof Person // false 实例已经不是Person类
```

## class表达式
```javascript
const myClass = class Me {
  getClassName () {
    return Me.name
  }
}
new myClass().getClassName // Me
Me.getClassName // Me is no defined 
// Me只能在 class内部定义 如果没用到可以省略
const myClass = class {...}
```

> 立即执行的class
```javascript
let car = new class {
  constructor (name) {
    this.name = name
  }

  sayName () {
    console.log(this.name)
  }
}('zhang')
car.sayName() //'zhang'
```

## 不存在变量提升
> 这个与ES5有很大的区别
```javascript
new Foo() // ReferenceError
class Foo {}

{
  let Foo = class {}
  class Bar extends Foo {

  }
}
// 没有提升上面代码正常运行
```

## this的指向
> 类的方法内部如果含有this,会默认指向类的实例。但是要小心如果单独使用该方法可能会报错。
```javascript
class Logger {
  printName (name = 'text') {
    this.print(`hello ${name}`)
  }

  print (text) {
    console.log(text)
  }
}

const log = new Logger()
log1.printName() // 'hello text'

// 如果把这个方法单独提取出来this会执行当前所在环境报错
const { printName } = log
printName()  // Uncaught TypeError: Cannot read property 'print' of undefined
```

> 解决方案
```javascript
// 在构造函数中绑定this
class Logger {
  constructor () {
    this.printName = this.printName.bind(this)
  }
  printName (name = 'text') {
    this.print(`hello ${name}`)
  }

  print (text) {
    console.log(text)
  }
}


// 箭头函数
class Logger {
  constructor () {
    this.printName = (name = 'text') => {
      this.print(`hello ${name}`)
    }
  }
  
  print (text) {
    console.log(text)
  }
}

// 另外一种Proxy 
```

## class的静态方法
> 类相当于实例中的原型，在类中定义的所有方法都会被实例继承，如果一个方法钱加static，不会被实例基础。
```javascript
class F {
  static getName () {
    return 'a'
  }
}
F.getName() // 'a'
let foo = new F()
foo.getName() // getName is not a function
```

> 父类的静态方法可以被子类继承
```javascript
class F {
  static getName () {
    return 'a'
  }
}
class c extends F {
  static getName2 () {
    return 'a2'
  }
}

c.getName() // 'a2'
```

> 父类的静态方法可以在super上调用
```javascript
class F {
  static getName () {
    return 'a'
  }
}
class c extends F {
  static getName () {
    return super.getName() + 'cccc'
  }
}

c.getName() // 'a2'
```

## class的静态属性
> class的静态属性写法只要加上static关键字就可以了。
```javascript
// 浏览器控制台暂时不支持
class Myclass {
  static name = 'chenxuan'
}

// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

```

## newtarget属性
> 返回new命令作用的那个构造函数，如果不是new调用返回undefined,可以用来确定构造函数是怎么调用的。
```javascript
function Car(name) {
  if (new.target === Car) {
    this.name = name
  } else {
    throw new Error('必须new')
  }
}
new Car(1212) // Car {name: 1212}
Car(1212) // Uncaught Error: 必须new
```

> Class 内部调用new.target，返回当前 Class。
```javascript
class Bar {
  constructor () {
    console.log(new.target === Bar)
  }
}
new Bar() // true
```

> 需要注意的是，子类继承父类时，new.target会返回子类
```javascript
class Bar {
  constructor () {
    console.log(new.target === Bar)
  }
}

class Bat extends Bar {
  constructor() {
    super();
  }
}
new Bat() // false
```

> 可以利用这个特性写出不能独立使用必须继承才能用的类
```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```