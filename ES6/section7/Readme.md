# 数组的拓展

- [**`1.拓展运算符`**](#拓展运算符)
  - [**`1.1含义`**](#含义)
  - [**`1.2替代apply的方法`**](#替代apply的方法)
  - [**`1.3实际应用`**](#实际应用)
- [**`2.Array.from()`**](#类数组转换为数组)
- [**`3.Array.of()`**](#将一组值转换为数组)
- [**`4.Array常用api`**](#array常用api)
    
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

## array常用api

### find()和findIndex()
> find()找出第一个返回条件的数组成员并返回，没有符合的返回undefined
```javascript
[1, 4, -1 , 10].find( n => n < 0)  // -1
[1, 4, -1 , 10].find( n => n < -2)  // undefined
[1, 4, -1 , 10].find((val,index,arr) => {
  return val > 9
})  // 9
```

> findIndex()找出第一个返回条件的数组成员的位置并返回，没有符合的返回-1
```javascript
[1, 4, -1 , 10].findIndex( n => n < 0)  // 2
[1, 4, -1 , 10].findIndex( n => n < -2)  // -1
[1, 4, -1 , 10].findIndex((val,index,arr) => {
  return val > 9
})  // 3
```

> 另外这两个方法可以用来方法NaN,弥补数组indexOf方法的不足
```javascript
[NaN].indexOf(NaN) // -1
[NaN].findIndex( y => Object.is(NaN, y)) // 0
//Object.is(value1, value2); 判断是否为同一个值
```

### fill()
> 给定值填充一个数组
```javascript
['a', 'b', 'c'].fill(7) //[7, 7, 7]
['a', 'b', 'c'].fill(7, 1, 2) //['a', 7, 'b']
//fill方法从一号位开始向原数组填充7，到二号位之前结束。
```

### 数组实例的entires(),keys(),values()
> 用于遍历数组，返回一个遍历器对象，可以用于for...of循环遍历。唯一的区别是keys是对键名的遍历，values是对键值的遍历，entires是对键值对的遍历。
```javascript
for(let index of [1,2].keys()){
  console.log(index)
} // 0  1

for(let elem of ['b','c'].values()){
  console.log(elem)
} // 'b' 'c'
for(let [index, elem] of ['b','c'].entries()){
  console.log(index,elem)
} 
// 0 'b'
// 1 'c'
```

### includes()
> 返回一个Boolean，表示某个数组是否包含给定的值
```javascript
[1,2,NaN].includes(NaN) // true
```

>第二个参数为搜索开始位置，默认为0，是负数表示倒数的位置
```javascript
[1,2,3,4].includes(3,3) // false
[1,2,3,4].includes(3,-1) // false
```