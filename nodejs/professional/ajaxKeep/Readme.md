# 同请求过滤方法次处为获取 token实例

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

```javascript
import defer from './defer';
import deferLodash from './deferLodash';

const preUrl = ''
const Util = {
    	// getToken
		_getToken() {	
		},
		// refreshToken
		_refreshToken(refreshToken) {
		},
		setStroge({ access_token, refresh_token }) {
		}
}


const getToken = ({ key = 'getToken', skip = false, refreshToken = '' } = {}) {
			let methodName = `_${key}`
			if (skip === true) {
				return Util[methodName](refreshToken)
			}
			if (!cache[key]) {
				cache[key] = {
					status: 'init',
					callbacks: [],
					resolveData: null
				}
			}
			// let deferred = $.Deferred()  // jq  
              let deferred = defer();  // promise


			switch (cache[key]['status']) {
				case 'reject':
				case 'init':
					cache[key]['status'] = 'pending'
					Util[methodName](refreshToken)
						.done(data => {
							cache[key]['status'] = 'resolve'
							cache[key]['resolveData'] = data
							let current
							// 替换同步产生的错误resolve
							while ((current = cache[key]['callbacks'].pop())) {
								current[0](data)
							}
						})
						.fail(err => {
							cache[key]['status'] = 'reject'
							let current
							// 替换同步产生的错误reject
							while ((current = cache[key]['callbacks'].pop())) {
								current[1](err)
							}
						})
				case 'pending':
					cache[key].callbacks.push([
						function(data) {
							deferred.resolve(data)
						},
						function(err) {
							deferred.reject(err)
						}
					])
					break
				case 'resolve':
					deferLodash(deferred.resolve, cache[key].resolveData)
			}
			// return deferred  // jq
            return deferred.promise // promise
		},
```
