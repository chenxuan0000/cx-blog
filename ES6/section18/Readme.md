# 编程风格

- [**`1.解构赋值`**](#解构赋值)
- [**`2.数组`**](#数组)


## 解构赋值
> 使用数组成员对变量赋值时，优先使用解构赋值。
```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

> 函数的参数如果是对象的成员，优先使用解构赋值。
```javascript
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
}

// good
function getFullName(obj) {
  const { firstName, lastName } = obj;
}

// best
function getFullName({ firstName, lastName }) {
}
```

> 如果函数返回多个值，优先使用对象的解构赋值，而不是数组的解构赋值。这样便于以后添加返回值，以及更改返回值的顺序。
```javascript
// bad
function processInput(input) {
  return [left, right, top, bottom];
}

// good
function processInput(input) {
  return { left, right, top, bottom };
}

const { left, right } = processInput(input);
```

## 数组
> 使用扩展运算符（...）拷贝数组。
```javascript
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

> 使用 Array.from 方法，将类似数组的对象转为数组
```javascript
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```