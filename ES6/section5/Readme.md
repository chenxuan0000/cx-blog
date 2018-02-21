# 数值的拓展

- [**`1.二进制和八进制表示法`**](#二进制和八进制表示法)
- [**`2.Number对象的拓展`**](#Number对象的拓展)
- [**`3.Math对象的拓展`**](#Math对象的拓展)
    

## 二进制和八进制表示法
> 分别用前缀0b(或0B)和0o(或0o)表示 

```javascript
0b111110111 === 503 // true
0o767 === 503 // true

// ES5开始，严格模式下8进制不允许在使用前缀0表示，ES6表明需要使用前缀0o表示。
// 转换为10进制 Number
Number('0b111') // 7
```


## Number对象的拓展

### Number.isFinite()/Number.isNaN()
>与传统的isFinite()/isNaN()区别在于，传统的先调用Number()将非数值转为数值，在进行判断。而新方法只对数值有效

```javascript
isFinite(25) // true
isFinite('25') // true
Number.isFinite(25) // true
Number.isFinite('25') // false 不会转换

isNaN(NaN) // true
isNaN('NaN') // true
Number.isNaN(NaN) // true
Number.isNaN('NaN') // false
```

### Number.parstInt()/Number.parstFloat()
> 和parstInt()/parstFloat()行为一样，目的是为了减少全局性方法，使得语言模块逐步统一化。

### Number.isInteger()
> 判断一个值是否为整数 ,3 3.0被视为同一个值
```javascript
Number.isInteger(3) // true
Number.isInteger(3.0) // true
Number.isInteger(3.1) // false
```

### Number.EPSILON
> ES6新增了一个极小的常量,为了设置一个浮点数计算的误差范围,0.1+0.2会有精度丢失
```javascript
Number.EPSILON //2.220446049250313e-16
0.1 + 0.2  // 0.30000000000000004

// 误差检查函数
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON
}

withinErrorMargin(0.1+0.2,0.3) // true
withinErrorMargin(0.2+0.2,0.3) // false
```

### 安全整数和Number.isSafeInteger()
```javascript
Number.MAX_SAFE_INTEGER //9007199254740991
Number.MIN_SAFE_INTEGER //-9007199254740991

//Number.isSafeInteger() 判断一个整数是否落在这个范围内
Number.isSafeInteger('a')  // false
Number.isSafeInteger(1.2)  // false
Number.isSafeInteger(Infinity)  // false
```

## Math对象的拓展

### Math.trunc()
>取整,对于非数值会先调用Number()方法
```javascript
Math.trunc('11.1') // 11
Math.trunc('s') // NaN

// parseInt() 和 Math.trunc()区别
// 在数字极大或是极小时候，会自动采用科学计数法时候，parseInt是会有问题的。
console.log(parseInt(6.022e23)); // 6
console.log(Math.trunc(6.022e23)); // 6.022e+23
// 虽然功能上可能对于部分结果一致，但是其作用是不一样的。
// parseInt在实际运用上经常会出一些问题，比如0X或是0开头就会出现解析为十六进制或八进制的问题，虽然你可能本意是转换为十进制，但是后端传递值或是用户输入并不会和你想象的一样。
// Math.trunc在ES6更多的是为了补足floor,round,ceil这一系列的方法，以及可想而知，在Math.trunc适用的领域，其性能会比parseInt好不少。
```

> 兼容
```javascript
Math.trunc = Math.trunc || function (x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x)
}
```


### Math.sign()
>判断一个数是正数/负数/零,对于非数值会先转换为数值
```javascript
 Math.sign(11) // 1
 Math.sign(-11) // -1
 Math.sign(0) // 0
 Math.sign(-0) // -0
 Math.sign('9') // 1
 Math.sign('s') // NaN
```
> 兼容
```javascript
Math.sign = Math.sign || function (x) {
  x = +x //转为Number
  if(x === 0 || isNaN(x)) {
    return x
  }
  return x > 0 ? 1 : -1
}
```

### Math.cbrt()
>计算一个数的立方根,对于非数值会Number()先转换为数值
```javascript
Math.cbrt(-1) // -1
Math.cbrt('8') // 2
Math.cbrt('s') // NaN
```
> 兼容
```javascript
Math.cbrt = Math.cbrt || function (x) {
 var y = Math.pow(Math.abs(x), 1/3)
 return x < 0 ? -y :y
}
```


### Math.hypot()
>返回所有参数的平方和的平方根
```javascript
Math.hypot(3, 4)  // 5
Math.hypot('3', '4')  // 5
Math.hypot(3, 4, 's')  // NaN
```
