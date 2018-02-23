# 数组的拓展

- [**`1.拓展运算符`**](#拓展运算符)
  - [**`1.1含义`**](#含义)
  - [**`1.2替代apply的方法`**](#替代apply的方法)
  - [**`1.3实际应用`**](#实际应用)
- [**`2.Array.from()`**](#类数组转换为数组)
- [**`2.Array.of()`**](#将一组值转换为数组)
    
## 拓展运算符

### 含义
>spread是一个三个点(...),他如同rest参数逆运算，将一个数组转换为用逗号分隔的参数序列
```javascript
console.log(1,...[2,3,4],5) // 1 2 3 4 5
//还可以放置表达式
const arr = [
  ...(x > 0? ['a'] : []),
  'b'
]
```

### 替代apply的方法
>由于拓展运算符可以展开数组，所以不需要使用apply方法将数组转换为函数的参数

*求数组的最大值*
```javascript
//es5写法
Math.max.apply(null,[14,3,77])
//es6写法
Math.max(...[14,3,77]) 
//等同于 Math.max(14,3,77) 
```

*添加一个数组到另一个尾部*
```javascript
//es5写法
Array.prototype.push.apply([1,2,3],[4,5])
//es6写法
[1,2,3].push(...[4,5])
```

### 实际应用

#### 合并数组
```javascript
var arr1 = [1,2,3]
var arr2 = [4,5,6]
var arr3 = [7,8,9]

//es5合并数组
arr1.concat(arr2,arr3)
//es6合并数组
[...arr1, ...arr2, ...arr3]
```

#### 与解构赋值结合
```javascript
const [first, ...rest] = [1, 2, 3, 4, 5]
first // 1
rest // [2,3,4,5]
//如果拓展运算符用于数组赋值，则只能将其放在参数的最后一位不然报错
const [...first,last] = [1,2,3] //报错
```

#### 字符串
```javascript
//将字符串转为真正的数组
[...'hello'] // ['h','e','l'.'l','o'] //es6
'hello'.split('') //es5
Array.from('hello') // es6
```

#### 实现了Iterator(迭代器)接口的对象
> 任何Iterator接口的对象都可以通过拓展运算符转换为真正的数组
```javascript
var nodeList = document.querySelectorAll('div') 
var array = [...nodeList] 

//没有部署Iterator接口的对象
let arrayLike = {
  '0': 'a',
  '1': 'b',
  length: 2
}
var array = [...arrayLike]  //TypeError: Cannot spread non-itertor object
//可以使用Array.form()转换为真正的数组
```

## 类数组转换为数组
> Array.from(): 类数组 => 真正的数组
```javascript
let arrayLike = {
  '0': 'a',
  '1': 'b',
  length: 2
}

// es5写法
var arr1 = [].slice.call(arrayLike) // ['a','b']
// es6写法
var arr1 = Array.from(arrayLike) // ['a','b']
```

> 拓展运算符背后调用的是遍历器接口(Symbol.iterator),如果没有部署该接口无法转换。Array.from方法还支持类数组对象，任何有length属性的对象都可以通过Array.from方法转换为数组。
```javascript
//下面的代码拓展运算符无法转换
Array.from({ length: 3})
// [undefined, undefined, undefined]
```

```javascript
// Array.from可以接受第二个参数,类似于数组的map方法
Array.from([1,3,5], x => x * x) // [1,9,25]

// 将数组中值为false的成员转换为0
Array.from([1,,2,4,,6], x => x || 0) // [1, 0, 2, 4, 0, 6]
```

## 将一组值转换为数组
> Array.of将一组值转换为数组,行为非常统一
```javascript
Array.of(2,3,4) // [2,3,4]
Array.of() // [] 无参数返回空数组
```

> 弥补Array()构造函数的不足,行为有差异
```javascript
Array()  // []
Array(3)  // [,,,]
Array(3,4,5)  // [3,4,5]
```