# 去除字符串前后空格

```javascript
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

let str = "  jaw il "
console.log(trim(str)) // "jaw il"
```