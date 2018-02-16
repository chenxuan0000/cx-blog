# let，const命令

- [**`1.let`**](#let)
    - [**`1.1 不存在变量提升`**](#不存在变量提升)
    - [**`1.2 暂时性死区`**](#暂时性死区)
    - [**`1.3 不允许重复声明`**](#不允许重复声明)
    - [**`1.4 为什么需要块级作用域`**](#为什么需要块级作用域)
    - [**`1.5 ES6的块级作用域`**](#es6块级作用域)
    - [**`1.6 do表达式`**](#do表达式)    
- [**`2.const`**](#const)
- [**`3.ES6声明变量的方法有6种`**](#es6声明变量的方法有6种)
- [**`4.顶层对象的属性`**](#顶层对象的属性)
    
## let

### 不存在变量提升

```javascript
// var
console.log(foo) // 输出undefined
var foo = 2

// let
console.log(bar) // 输出ReferenceError
let bar = 2
```

### 暂时性死区

*在代码块内(块级作用域)，使用let命名变量之前，该变量都是不可用的。(temporal dead zone 简称TDZ)*

```javascript
if (true) {
  // TDZ开始
  temp = 'abc' // 输出ReferenceError
  console.log(temp) // 输出ReferenceError

  // TDZ结束
  let temp
  console.log(temp) // 输出undefined

  temp = 123
  console.log(temp) // 123
}
```

> 上面的代码中,let temp声明前，都属于temp的死区，意味着typeof不在是100%成功的操作(var里面这个是绝对安全的)


**隐蔽的暂时性死区** *参数x的默认值等于另一个参数y，而此时y没有声明,属于死区*

```javascript
function bar(x = y, y = 2) {
  return [x, y]
}
bar() //报错
```

### 不允许重复声明

*不能再函数内部重新声明参数*

```javascript
function func(args) {
  let arg // 报错
}

function func(args) {
  {
    let arg // 不报错
  }
}
```

### 为什么需要块级作用域

es5只要全局和函数作用域，导致了部分场景不合理

> 1.内部变量覆盖外层变量(变量提升导致了内存temp变量覆盖了外层temp)

```javascript
var temp = '123'
function f() {
  console.log(temp)
  if (true) {
    var temp = '234'
  }
}
f()  // undefined
```

> 2.用来计数的循环变量泄露为全局变量(下述例子i只是用来控制循环,最后泄露成全局变量)

```javascript
var s = 'hello'
for (var i = 0; i < s.length; i++) {
  console.log(s[i])
}

console.log(i)  // 5
```

### ES6块级作用域
```
// 内层可以和外层是同名变量
{{{{
  let ins = 'a';
  {let ins = 'b'}
}}}}
```

*块级作用域的出现，使得广泛使用的立即执行匿名函数(IIFE)不在必要了*
```javascript
// IIFE 写法
(function () {
  var temp = '1'
  ...
})

// 块级作用域写法
{
  let temp = '1';
  ...
}
```

### do表达式
*本质上，块级作用域是奖多个操作封装在一起，没有返回值*
> 现在有个**提案**可以使得块级作用域变成表达式，即可以返回值，办法就是在块级作用域前加上do
```javascript
let x = do {
  let t = f()
  t * t + 1
}
```

## const

> const 声明一个常量，值不会被改变，和let一样不可重复声明，存在暂时性死区

### 本质

>const实际上并非变量的值不能改变,而是变量指向的内存地址不能改变。但是对于简单类型(数值，字符串，布尔值)值就保存在对应的内存地址中，因此等同于常量。但是对于符合类型的数据(对象和数组)而言,变量指向的内存地址只是一个指针，const只能保证这个指针是固定的，至于他的数据结构是否可变不能完全控制，所以将一个对象声明为常量要谨慎。

*example*
```javascript
const foo = {}
//为foo添加一个属性可以成功
foo.prop = '123'
foo.prop // '123'

// 将foo指向另一个对象，报错
foo = {} // TypeError: 'foo' is read-only

*上面的代码foo存的是一个地址，这个地址指向一个对象，不可变的只是这个地址*
```

> 想将对象冻结，应该使用Object.freeze方法
```
const foo = Object.freeze({})

//常规模式下，下面一行不起作用
//严格模式下回报错
foo.prop = 123
```

## ES6声明变量的方法有6种
- ES5 var命令  、function命令
- let，const命令
- import，class命令

## 顶层对象的属性
```javascript
window.a = 1
a // 1

a = 2
window.a  //  2
```

> 上面的代码中，顶层对象的属性赋值和全局变量的赋值是同一件事。顶层对象和全局变量相关是JavaScript设计的一大败笔。

> ES6为了改善这个问题，规定`let，const，import，class`命令声明的全局变量不属于顶层对象的属性。

```javascript
let a = 1
window.a // undefined
```