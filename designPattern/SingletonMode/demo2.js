let CreateDiv = function(html) {
	this.html = html
	this.init()
}

CreateDiv.prototype.init = function() {
	let div = document.createElement('div')
	div.innerHTML = this.html
	document.body.appendChild(div)
}

// 接下来引入代理类proxySingletonCreateDiv
let proxySingletonCreateDiv = (function() {
	let instance = null
	return function(html) {
		if (!instance) {
			instance = new CreateDiv()(html)
		}
		return instance
	}
})()

let a = new proxySingletonCreateDiv('abc')
let b = new proxySingletonCreateDiv('abcddd')

console.log(a === b) // true
