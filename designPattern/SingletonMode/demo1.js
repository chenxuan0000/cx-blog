let Singleton = function(name) {
	this.name = name
}

Singleton.prototype.getName = function() {
	console.log(this.name)
}

Singleton.getInstance = (function() {
	let instance = null
	return function(name) {
		if (!instance) {
			instance = new Singleton(name)
		}
		return instance
	}
})()

let a = new Singleton('a')
let b = new Singleton('b')

console.log(a === b) // true
