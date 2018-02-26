# Promise

- [**`1.Promise含义`**](#Promise含义)
- [**`2.Promise基本用法`**](#Promise基本用法)
- [**`3.Promise的API`**](#promise的api)
- [**`4.Promise实现加载图片`**](#promise实现加载图片)

## Promise含义
> 异步编程的一种解决方案。简单来说是个容器里面保存了某个未来才会结束的事情。

*特点*
- 对象的状态不受外界影响，代表异步操作，有Pending（进行中），Fulfilled（已成功），和Rejected（已失败）三种状态。
- 一旦状态改变就不会在变，Promise对象的状态只有两种可能，Pending => Fulfilled 和从ending => Rejected。只要发生了这两种情况，就不会在变称为Resolved（已定型）。

> 后面Resolved统一表示Fulfilled（已成功）状态，不包含Rejected状态。

## Promise基本用法
```javascript
//生成Promise实例
var Promise = new Promise((resolve, reject) => {
  if(/*成功*/) {
    resove('success')
  } else {
    reject('error')
  }
})

Promise.then((val) => {
  // success
},(err) => {
  // failure
})

// example
function time(ms) {
  return new Promise((resolve,reject) => {
    setTimeout(resolve,ms,'done')
  })
}
time(1000).then((val) => {
  console.log(val)
})
// Promise {<pending>}
// 'done'
```

> 异步加载图片的例子
```javascript
function loadImageAsync(url) {
  return new Promise((resolve,reject) => {
    var img = new Image()
    img.onload = function() {
      resolve(img)
    }

    img.onerror = function() {
      reject(new Error('load img fail'))
    }
    img.src = url
  })
}
```

> p2用p2返回结果
```javascript
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('uuu'),2000)
})
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(p1),1000)
})
p2.then((res) => console.log(res)) // 'uuu'
```

> resolve,reject不会终结后面的执行，除非加return
```javascript
new Promise((resolve, reject) => {
  resolve(1)
  console.log(2)
}).then(r => {
  console.log(r)
})
// 2 
// 1
new Promise((resolve, reject) => {
  return resolve(1)
  // 不会执行了下面的
  console.log(2)
})
```

## promise的api

### Promise.all()
> 将多个Promise实例包装成一个新的Promise实例。
```javascript
var z = Promise.all([a, b, c])
// 接受一个数组，a，b，c都是Promise实例，如果不是会先调用Promise.resolve方法。
```

>a,b,c只有全部变为Fulfilled，z才会变成Fulfilled；a,b,c有一个Rejected，此时第一个被Rejected的实例的返回值会传递给p的回调函数。

### Promise.race()
> 将多个Promise实例包装成一个新的Promise实例。
```javascript
var z = Promise.race([a, b, c])
// 只要a，b，c中有一个实例状态率先发生变化就会返回z

//例子 指定时间没有返回结果，就将Promise的状态变为Rejected，否则Resolved
const p = Promise.race([
  fetch('/aaa'),
  new Promise((resolve,reject) => {
    setTimeout(() => reject(new Error('request timeout')),5000)
  })
])
//上面代码如果5sfetch无法返回结果，p就会变成Rejected。
```

### Promise.resolve()
> 将现有对象转换为状态为Resolved的Promise对象
```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

#### 参数是一个Promise实例
> 原封不动返回

#### 参数是一个thenable对象
> 指有then方法的对象，比如下面这个对象
```javascript
let thenable = {
  then : function (resolve, reject) {
    resolve(42)
  }
}
// Promise.resolve(thenabl)会将这个thenabl先转换为Promise对象，然后立即执行它的then方法
```

#### 参数不是then方法的对象或者根本不是一个对象
> 返回一个新的Promise对象，状态为Resolved
```javascript
var p = Promise.resolve('foo')
p.then(s => console.log(s)) // 'foo'
```


#### 无参数
> 返回一个状态为Resolved的Promise对象
```javascript
setTimeout(() => {
  console.log(1)
},0)

Promise.resolve().then(() => {
  console.log(2)
})

console.log(3)

// 3 2 1

// 上面的setTimeout是在下一轮事件循环中开始执行的，Promise.resolve()在本轮事件循环中执行，console.log(3)立即执行。
```


### Promise.reject()
> 将现有对象转换为状态为Rejected的Promise对象
```javascript
var p = Promise.reject('error')
// 等价于
var p = new Promise(reject => reject('error'))

p.then(null, err => {
  console.log(err)
})
// 'error'
```

> Promise.reject()的参数作为reject的理由返回，这点与Promise.resolved()不一致。


## promise实现加载图片
```javascript
const preloadImage = function (path) {
  return new Promise((resolve,reject) => {
    let image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = path
  })
}
```