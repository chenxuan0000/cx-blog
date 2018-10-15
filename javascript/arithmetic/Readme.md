# JavaScript算法

## Nav-List
- [**`栈`**](#栈)
    - [**`从十进制到其他进制`**](#从十进制到其他进制)
- [**`队列`**](#队列)
    - [**`Queue类`**](#queue类)
    - [**`击鼓传花`**](#击鼓传花)


## 栈
> 栈􏱟􏰗􏳆􏹋􏲦􏼦􏽢􏽣􏽎􏱭是遵从后进先出原则(LIFO)原则的有序集合，􏳹添加的或􏽤删除的元素􏲟􏳵􏳶在栈的同一端(栈顶)􏽥􏱸􏱝􏶾，另一端叫栈底。（比如堆📚）

### 从十进制到其他进制

```javascript
// 􏹲ES6􏺺WeakMap􏾉􏾊􏽐实现类
let Stack = (function() {
    const items = new WeakMap()
    class Stack {
        constructor () {
            items.set(this, [])
        }
        // 其他方法
        push (item) {
           return items.get(this).push(item)
        }

        pop () {
           return items.get(this).pop()
        }

        isEmpty () {
            return items.get(this).length == 0
        }

    }
    return Stack
})()

// 10 => 其他进制
function baseConverter(decNumber, base) {
    var remStack = new Stack(),
        rem,
        baseString = '',
        digits = '0123456789ABCDEF';

    while (decNumber > 0) {
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber/base);
    }

    while (!remStack.isEmpty()) {
        baseString += digits[remStack.pop()];
    }

    return baseString;
}
```

## 队列
> 队列遵从FIFO(First In First Out 新进先出)原则的一组有序的数，队列在尾部添加新队列，并从底部移除元素（比如排队）。

### queue类
```javascript
let Queue = (function(){
    const items = new WeakMap()
    class Queue {
        constructor () {
            items.set(this, [])
        }

        enqueue (ele) {
            let q = items.get(this)
            q.push(ele)
        }

        dequeue () {
            let q = items.get(this)
            let r = q.shift()
            return r
        }

        size () {
            let q = items.get(this)
            return q.length
        }
    }
    return Queue
})()
```

### 击鼓传花
```javascript
function hotPotato(nameList, num) {
    let QueueL = new Queue()
    for (let i = 0,len = nameList.length; i<len; i++) {
        QueueL.enqueue(nameList[i])
    }
    let eliminated = ''
    while(QueueL.size() > 1) {
        for (let i = 0;i<num;i++) {
            QueueL.enqueue(QueueL.dequeue())
        }
        eliminated = QueueL.dequeue()
        console.log(eliminated + '在􏿨􏿩􏻥􏿪􏿫􏿬􏿭􏱉􏿮􏿯。');
    }
    return QueueL.dequeue()
}
```