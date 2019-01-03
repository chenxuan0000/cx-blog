# Promise

- [**`1.hash的前端路由实现`**](#hash的前端路由实现)

```javascript
// myPromise
function Promise(executor){ //executor是一个执行器（函数）
    let _this = this // 先缓存this以免后面指针混乱
    _this.status = 'pending' // 默认状态为等待态
    _this.value = undefined // 成功时要传递给成功回调的数据，默认undefined
    _this.reason = undefined // 失败时要传递给失败回调的原因，默认undefined
    _this.onResolvedCallbacks = []; // 存放then成功的回调
    _this.onRejectedCallbacks = []; // 存放then失败的回调
    function resolve(value) { // 内置一个resolve方法，接收成功状态数据
        // 上面说了，只有pending可以转为其他状态，所以这里要判断一下
        if (_this.status === 'pending') { 
            _this.status = 'resolved' // 当调用resolve时要将状态改为成功态
            _this.value = value // 保存成功时传进来的数据
            _this.onResolvedCallbacks.forEach(function(fn){ // 当成功的函数被调用时，之前缓存的回调函数会被一一调用
                fn()
            })
        }
    }
    function reject(reason) { // 内置一个reject方法，失败状态时接收原因
        if (_this.status === 'pending') { // 和resolve同理
            _this.status = 'rejected' // 转为失败态
            _this.reason = reason // 保存失败原因
             _this.onRejectedCallbacks.forEach(function(fn){// 当失败的函数被调用时，之前缓存的回调函数会被一一调用
                fn()
            })
        }
    }
    try{
        executor(resolve, reject)        
    } catch(e){ // 如果捕获发生异常，直接调失败，并把参数穿进去
        reject(e)
    }
}

// then方法接收两个参数，分别是成功和失败的回调，这里我们命名为onFulfilled和onRjected
Promise.prototype.then = function(onFulfilled, onRjected){
    //成功和失败默认不传给一个函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value
    }
    onRjected = typeof onRjected === 'function' ? onRjected: function (err) {
        throw err
    }
    let _this = this;   // 依然缓存this
    let promise2; //返回的promise
    if(_this.status === 'resolved'){  // 判断当前Promise的状态
        promise2 = new Promise(function (reslove, reject) {
            // 当成功或者失败执行时有异常那么返回的promise应该处于失败状态
            setTimeout(function() { // 根据规范让那俩家伙异步执行
                try {
                    let x = onFulfilled(_this.value);
                    // 写一个方法统一处理问题
                    resolvePromise(promise2, x, resolve, reject);
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
    if(_this.status === 'rejected'){ // 同理
        promise2 = new Promise(function (reslove, reject) {
            setTimeout(function() { 
                try {
                    let x = onRjected(_this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
    if(_this.status === 'pending'){
        promise2 = new Promise(function (reslove, reject) {
            _this.onResolvedCallbacks.push(function(){ // 这里用一个函数包起来，是为了后面加入新的逻辑进去
                setTimeout(function() { 
                    try {
                        let x = onFulfilled(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                })
            })
            _this.onRejectedCallbacks.push(function(){ 
                setTimeout(function() { 
                    try {
                        let x = _this(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // 接受四个参数，新Promise、返回值，成功和失败的回调
    // 有可能这里返回的x是别人的promise
    // 尽可能允许其他乱写  前一次then返回的是自己本身这个Promise
    // var p1 = p.then(function(){
    //     return p1  
    // })
    if (promise2 === x) {
        return reject(new TypeError('循环引用了！！！'))
    }
    let called 
    if (x !== null && (typeof x === 'object' && typeof x === 'function')) {
        // 可能是promise {},看这个对象中是否有then方法，如果有then我就认为他是promise了
        try {
            let then = x.then;// 保存一下x的then方法
            if (typeof then === 'function') {
                // 成功
                //这里的y也是官方规范，如果还是promise，可以当下一次的x使用
                //用call方法修改指针为x，否则this指向window
                then.call(x, function (y) {
                    if (called) return //如果调用过就return掉
                    called = true
                    // y可能还是一个promise，在去解析直到返回的是一个普通值
                    resolvePromise(promise2, y, resolve, reject)//递归调用，解决了问题6
                }, function (err) { // 失败
                    if (called) return
                    called = true
                    reject(err)
                })
            }
        } catch (e) {
            if (called) return
            called = true
            reject(err)
        }
    } else {
        // 说明是普通值
        resolve(x)
    }
}

// module.exports = Promise  // 导出模块，否则别的文件没法使用

```