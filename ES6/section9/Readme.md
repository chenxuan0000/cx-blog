# Symbol

- [**`1.概述`**](#概述)
- [**`2.作为属性名的Symbol`**](#作为属性名的symbol)
- [**`2.Symbol属性名的遍历`**](#symbol属性名的遍历)
    
## 概述
> ES5的属性名都是字符串，为了防止造成属性命名冲突，ES6映入了Symbol（原始数据类型），前6种分别是：Undefined，Null，Boolean，String，Number，Object。
> Symbol值通过Symbol函数生成
```javascript
let s = Symbol()
typeof s // 'symbol'
// 注：不能使用new命令，否则报错。是原始类型不是对象，无法添加属性，类似于String类型。
```

```javascript
let s1 = Symbol('foo') //Symbol(foo)
let s2 = Symbol('goo') //Symbol(goo)
// symbol的参数只表示对当前Symbol值的描述，相同参数的Symbol值不相等。
Symbol('foo') === Symbol('foo') // false
```

```javascript
//不能与其他类型值进行运算
let s1 = Symbol('foo') 
s1 + 's' //报错

//可以转换为String和Boolean，不可以转换为数值
String(s1) s1.toString()  //'Symbol(foo)'
Boolean(s1) // true
Number(s1) // TypeError
```

## 作为属性名的Symbol
> 作为属性名时是公开属性不是私有属性。
```javascript
var mySymbol = Symbol()
var a = {}

//第一种写法
a[mySymbol] = 'h'

//第二种写法
var a = {
  [mySymbol]: 'h'
}

//第三种写法
Object.defineProperty(a, mySymbol, {value: 'h'})

a.[mySymbol] // 'h'

//点运算符赋值无效 定义属性时必须放在[]中，因为他是字符串
a.mySymbol = 'h'
a[mySymbol] // undefined
a.mySymbol // 'h'
```

## Symbol属性名的遍历
> Symbol作为属性名，不会出现在for...in,for...of中,Object.keys(),Obejct.getOwnPropertyNames()也无法返回。
> 有一个Object.getOwnPropertySymbols()返回指定对象所有属性名
```javascript
var a = Symbol('a')
var b = Symbol('b')
obj = {
  [a] : 'h',
  [b] : 'l'
}
var names = Object.getOwnPropertySymbols(obj) // [Symbol(a), Symbol(b)]
```

> Reflect.ownKeys()可以返回所有类型的属性名
```javascript
obj = {
  [Symbol('g')] : 'h',
  aa : 'l',
  nn : 'i'
}
var names = Reflect.ownKeys(obj) // (3) ["aa", "nn", Symbol(g)]
```
