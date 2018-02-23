# 函数的拓展

- [**`1.函数参数默认值`**](#函数参数默认值)
  - [**`1.1基本用法`**](#基本用法)
  - [**`1.2与解构赋值默认值结合使用`**](#与解构赋值默认值结合使用)
  - [**`1.3函数的length属性`**](#函数的length属性)
  - [**`1.作用域`**](#作用域)
- [**`2.rest参数`**](#rest参数)
- [**`3.严格模式`**](#严格模式)
- [**`4.箭头函数`**](#箭头函数)
- [**`5.尾调用优化`**](#尾调用优化)
- [**`6.尾递归`**](#尾递归)
  
    

## 函数参数默认值

### 基本用法
> 容易忽略的地方，默认参数值不是传值的，而是每次重新计算默认值表达式，也就是默认传值的

```javascript
let x = 99
function foo (p = x +1) {
  console.log(p)
}

foo() // 100

x = 100

foo() // 101
```


### 与解构赋值默认值结合使用
```javascript
function foo ({x, y = 5}) {
  console.log(x,y)
}

foo({})  // undefined,5
foo({y:3})  // undefined,3
foo()  // TypeError : Cannot read property 'x' of undefined

// 使用默认值 就不会报错
function foo ({x, y = 5} = {}) {
  console.log(x,y)
}
foo()  // undefined,5
```

*两种写法的差别*
```javascript
function m1 ({x = 0, y = 0} = {}) {
  return [x, y]
}

function m2 ({x, y} = {x: 0, y: 0}) {
  return [x, y]
}

// 函数都没有参数情况
m1() // [0,0]
m2() // [0,0]

// 函数都值的情况
m1({x: 3,y: 7}) // [3,7]
m2({x: 3,y: 7}) // [3,7]

// 函数一个值的情况
m1({x: 3}) // [3,0]
m2({x: 3}) // [3,undefined]

//x, y都无值的情况
m1({}) // [0,0]
m2({}) // [undefined,undefined]
```

### 函数的length属性
> 指定了默认值后,函数的length属性将返回没有指定默认值的参数个数,也就是说指定了默认值后，length属性会失效。

```javascript
(function (a){}).length // 1
(function (a = 3){}).length // 0
// length含义是该函数预期传入的参数个数，某个参数传入默认值后，预期传入的参数个数就不包含这个参数了，同理rest参数也不计入。
(function (...args){}).length // 0
// 如果设置的默认值不是尾参数，那么length也不计入后面的参数
(function (a = 0 , b , c){}).length // 0
(function (a , b = 1 , c){}).length // 1
```


### 作用域
> 指定了默认值后,函数进行声明初始化时，参数会形成一个单独的作用域(context),等到初始化结束后,这个作用域会消失。这种语法在不设置参数默认值时是不会出现的。

[**`暂时性死区`**](https://github.com/chenxuan0000/learning-records/blob/master/ES6/section1/Readme.md#%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA)


```javascript
let x = 1
function f(y = x) {
  let x = 2
  console.log(y)
}
f()  // 1  里面的局部变量x影响不了默认值x的值

// 如果x不存在就会报错
function f(y = x) {
  let x = 2
  console.log(y)
}
f()  // ReferenceError: x is not defined


// 下面这样也会报错
var x = 1
function f(x = x) {
  ...
}
f()  // ReferenceError: x is not defined
// 参数 x = x形成一个单独的作用域，实际上执行的是let x = x, let x在未声明前定义导致了暂时性死区

//一个复杂的例子
var x = 1
funtion f1(x, y = function () { x = 2 }) {
  var x = 3
  y()
  console.log(x)
}

 f1() // 3
 x // 1

 // 上面foo的参数形成了一个单独的作用域，这个匿名函数y里面的变量x指向了同一个作用域的第一个参数x，函数foo里面声明了内部变量x与第一个参数x由于不少同一个作用域，所以不少同一个变量

 //如果将var x = 3 的var去掉，foo的内部变量x就指向了第一个参数，与匿名函数内部的x是一致的被覆盖成了2，外层的全局变量不受影响
var x = 1
funtion f1(x, y = function () { x = 2 }) {
  x = 3
  y()
  console.log(x)
}

 f1() // 2
 x // 1
```

## rest参数
> 引入rest参数用来获取函数的剩余参数
```javascript
function add (...val) {
  let sum = 0

  for (var item of val) {
    sum += item
  }

  return sum
}

add(2, 3, 5) // 10

// rest 代替arguments的例子
// arguments写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort()
}

// rest参数写法
const sortNumbers = (...args) => args.sort()
``` 


## 严格模式
> ES5开始，函数内部可以设定为严格模式
```javascript
function doSomething (a, b) {
  'use strict'
  // code
}
```


> ES2016坐牢一些修改，规定只要函数参数使用了默认值，解构赋值或者拓展运算符，那么函数内部就不能显式的设定为严格模式，否则报错

```javascript
//报错
function doSomething (a, b = a) {
  'use strict'
  // code
}
//报错
const doSomething = function ({a, b}) {
  'use strict'
  // code
}
//报错
const doSomething = (...a) => {
  'use strict'
  // code
}

//原因是因为函数执行时先执行的是函数参数，然后在执行函数体，这样就有一个不合理的地方，只有从函数体之中，参数是否应该以严格模式执行。
```

> 以下两种方法可以规避这种限制
*1.设定全局性的严格模式*
```javascript
'use strict'
const doSomething = (...a) => {
  // code
}
```
*2.把函数包在一个无参数的立即执行函数里面*
```javascript
const doSomething = (function () {
  'use strict'
  return function (value = 42) {
    return value      
  }
}())
```

## 箭头函数
- 函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象
- 不可以当做构造函数，就是说不可以使用new，否则报错
- 不可以使用arguments对象，但是可以用rest剩余参数替代
- 不可以使用yield命令，因此不能用Generator函数

```javascript
//另外箭头函数内部没有this,不能使用call(),apply(),bind()去改变this的指向
(function () {
  return [
    (() => this.x).bind({x:'inner'})()
  ]
}).call({x: 'outer'})

// 'outer'
```

## 尾调用优化
### 什么是尾调用
>(Tail Call)是函数式编程的一个重要概念，是指一个函数在最后一步调用另一个函数。
```javascript
//就这是尾调用
function f(x) {
  return g(x)
}

//下面的情况不属于尾调用
function f(x) {
  let y = g(x) //还有赋值操作
  return y
}

function f(x) {
  return g(x) + 1  //还有其他操作
}

function f(x) {
  g(x)
}
//等同于
function f(x) {
  g(x)
  return undefined
}
```

### 尾调用优化
>尾调用和其他调用不同就在于，其特殊的调用位置。函数调用会在内存中形成一个调用帧，因为尾调用是最后一步操作没必要保存这些信息。

```javascript
function f() {
  let m = 1
  let n = 2
  return g(m + n)
}
f()

// 等同于
function f() {
  return g(3)
}
f()
//节省内存
```

## 尾递归
> 函数调用自身就是递归，如果尾调用自身就是尾递归，递归很耗内存，因为需要同时保存成百上千和调用帧，很容易发生**栈溢出(stack overflow)**错误,但是对于尾递归来说，只有一个调用栈不会发生这种情况。
```javascript
//复杂度O(n)
function factorial(n) {
  if( n === 1) return 1
  return n * factorial(n-1)
}
//复杂度O(1)
function factorial(n, total = 1) {
  if( n === 1) return total
  return factorial(n-1 , n * total)
}

//计算Fibonacci数列
function Fibonacci(n) {
  if (n <= 1) return 1
  return Fibonacci(n - 1) + Fibonacci(n - 2)
}
Fibonacci(10) //89
Fibonacci(100) //堆栈溢出

//尾递归优化后
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
  if(n <= 1) return ac2
  return Fibonacci2(n - 1, ac2, ac1 + ac2)
}
Fibonacci2(100) //573147844013817200000
Fibonacci2(1000) //7.0330367711422765e+208
Fibonacci2(10000) //Infinity
```