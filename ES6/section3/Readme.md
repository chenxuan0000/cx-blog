# 字符串的拓展

- [**`1.字符串的Unicode表示法`**](#字符串的unicode表示法)
- [**`2.includes()、startsWith()、endsWith()`**](#包含字符判断方法)
- [**`3.repeat`**](#repeat)
- [**`4.模板字符串`**](#模板字符串)
    

## 字符串的Unicode表示法
```javascript
// js有6种方法表示一个字符
'\z' === 'z' // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

### 包含字符判断方法
>  includes()、startsWith()、endsWith()
> 传统的只有indexOf()方法确定一个字符串是否包含在另一个中

```javascript
vas s = 'hello world'

s.includes('o') // true
s.startsWith('h') // true
s.endsWith('d') // true

// 第二个参数
s.startsWith('world', 6) // true
s.endsWith('hello', 5) // true
s.includes('hello', 6) // false
//使用第二个参数时endsWith的表示针对前n个字符，其他两个针对从第n个位置到字符串结束位置之间的字符
```

### repeat
> repeat方法返回一个新字符串，将原字符串重复n次

```javascript
'x'.repeat(3) // 'xxx'
'xx1'.repeat(0) // ''
'xx1'.repeat(2.9) // 'xx1xx1' 小数直接取整
'xx'.repeat(-2) // RangeError 参数是负数或者Infinity报错
'xx'.repeat(-0.7) // '' 参数(-1,0) 等同于0 因为会进行取整为 -0
'xx'.repeat(NaN) // '' 参数NaN等同于0
'xx'.repeat('nn') // '' 参数字符串会先转换为数字 'nn'=>NaN
``` 

### 字符串补全
> padStart()  padEnd()
> 第一个参数是指定字符串的最小长度，第二个参数是用来补齐的字符串
```javascript
'x'.padStart(4,'ab') // 'abax'
'x'.padEnd(4,'ab') // 'xaba'
'xxx'.padEnd(2,'ab') // 'xxx' 原字符串长度大于指定的最小长度，返回原字符串
'x'.padEnd(4) //'x   ' 省略第二个参数 默认用空格补齐

// padStart 常用于补齐指定位数
'123'.padStart(10,'0') // '0000000123'
```

### 模板字符串
```javascript
// 运算
var x = 1
var y = 2
`${x} + ${y+2} = ${x+y+2}` // 1 + 4 = 5

// 调用函数
function fn () {
  return 'chenxuan'
}
`i am ${fn()}`  // i am chenxuan
```