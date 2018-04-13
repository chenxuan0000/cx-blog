# 路由


- [**`1.hash的前端路由实现`**](#hash的前端路由实现)
- [**`2.hash的前端路由升级`**](#hash的前端路由升级)
    - [**`2.1实现后退功能`**](#实现后退功能)
- [**`3.History的前端路由实现`**](#history的前端路由实现)

## hash的前端路由实现
> hash路由一个明显的标志是带有#,我们主要是通过监听url中的hash变化来进行路由跳转,hash的优势就是兼容性更好。

```javascript
class Router {
    constructor() {
        this.routers = {}
        this.currentUrl = ''
        this.refresh = this.refresh.bind(this)
        window.addEventListener('load',this.refresh,false)
        window.addEventListener('hashchange',this.refresh,false)        
    }

    route(path, cal) {
        this.routers[path] = cal || function() {}
    }

    refresh() {
        this.currentUrl = location.hash.slice(1) || '/'
        this.routers[this.currentUrl]()
    }
}
```

## hash的前端路由升级
### 实现后退功能
```javascript
class Router {
    constructor() {
        this.routers = {}
        this.currentUrl = ''
        // 记录出现过的hash值
        this.history = []
        // 作为指针,默认指向this.history的末尾,根据后退前进指向history中不同的hash
        this.currentIndex = this.history.length - 1
        this.refresh = this.refresh.bind(this)
        this.backOff = this.backOff.bind(this)        
        window.addEventListener('load',this.refresh,false)
        window.addEventListener('hashchange',this.refresh,false)        
    }

    route(path, cal) {
        this.routers[path] = cal || function() {}
    }

    refresh() {
        this.currentUrl = location.hash.slice(1) || '/'
        // 将当前hash路由推入数组储存
        this.history.push(this.currentUrl)
        // 指针向前移动
        this.currentIndex++
        this.routers[this.currentUrl]()
    }

    backOff() {
        // 如果指针小于0的话就不存在对应hash路由了,因此锁定指针为0即可
        this.currentIndex < 0 ? (this.currentIndex === 0) : (this.currentIndex -= 1)
        // 随着后退,location.hash也应该随之变化
        location.hash =  `#${this.history[this.currentIndex]}`
        // 执行指针目前指向hash路由对应的callback
        this.routers[this.history[this.currentIndex]]()
    }
}
```