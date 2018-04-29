# 同请求过滤方法次处为获取 token 实例

## defer.js

```javascript
function defer() {
	let ret = {
		promise: null,
		resolve: null,
		reject: null
	}
	ret.promise = new Promise(function(resolve, reject) {
		ret.resolve = resolve
		ret.reject = reject
	})
	return ret
}

export default defer
```

## deferLodash.js

```javascript
function deferLodash(func, ...args) {
	if (typeof func != 'function') {
		throw new TypeError('Expected a function')
	}
	return setTimeout(func, 1, ...args)
}

export default deferLodash
```

## ajaxKeep.js
[**ajaxKeep.js**](./ajaxKeep.js)

