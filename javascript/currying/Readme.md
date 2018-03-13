# 函数柯理化

> 柯里化（Currying），又称部分求值（Partial Evaluation），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

## 常用三个用途

### 1.参数复用
```javascript
var currying = function(fn) {
    // fn 指官员消化老婆的手段
    var args = [].slice.call(arguments, 1);
    // args 指的是那个合法老婆
    return function() {
        // 已经有的老婆和新搞定的老婆们合成一体，方便控制
        var newArgs = args.concat([].slice.call(arguments));
        // 这些老婆们用 fn 这个手段消化利用，完成韦小宝前辈的壮举并返回
        return fn.apply(null, newArgs);
    };
};

// 下为官员如何搞定7个老婆的测试
// 获得合法老婆
var getWife = currying(function() {
    var allWife = [].slice.call(arguments);
    // allwife 就是所有的老婆的，包括暗渡陈仓进来的老婆
    console.log(allWife.join(";"));
}, "合法老婆");

// 获得其他6个老婆
getWife("大老婆","小老婆","俏老婆","刁蛮老婆","乖老婆","送上门老婆");

// 换一批老婆
getWife("超越韦小宝的老婆");
```

### 2.提前返回
```javascript
// 通常写法
var addEvent = function(el, type, fn, capture) {
  if(window.addEventListener) {
    el.addEventListener(type, function(e) {
      fn.call(el,e);
    },capture);
  } else if (window.attachEvent) {
    el.attachEvent("on"+type,function(e) {
      fn.call(el,e);
    });
  }
};

// 很显然，我们每次使用addEvent为元素添加事件的时候，(eg. IE6/IE7)都会走一遍if...else if ...，其实只要一次判定就可以了，怎么做？–柯里化。改为下面这样子的代码：

var addEvent = (function(){
    if (window.addEventListener) {
        return function(el, sType, fn, capture) {
            el.addEventListener(sType, function(e) {
                fn.call(el, e);
            }, (capture));
        };
    } else if (window.attachEvent) {
        return function(el, sType, fn, capture) {
            el.attachEvent("on" + sType, function(e) {
                fn.call(el, e);
            });
        };
    }
})();
```


### 3.延迟计算
```javascript
var averageWeight = 0;
var addWeight = curryWeight(function() {
    var i=0; len = arguments.length;
    for (i; i<len; i+=1) {
        averageWeight += arguments[i]/len;
    }
});

addWeight(2.3);
addWeight(6.5);
addWeight(1.2);
addWeight(2.5);
addWeight();    //  这里才计算

console.log(averageWeight);    // 3.125

// es5的bind方法
var obj = {
    "name": "currying" 
},
fun = function() {
    console.log(this.name);
}.bind(obj);

fun(); // currying


// IE6~8的自定义扩展
if (!function() {}.bind) {
    Function.prototype.bind = function(context) {
        var self = this
            , args = Array.prototype.slice.call(arguments);
            
        return function() {
            return self.apply(context, args.slice(1));    
        }
    };
}
```