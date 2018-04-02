# 字符串数组去重
> ["a","b","c","a","b","c"] --> ["a","b","c"]
> 这里只考虑最简单字符串的数组去重，暂不考虑，对象，函数，NaN等情况，这种用正则实现起来就吃力不讨好了。

## ①ES6实现
```javascript
let str_arr=["a","b","c","a","b","c"]

function unique(arr){
  return [...new Set(arr)]
}

console.log(unique(str_arr)) // ["a","b","c"]
```

## ②ES5实现
```javascript
var str_arr = ["a", "b", "c", "a", "b", "c"]

function unique(arr) {
    return arr.filter(function(ele, index, array) {
        return array.indexOf(ele) === index
    })
}

console.log(unique(str_arr)) // ["a","b","c"]
```

## ③ES3实现
```javascript
var str_arr = ["a", "b", "c", "a", "b", "c"]

function unique(arr) {
    var obj = {},
        array = []

    for (var i = 0, len = arr.length; i < len; i++) {
        var key = arr[i] + typeof arr[i]
        if (!obj[key]) {
            obj[key] = true
            array.push(arr[i])
        }
    }
    return array
}

console.log(unique(str_arr)) // ["a","b","c"]
```

## 正则实现
```javascript
var str_arr = ["a", "b", "c", "a", "b", "c"]

function unique(arr) {
    return arr.sort().join(",,").
    replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").
    replace(/,,+/g, ",").
    replace(/,$/, "").
    split(",")
}

console.log(unique(str_arr)) // ["a","b","c"]
```