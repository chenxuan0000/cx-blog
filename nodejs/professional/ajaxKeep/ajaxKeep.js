import defer from './defer'
import deferLodash from './deferLodash'

const preUrl = ''
const cache = {}
const Util = {
	// getToken
	_getToken() {},
	// refreshToken
	_refreshToken(refreshToken) {},
	setStroge({ access_token, refresh_token }) {}
}

const getToken = ({
	key = 'getToken',
	skip = false,
	refreshToken = ''
} = {}) => {
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
	let deferred = defer() // promise

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
}
