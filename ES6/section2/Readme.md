# 1.**数组的解构赋值**

### 1.1 基本用法

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

### 1.2 默认值

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

# 2.**对象的解构赋值**

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
