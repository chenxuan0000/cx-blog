import Watcher from './watcher'

export default class complie {
	constructor(node, vm) {
		this.node = node
		this.vm = vm
		this.run()
	}

	run() {
		let reg = /\{\{(.*)\}\}/
		let node = this.node
		let vm = this.vm
		let nodeType = node.nodeType
		switch (nodeType) {
			case 1:
				// 元素节点
				let attr = node.attributes
				for (let i = 0; i < attr.length; i++) {
					if (attr[i].nodeName == 'v-model') {
						// data值赋值给node
						let name = attr[i].nodeValue
						// input事件
						node.addEventListener('input', e => {
							vm[name] = e.target.value
						})
						// node.value = vm.data[name]
						node.removeAttribute('v-model')
						new Watcher(vm, node, name, 'input')
					}
				}
				break
			case 3:
				// 文本节点
				if (reg.test(node.nodeValue)) {
					let name = RegExp.$1.trim()
					new Watcher(vm, node, name, 'text')
				}
				break
			default:
				break
		}
	}
}
