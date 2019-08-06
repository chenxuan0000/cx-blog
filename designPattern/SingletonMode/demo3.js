let getSingle = function(fn) {
	let result
	return function() {
		return result || (result = fn.apply(this, arguments))
	}
}

let CreateLoginLayer = function() {
	let div = document.createElement('div')
	div.innerHTML = '我的登录框'
	div.style.display = 'none'
	document.body.appendChild(div)
	return div
}

let createSingleLoginLayer = getSingle(CreateLoginLayer)

// 创建登录框
document.getElementById('loginBtn').onclick = function() {
	let loginLayer = createSingleLoginLayer()
	loginLayer.style.display = 'block'
}

// 创建一个唯一的iframe
let CreateIframe = function() {
	let iframe = document.createElement('iframe')
	document.body.appendChild(iframe)
	return iframe
}

let createSingleIfrmae = getSingle(CreateIframe)

document.getElementById('loginBtn').onclick = function() {
	let loginLayer = CreateIframe()
	loginLayer.src = 'http://1233.com'
}
