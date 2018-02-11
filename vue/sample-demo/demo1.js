function Vue(options) {
	this.data = options.data
	observe(this.data, this)
	let nodeEle = document.getElementById(options.el)
	var dom = domToFragment(nodeEle, this)
	nodeEle.appendChild(dom)
}

function domToFragment(node, vm) {
	// createDocumentFragment 效率高于原生dom操作很多
	var parent = document.createDocumentFragment()
	var child
	while ((child = node.firstChild)) {
		// 使用documentFragment的append方法，会将作为参数的节点从DOM中截取取出来
		// 而firstChild就指向了本来是排在第二个的元素对象。如此循环下去 *
		// 劫持node所有子节点
		complie(child, vm)
		parent.appendChild(child)
	}
	return parent
}

function observe(data, vm) {
	Object.keys(data).forEach(function(item) {
		definePrototy(vm, item, data[item])
	})
}
function definePrototy(vm, key, val) {
	var dep = new Dep()
	Object.defineProperty(vm, key, {
		get: function() {
			// 添加订阅者watet到主题对象
			if (Dep.target) dep.addSub(Dep.target)
			return val
		},
		set: function(newVal) {
			if (newVal === val) return
			val = newVal
			dep.notify()
		}
	})
}
function complie(node, vm) {
	var reg = /\{\{(.*)\}\}/
	var nodeType = node.nodeType
	switch (nodeType) {
		case 1:
			// 元素节点
			var attr = node.attributes
			for (var i = 0; i < attr.length; i++) {
				if (attr[i].nodeName == 'v-model') {
					// data值赋值给node
					var name = attr[i].nodeValue
					// input事件
					node.addEventListener('input', function(e) {
						vm[name] = e.target.value
					})
					node.value = vm.data[name]
					node.removeAttribute('v-model')
				}
			}
			new Watcher(vm, node, name, 'input')
			break
		case 3:
			// 文本节点
			if (reg.test(node.nodeValue)) {
				var name = RegExp.$1.trim()
				// node.nodeValue = vm.data[name]

				new Watcher(vm, node, name, 'text')
			}
			break
		default:
			break
	}
}

function Watcher(vm, node, name, nodeType) {
	Dep.target = this
	this.name = name
	this.node = node
	this.vm = vm
	this.nodeType = nodeType
	this.update()
	Dep.target = null
}

Watcher.prototype = {
	update: function() {
		this.get()
		if (this.nodeType == 'text') {
			this.node.nodeValue = this.value
		} else if (this.nodeType == 'input') {
			this.node.value = this.value
		}
	},
	get: function() {
		this.value = this.vm[this.name] // 触发对应属性的get
	}
}

function Dep() {
	this.subs = []
}

Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub)
	},
	notify: function() {
		this.subs.forEach(function(sub) {
			sub.update()
		})
	}
}

var Vue = new Vue({
	el: 'app',
	data: {
		text1: 'chenxuan'
	}
})
