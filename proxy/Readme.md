## 代理模式

### 简述
> 代理模式是为一个对象提交一个代用品或占位符，以便控制对它的访问。

> 使用代理的原因是我们不愿意或者不想对原对象进行直接操作，我们使用代理就是让它帮原对象进行一系列的操作，等这些东西做完后告诉原对象就行了。就像我们生活的那些明星的助理经纪人一样。

```js
// 不使用代理
客户 => 本体

// 使用代理
客户 => 代理 => 本体
```

我们举一个目前 `Echarts` 图表库相关的例子

1.使用原生 `Echarts`

```js
// 定义一个chart类
var chartModule = function(name){
	this.name = name;
};

chartModule.prototype.getName = function() {
	return this.name;
};

// 定义一个unicorn对象
var unicorn = {
	init: function(chart) {
		console.log('绘制' + chart.getName());
	}
}

unicorn.init(new chartModule('折线图')); // "绘制折线图"
```

接入图表库，和 `Echarts` 之间的事情转交给图表库处理。

```js
// 定义一个chart类
var chartModule = function(name){
	this.name = name;
};

chartModule.prototype.getName = function() {
	return this.name;
};


// 定义一个unicorn对象
var unicorn = {
	init: function(name) {
		console.log('绘制' + name);
	}
}

// 定义一个rocketChart对象
var rocketChart = {
	init: function(chart) {
		unicorn.init(chart.draw())
	}
};

rocketChart.init(new chartModule('折线图')); // "绘制折线图"
```

### 保护代理
图表库作为` Unicorn` 的代理，不仅可以帮助` Unicorn` 快速配置生成图表，同时还有帮助` Unicorn` 拦截一些异常行为。

```js
// 定义一个chart类
var chartModule = function(params){
    this.name = params.name;
	this.points = params.points;
};

chartModule.prototype.getName = function() {
	return this.name;
};

chartModule.prototype.getPoints = function() {
	return this.points;
};

// 定义一个unicorn对象
var unicorn = {
	init: function(name) {
		console.log('绘制' + name);
	}
}

// 定义一个rocketChart对象
var rocketChart = {
	init: function(chart) {
        if (chart.getPoints() > 1500) {
            cconsole.error('点太多了')
        } else {
		    unicorn.init(chart.getName())
        }
	}
};

rocketChart.init(new chartModule({
    name: '500点的折线图',
    points: 500
})); // "绘制折线图"

rocketChart.init(new chartModule({
    name: '1700点的折线图',
    points: 1700
})); // "点太多了"
```


### 虚拟代理
将一些开销很大的操作，留在真正需要的时候再执行——这是常用的代理模式。


图片预加载
先设置一个本体对象，它的职责是：
- 往页面创建一个 `img` 节点
- 对外暴露 `setSrc` 方法，调用这个方法可以设置节点的图片资源

```js
const myImage = (() => {
    const imgNode = document.createElement('img')
    document.appendChild(imgNode)

    return {
        setSrc(src){
            imgNode.src = src
        }
    }
})()

// 直接调用本体的方法创建img节点并设置图片资源
myImage.setSrc('http://network/imguri')
```

假设执行代码的网络环境非常差，这个图片资源体积比较大，在加载资源的这段时间内就会出现持续空白，用户体验差。web应用常见的处理方式是在加载时展示占位图片。

那就创建一个替代对象来做这件事：

```js
// myImage 实现不变

const proxyImage = (() => {
    const img = new Image
    img.onload = () => {
        myImage.setSrc(this.src)
    }
    return {
        setSrc(src){
            myImage.setSrc('file://local/imgFile')
            img.src = src
        }
    }
})()

// 通过proxyImage间接访问myImage
proxyImage.setSrc('http://network/imguri')
```

虽然上面这么写多了一个对象的创建和引用的成本，但是遵从了一个基本的面向对象设计原则——单一职责原则。


### 缓存代理

1、创建乘积计算器

```js
const mult = () => {
    let a = 1;
    for(let i = 0, l = arguments.length; i < l; i++){
        a = a * arguments[i]
    }
    return a
}
```

2、创建代理函数，函数的作用是缓存计算结果

```js
const proxyMult = (() => {
    const cache = {}
    return () => {
        let args = Array.prototype.join.call(arguments, ',')
        if(args in cache){
            return cache[args]
        }
        return cache[args] = mult.apply(this, arguments)
    }
})()
```
重复调用的时候，代理代替本体返回了之前缓存的结果。本体专注计算乘积，代理实现缓存。当然对于判断是否读取缓存的逻辑可以进行优化，毕竟 `2*3 = 3*2`。


高阶函数动态创建代理

```js
// 创建缓存代理的工厂
const createProxyFactory = (fn) => {
    const cache = {};

    return () => {
        let args = Array.prototype.join(arguments, ',');
        if(args in cache){
            return cache[args]
        }
        return cache[args] = fn.apply(this, arguments)
    }
}

const proxyMult = createProxyFactory(mult)
```

### 其他代理模式
简单介绍其他常见的代理模式
- 防火墙代理：控制网络资源的访问，保护主机不被侵害
- 远程代理：为一个对象在不同地址空间提供局部代表
- 保护代理：处理不同访客权限的访问逻辑
- 智能引用代理：取代简单的指针，在访问对象的时候附加一些其他的逻辑，例如统计访问次数
- 写时复制代理：通常用于复制一个庞大对象的情况。写时代理其实是延迟了复制的时机，只有被复制对象被修改的时候才真正进行复制操作，其实是虚拟代理的一种变体。DLL是典型的运用场景


### 优点
- 代理模式能够协调调用者和被调用者，在一定程度上降低了系 统的耦合度。
- 虚拟代理通过使用一个小对象来代表一个大对象，可以减少系 统资源的消耗，对系统进行优化并提高运行速度。
- 保护代理可以控制对真实对象的使用权限。


### 缺点
- 由于增加了代理对象，因此 有些类型的代理模式可能会造成请求的处理速度变慢。
- 实现代理模式需要额外的工作，有些代理模式的实现 非常复杂。
