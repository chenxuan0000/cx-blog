# 对象的拓展

- [**`1.属性的简洁表示法`**](#属性的简洁表示法)
- [**`2.属性名表示式`**](#属性名表示式)
- [**`3.对象的常用API`**](#对象的常用API)
- [**`4.属性的可枚举性`**](#属性的可枚举性)
- [**`5.属性的遍历`**](#属性的遍历)
- [**`6.对象原型的设置和读取`**](#对象原型的设置和读取)
- [**`7.对象键值对遍历方法`**](#对象键值对遍历方法)
- [**`8.对象的拓展运算符`**](#对象的拓展运算符)
- [**`9.Null传导运算符`**](#null传导运算符)
    
## 属性的简洁表示法
```javascript
//属性简写
let foo = 'bar'
let baz = {foo} //{foo: 'bar'}

//方法简写
let o = {
  method() {
    return 1
  }
}
//等同于
let o = {
  method: function() {
    return 1
  }
}
```

## 属性名表示式
>javascript定义属性的两种方法
```javascript
//方法1
obj.foo = '123'
//方法2
obj.['a'+'bc'] = '123'
```

> 表达式用于定义方法名
```javascript
let obj = {
  ['h'+'o']() {
    return '222'
  }
}

obj.ho() // '222'
```

> 注意
```javascript
//属性名表达式和解决表示法不能同时使用，否则报错
var foo = 'bar' //报错
var bar = 'anc'
var baz = { [foo] } 

var foo = 'bar'
var baz = { [foo]:'abc' } 

```


```javascript
//属性名表达式如果是个对象，会自动转换为字符串[object Object]
const keyA = {a:1}
const keyB = {b:1}

const myObj = {
  [keyA]: 'a',
  [keyB]: 'b'
}

myObj // Object {[object Object]: 'b'}  keyA被keyB覆盖了
```

## 对象的常用API
### Object.is()
```javascript
//Object.is() 和 ===的不同之处
+0 === -0  // true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```


### Object.assign()
```javascript
var target = { a : 1 }
var sourse1 = { b : 2 }
var sourse2 = { c : 3 }
Object.assign(target,sourse1,sourse2) // {a:1,b:2,c:3}

//只有一个参数 返回本身
Object.assign(target) === target // true

// 第一个参数不能为undefined或者null因为他们无法转换为对象(参数不是对象会先转换为对象)
Object.assign(null) // 报错

//如果非对象出现在非源对象位置(非首参),不能转换为对象的会被跳过
Object.assign(target, null , undefined) === target // true
// 除了string其他类型的值都被忽略
Object.assign({}, 'abc' , true, 10) // {'0':'a','1':'b',2:'c'}
```

> 注意点
> 1.是浅复制不是深复制，即如果某个源对象的属性是对象，name目标对象复制得到的是这个对象的引用
```javascript
//修改原对象 复制的对象也会变
var obj1 = {a: {b: 2}}
var obj2 = Object.assign({},obj1)
obj1.a.b = 3
obj2.a.b  // 3

//属性的对象会被直接替换而不是合并
var obj1 = {a: {b: 2}}
var obj2 = {a: {c: 2}}
var obj2 = Object.assign(obj1,obj2)  // {a: {c: 2}}
```

> 常见用途
*为对象添加属性*
```javascript
class Point {
  constructor(x, y) {
    Object.assign(this, {x,y})
  }
}
new Point(3,4) //Point {x: 3, y: 4}
```

*为对象添加方法*
```javascript
Object.assign(SomeClass.prototype, {
  method1() {

  },
  method2() {

  }
})
//等同于
SomeClass.prototype.method1 = function () {}
SomeClass.prototype.method2 = function () {}
```
*克隆对象*
*合并多个对象*


## 属性的可枚举性
> Object.getOwnPropertyDescriptor方法获取该属性的描述对象
```javascript
let obj = { foo : 123}
Object.getOwnPropertyDescriptor(obj,'foo')
// {value: 123, writable: true, enumerable: true, configurable: true}
// enumerable 可枚举性 如果为false表示某些操作会忽略当前属性
// es5有三个操作会忽略 enumerable:false 的属性
// 1.for...in  2.Object.keys() 3.Json.stringify()
// es6 新增了一个Object.assign()
``` 

## 属性的遍历
> 共有5种方法可以遍历对象的属性

- 1.for...in
> 循环遍历对象自身和继承的可枚举属性(不含Symbol属性)

- 2.Object.keys()
> 返回一个数组，包含对象自身(不含继承)的可枚举属性(不含Symbol属性)

- 3.Object.getOwnPropertyNames()
> 返回一个数组，包含对象自身的所有属性(不含Symbol属性，但包含不可枚举属性)

- 4.Object.getOwnPropertySymbols()
> 返回一个数组，包含对象自身的所有Symbol属性

- 5.Reflect.ownKeys()
> 返回一个数组，包含对象自身的所有属性
```javascript
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0})
// ['2','10','b','a',Symbol()]
```

## 对象原型的设置和读取

### __proto__属性
> 读取和设置对象的prototype属性,目前所有浏览器包括（ie11）也支持。
```javascript
// es6写法
var aa = {}
var some1 = function() {}
aa.__proto__ = some1
// es5写法
var some1 = function() {}
var aa = Object.create(some1)
```
> 从语意和兼容性角度推荐用Object.setPrototypeOf() (写操作),Object.getPrototypeOf() (读操作)，Object.create() (生成操作)


### Object.setPrototypeOf()
> 设置一个对象的prototype对象，返回参数对象本身，es6推荐的设置原型对象的方法。
```javascript
let proto = {}
let obj = { x: 10}
Object.setPrototypeOf(obj, proto)
proto.y = 1
proto.z = 2

obj.x // 10
obj.y // 1
obj.z // 2
```

### Object.getPrototypeOf()
> 读取一个对象的prototype对象，返回参数对象本身，es6推荐的读取原型对象的方法。
```javascript
function Rectangle() {
  // ...
}
var rec = new Rectangle()
Object.getPrototypeOf(rec) === Rectangle.prototype  // true
```

## 对象键值对遍历方法
### Object.keys()
> 返回一个数组，参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。
```javascript
var obj = {foo: 'a', goo: 'b'}
Object.keys(obj) // ['foo','goo']
```


### Object.values()
> 返回一个数组，参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
```javascript
var obj = {100: 'a', 2: 'b',3:'c'}
Object.values(obj) // ['b','c','a']
Object.values('abc') // ['a','b','c']
Object.values(11) // []
Object.values(true) // []
```

### Object.entries()
> 返回一个数组，参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对。
```javascript
var obj = {foo: 'a', goo: 'b'}
Object.values(obj) // [['foo','a'],['goo','b']]
```


## 对象的拓展运算符
### 解构赋值
```javascript
let {x, y, ...z} = {x:1,y:2,a:3,b:4}
//x 1 y 2 z {a:3,b:4}

// null undefined无法转换为对象
let {x, y, ...z} = null //运行时报错
let {x, y, ...z} = undefined //运行时报错

//解构赋值是浅复制
let obj = {a:{b:2}}
let {...o} = obj
obj.a.b = 11
o.a.b // 11

// 解构赋值，不会复制原型对象上的属性
let obj1 = {a:1}
let obj2 = {b:2}
obj1.__proto__ = obj2
let {...o} = obj1
o // {a:1}

var u = Object.create({x:1,y:3})
u.z = 5
let {x,...{y,z}} = u
x // 1
y // undefined
z // 5
//x是普通解构赋值可以获取u继承对象的属性x，变量y，z是双重解构赋值，只能读取自身属性，所以z赋值成功
```

### 拓展运算符
>（...）用于取出参数对象所有的可遍历属性，并将其复制到当前对象之中。
```javascript
let z = {a:1,b:2}
let zClone = {...z} //{a:1,b:2}
//同于
let zClone = Object.assign({},z)

//上面只是复制了对象实例的属性，如果要完整clone个对象（包括原型属性）
//写法1 在非浏览器环境中不一定能部署
const clone1 = {
  __proto: Object.getPrototypeOf(obj),
  ...obj
}
//写法2 推荐
const clone1 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
)

//合并两个对象
let ab = {...a,...b} 
//等同于
let ab = Object.assign({},a,b)

//设置对象的默认值
let defaultOptions = {x:1,y:2,...a}
//等同于
let defaultOptions = Object.assign({},{x:1,y:2},a)

//可以带表达式
const obj = {
  ...(x > 1? {a:1}:{}),
  b: 2
}

// null,undefined被忽略 不报错
let emptyObj = {...null, ...undefined} //{} 不报错
```

## Null传导运算符
> 实际开发中，要读取对象内部的某个属性,如msg.a.b.c安全写法如下
````javascript
const c = (msg && msg.a && msg.a.b && msg.a.b.c) || 'default'

//提案 暂时不支持
const c = msg?.a?.b?.c || 'default'
```