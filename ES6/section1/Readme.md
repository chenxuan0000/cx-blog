# **let**
### 1.不存在变量提升
```javascript
// var
console.log(foo) // 输出undefined
var foo = 2

// let
console.log(bar) // 输出ReferenceError
let bar = 2
```

### 2.暂时性死区(temporal dead zone 简称TDZ)

*在代码块内(块级作用域)，使用let命名变量之前，该变量都是不可用的*
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

### 3.不允许重复声明
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
