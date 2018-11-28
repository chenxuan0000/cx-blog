# 复杂度分析

- [**`时间复杂度分析`**](#时间复杂度分析)
- [**`多项式时间复杂度`**](#多项式时间复杂度)
- [**`空间复杂度分析`**](#空间复杂度分析)


极客时间版权所有: https://time.geekbang.org/column/article/40036

## 时间复杂度分析
>渐进时间复杂度，表示算法的执行时间与数据规模之间的增长关系

极客时间版权所有: https://time.geekbang.org/column/article/40036 

1. 只关注循环执行次数最多的一段代码
2. 加法法则：总复杂度等于量级最大的那段代码的复杂度
3. 乘法法则：嵌套代码的复杂度等于嵌套内外代码复杂度的乘积

## 多项式时间复杂度

1. O(1)

```javascript
const i = 8
const j = 6
```

2. O(logn)、O(nlogn)

```
let i=1

while (i <= n) {
    i = i * 2
}
// O(log2n)
```
```
let i=1

while (i <= n) {
    i = i * 3
}
// O(log3n)
```

## 空间复杂度分析
> 渐进空间复杂度，表示算法的存储空间与数据规模之间的增长关系。

```javascript
function createArray(n) {
  var i = 0;
  var arr = new Array(n);
  for (i; i <n; ++i) {
    a[i] = i * i;
  }

  for (i = n-1; i >= 0; --i) {
    console.log(a[i])
  }
}

// 空间复杂度就是 O(n)
```