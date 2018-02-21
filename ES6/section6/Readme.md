# 函数的拓展

- [**`1.函数参数默认值`**](#函数参数默认值)
  - [**`1.1基本用法`**](#基本用法)
  - [**`1.2与解构赋值默认值结合使用`**](#与解构赋值默认值结合使用)
  - [**`1.3函数的length属性`**](#函数的length属性)
  - [**`1.作用域`**](#作用域)
- [**`2.rest参数`**](#rest参数)
  
    

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
> 引入rest参数用来获取函数的多余参数
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