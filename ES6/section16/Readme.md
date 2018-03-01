# Module的语法

- [**`1.概述`**](#概述)
- [**`2.严格模式`**](#严格模式)
- [**`3.export`**](#export)
- [**`4.import`**](#import)
- [**`5.模块的整体加载`**](#模块的整体加载)
- [**`6.export default`**](#exportdefault)
- [**`7.export 与 import 的复合写法`**](#export与import的复合写法)
- [**`8.跨模块常量`**](#跨模块常量)
- [**`9.import()`**](#import)


## 概述
> CommonJs模块
```javascript
let {stat, exists, readFile } = require('_fs')
//等同于
let fs =  require('_fs')
let stat = fs.stat
let exists = fs.exists
let readFile = fs.readFile
//加载所有方法fs，然后在从这个对象上读取三个方法。这种加载称为运行时加载，只有在运行时得到这个对象，导致无法在编译时，进行静态优化。
```


> ES6模块
```javascript
import {stat, exists, readFile } from '_fs'
//从_fs中加载三个方法，不加载其他方法，这种叫做“编译时加载”(静态加载)。效率较高，导致ES6模块无法被引用因为他不是对象。
```

## 严格模式
> ES6的模块自动采用严格模式，不管有没有显示的加上'use strict'
> 严格模式主要有下面的限制
- 1.变量必须声明后在使用
- 2.函数参数不能同名
- 3.不能用with语句
- 4.不能对只读属性赋值
- 5.不能使用前缀为0表示8进制
- 6.不能删除不可以删除属性
- 7.不能删除变量delete prop,会报错，只能删除属性delete golbal[prop]
- 8.eval不会在他的外层作用域引入变量
- 9.eval和arguments不能被重新赋值
- 10.arguments不能自动反应参数的变化
- 11.不能使用arguments.callee和arguments.caller方法
- 12.禁止this指向全局对象
- 13.不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 14.增加了保留字（protected,static,interface）
> 尤其注意this在ES6模块中顶层的this指向undefined不是window

## export
> 可以用as做关键字重命名
```javascript
function f1() {}
function f2() {}

export {
  f1 as func1,
  f2 as func2,
  f2 as func3
}
```

> export一定要处于模块顶层
```javascript
function a() {
  export default 'ddd'  // syntaxError
}
```

> export语句输出的值和对应的接口是动态绑定关系，可以取到实时的值。
```javascript
export const foo = 'bbb'
setTimeout(() => foo = 'aaa', 1000)
// 输出'bbb'  1000ms后变成'aaa'
```

## import
> as重命名输入变量
```javascript
import {lastName as name} from './file'
```


> import提升，因为import命名是编译阶段执行的，静态执行
```javascript
foo()
import {foo} from './file' // 正常

// 不能使用表达式和变量
import {'f'+'oo'} from './file' // 报错
let module = 'my_module'
import {f} from module // 报错
if( x === 1) {
  import {f} from 'my_module1' // 报错
} else {
  import {f} from 'my_module2' // 报错
}
```

## 模块的整体加载
```javascript
// c.js
export function area1 () {}
export function area2 () {}

// a.js
import * as circle from './c'
circle.area1()
circle.area1()

// 模块整体加载时所在的对象应该是静态分析的所有不能运行时改变
circle.area1 = function () {}  // 报错
```

## exportdefault
```javascript
export default aaa
// 等同于
export {aaa as default}

import xxx from './a'
// 等同于
import {default as xxx} from './a'
```

> export default只能输出一个叫做default的变量，不能更变量声明
```javascript
export default var a = 1 // 报错
```

## export与import的复合写法
> 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
```javascript
export {foo, bar} from 'my_module'

// 可以理解为
import {foo, bar} from 'my_module'
export {foo, bar}

// foo,bar并没有被导入到当前模块中，只是对外转发这两个接口，导致当前模块不能直接使用foo和bar。
```

> 模块的接口改名和整体输出，也可以采用这种写法。
```javascript
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';
```

## 跨模块常量
> 本书介绍const命令的时候说过，const声明的常量只在当前代码块有效。如果想设置跨模块的常量（即跨多个文件），或者说一个值要被多个模块共享，可以采用下面的写法。

```javascript
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];

// 然后，将这些文件输出的常量，合并在index.js里面。
// constants/index.js 中转作用本js无法使用。
export {db} from './db';
export {users} from './users';

// script.js
import {db, users} from './index';
```

## import
> 前面介绍过，import命令会被 JavaScript 引擎静态分析，先于模块内的其他模块执行（叫做”连接“更合适）。所以，下面的代码会报错。
```javascript
// 报错
if (x === 2) {
  import MyModual from './myModual';
}
// import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中）。
```

> 这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。
```javascript
const path = './' + fileName;
const myModual = require(path);
// 上面的语句就是动态加载，require到底加载哪一个模块，只有运行时才知道。import语句做不到这一点
```

> 因此，有一个提案，建议引入import()函数，完成动态加载
```javascript
// import()返回一个 Promise 对象。下面是一个例子。
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
```