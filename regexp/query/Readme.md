# 获取链接的query

```javascript
function getParamName(attr) {

  let match = RegExp(`[?&]${attr}=([^&]*)`) //分组运算符是为了把结果存到exec函数返回的结果里
    .exec(window.location.search)
    // www.baidu.com?aa=111%20www&bb=333
  //["?aa=111 www", "111 www", index: 0, input: "?aa=111 www&bb=333"]
  return match && decodeURIComponent(match[1].replace(/\+/g, ' ')) // url中+号表示空格,要替换掉
}

getParamName('aa) // '111 www'
```