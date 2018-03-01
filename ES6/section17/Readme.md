# Module的加载实现

- [**`1.浏览器加载`**](#浏览器加载)
- [**`2.ES6 模块与 CommonJS 模块的差异`**](#es6模块与commonjs模块的差异)
- [**`3.内部变量`**](#内部变量)


ES6 模块与 CommonJS 模块的差异 

## 浏览器加载
### 传统方法
> 默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到<script>标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。

```javascript
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
//defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。
```

### ES6模块
> 浏览器加载 ES6 模块，也使用<script>标签，但是要加入type="module"属性。
```javascript
<script type="module" src="./foo.js"></script>

<script type="module">
  import utils from "./utils.js";

  // other code
</script>
```

### es6模块与commonjs模块的差异
>它们有两个重大差异。
- 1.CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- 2.CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
> 第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
> 下面重点解释第一个差异。

> CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件lib.js的例子。
```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
// 上面代码输出内部变量counter和改写这个变量的内部方法incCounter。然后，在main.js里面加载这个模块。

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

// 上面代码说明，lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。这是因为mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
//上面代码中，输出的counter属性实际上是一个取值器函数。现在再执行main.js，就可以正确读取内部变量counter的变动了。
```

> ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

## 内部变量
> 以下这些顶层变量在 ES6 模块之中都是不存在的。
- arguments
- require
- module
- exports
- __filename
- __dirname

