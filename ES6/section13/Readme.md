# Promise

- [**`1.Promise含义`**](#Promise含义)
- [**`2.Promise基本用法`**](#Promise基本用法)
- [**`3.Promise的API`**](#promise的api)
- [**`4.两个有用的附加方法`**](#两个有用的附加方法)
- [**`5.Promise实现加载图片`**](#promise实现加载图片)

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

## 两个有用的附加方法
### Promise.done()
> then和catch方法结尾，只要最后一个方法抛出错误（Promise的内部错误不会冒泡到全局）。我们提供一个done方法，他处于回调链末端，可以捕获到所有异常。
```javascript
asyncFunc().then().catch().then().done()

// 简单实现
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
  .catch(function (reason) {
    // 抛出一个全局错误
    setTimeout(() => { throw reason}, 0)
  })
}
```


### Promise.finally()
> finally方法用用指定不管Promise对象最后状态是什么都会执行的操作,于done不同是他可以接受一个普通的回调函数作为参数，并一定会执行。
```javascript
// 简单实现
Promise.prototype.finally = function (calback) {
  let p = this.constructor
  return this.then(
    val => p.resolve(calback().then(() => val)),
    reason => p.resolve(calback().then(() => { throw reason }))
  )
}
```


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


### Promise.try()
> 开发中经常遇到一种情况，不知道或者不想区分f是同步还是异步函数，但是想用Promise来处理它，这样不管f是否包含异步，都用then方法指定下一步流程，用catch方法来捕获错误。
```javascript
Promise.resolve().then(f)
// 上面写法有个缺点，如果f是同步函数，那么他会在本轮事件循环的末尾执行。(因为被Promise封装后变成了异步函数)
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next  now 
```

> 让同步函数同伴不执行，异步函数异步执行的方案
```javascript
// 方法1 async函数
// 同步函数
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now next

// 异步函数
 (async () => f())().then(...)

 // 注意async () => f() 会吃掉f()抛出的错误，如果要捕获错误要使用Promise.catch 方法。
 (async () => f())().then(...).catch(...)


 
// 方法2 new Promise()
const g = ()=> console.log('gg1');
(
  () => new Promise(
    resolve => resolve(g())
  )
)();
console.log('gg2')
//上面代码也是使用立即执行的匿名函数，执行new Promise()。这种情况下，同步函数也是同步执行的。
```

> 现在有个提案`Promise.try`方法来替代上面的写法
```javascript
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
//事实上，Promise.try存在已久，Promise 库Bluebird、Q和when，早就提供了这个方法。
```

```javascript
function getUsername(userId) {
  return database.users.get({id: userId})
  .then(function(user) {
    return user.name;
  });
}
// 上面代码中，database.users.get()返回一个 Promise 对象，如果抛出异步错误，可以用catch方法捕获，就像下面这样写。
database.users.get({id: userId})
.then(...)
.catch(...)
// 但是database.users.get()可能还会抛出同步错误（比如数据库连接错误，具体要看实现方法），这时你就不得不用try...catch去捕获。
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
//上面这样的写法就很笨拙了，这时就可以统一用promise.catch()捕获所有同步和异步的错误。
Promise.try(database.users.get({id: userId}))
  .then(...)
  .catch(...)
// 事实上，Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。
```
