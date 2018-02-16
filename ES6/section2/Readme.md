## 内容

- [**`1.数组的解构赋值`**](#数组的解构赋值)
    - [**`1.1 基本用法`**](#基本用法)
    - [**`1.2 默认值`**](#默认值)
- [**`2.对象的解构赋值`**](#对象的解构赋值)
- [**`3.字符串的解构赋值`**](#字符串的解构赋值)
- [**`4.数值和布尔的解构赋值`**](#数值和布尔的解构赋值)
- [**`5.函数参数的解构赋值`**](#函数参数的解构赋值)
- [**`6.圆括号的问题`**](#圆括号的问题)
- [**`7.用途`**](#用途)
    - [**`7.1 交换变量的值`**](#交换变量的值)
    - [**`7.2 从函数返回多个值`**](#从函数返回多个值)
    - [**`7.3 提取json数据`**](#提取json数据)
    
    
    

# 数组的解构赋值

### 基本用法

*ES6允许安装一定模式从数组和对象中提取值，然后对变量进行赋值，称为解构（Destructuring）。*

```javascript
// 以前赋值
let a = 1
let b = 2
let c = 3

// ES6可以写成这样
let [a, b, c] = [1, 2, 3]
```

*some example*

```javascript
let [head, ...tail] = [1, 2, 3, 4]
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = [1]
x // 1
y // undefined
z // []

// 解构不成功 以下foo都是undefined
let [foo] = []
let [bar, foo] = [1]

// 可以成功的不完全解构
let [x, y] = [1, 3, 4]
x  // 1
y  // 3

// 等号右边不是数组(严格来说不是可以遍历结构) 报错
let [foo] = 1 || false || NaN || undefined || null || {}

// set 结构可以解构
let [x, y, z] = new Set(['a', 'b', 'c'])
y // 'b'

// 事实上只要某种数据结构具有Iterator接口，即可解构
// **此处我比较疑惑先标记**
function* fibs () {
  let a = 0
  let b = 1
  while (true) {
    yield a
    [a, b] = [b, a + b]
  }
}

let [one, two, three, four, five, six] = fibs()

six // 5
```

### 默认值

```javascript
let [x, y = 'b'] = ['1',undefined]  // x '1' y 'b'
```

***注意**ES6内部使用(===)判断是否有值,所以如果一个数组成员不严格=undefined,默认值不会生效*
```javascript
let [x = 1] = [null]  // x  null

// 如果默认值是个表达式,那么就是惰性求值，即只有在用到的时候才会求值
function f1 () {
  console.log('aaa')
}

let [foo = f1()] = [1] 
// 因为x可以取到值f1不会被执行

// 默认值可以引用解构赋值的其他变量，但是这个变量必须已经声明
let [x = 1,y = x] = [2] // x 2 y 2
let [x = y, y = 1] = [] // ReferenceError 引用错误
```

# 对象的解构赋值

```javascript
let {foo, bar , fee} = {foo: 'foo',bar: 'bar'}
foo // 'foo'
fee // undefined

// 变量名和属性名不一样
let {first: f, last: l} = {first: 'hello', last: 'world'}
// f 'hello'
// l 'world'

// 对象解构的全写 内部机制是先找到同名属性，然后赋值给对应的变量。真正被赋值的是后者不是前者
let {foo: foo, bar: bar} = {foo: 'aaa', bar: 'bbb'}

let {foo: baz} = {foo: '111'}
baz // '111'
foo // error: foo is not defined
```

```javascript
var node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
}

var {loc, loc: { start }, loc: {start: { line }}} = node
loc // Object {start: Object}
start // Object {line: 1, column: 5}
line // 1

//上面代码的三次解构，最后一次对line属性的解构，只要line是变量，loc和start都是模式不是变量。

//默认值
var {x: y = 4} = {} // y 4
var {x: y = 4} = {x: 5} // y 5
```

*注意一个已经声明的变量用于解构要小心*
```javascript
let x
{x} = {x:1} //SyntaxError 将会把{x}解析为代码块发生语法错误

let x
({x} = {x:1}) //right

// 解构
let {abs, floor} = Math
```

# 字符串的解构赋值
```javascript
// 字符串也可以解构英文此时字符串被转换成一个类似数组的对象
const [a, b, c, d] = 'hello'
a // 'h'
b // 'e'
const {length: len} = 'hello'
len // 5
```

# 数值和布尔的解构赋值
> 如果等号右边是数组和布尔会被先转换为对象
```javascript
//undefined,null 无法转为对象会直接报错
let {prop: x} = undefined
let {prop: y} = null
```

# 函数参数的解构赋值
```javascript
function add([x,y]) {
  return x + y
}
add(1,2) // 3

//函数参数解构默认值
function move({x = 0, y = 0} = {}) {
  return [x, y]
}

move({x:3, y:8}) // [3,8]
move({x:3}) // [3,0]
move({}) // [0,0]
move() // [0,0]

//注意下面的解构结果不太一样
function move({x, y} = {x: 0, y: 0}) {
  return [x, y]
}
move({x:3, y:8}) // [3,8]
move({x:3}) // [3,undefined]
move({}) // [undefined0,undefined0]
move() // [0,0]
//这个是为move的参数指定默认值 和之前的不一样
```

# 圆括号的问题
```javascript
// 能使用圆括号的情况 赋值语句的非模式部分
({ p: (d) } = {}) // right

// 不能使用的情况举例几个
//函数参数
function f([(z)]) { return z }  // error
//赋值语句模式
({ p: d }) = {} // right
```

# 用途

### 交换变量的值
```javascript
let x = 1
let y = 2
[x, y] = [y, x]
```

### 从函数返回多个值
```javascript
function example () {
  return [1, 2, 3]
}
let [a, b, c] = example()
```

### 提取json数据
```javascript
let jsonData = {
  code: 0,
  data: {
    a: 1,
    b: 2
  }
}

let {code, data} = jsonData
code // 0
data // {a: 1, b: 2}
```