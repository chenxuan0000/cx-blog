import Dep from './dep'
export default class watcher {
	constructor(vm, node, name, nodeType) {
		Dep.target = this
		this.name = name
		this.node = node
		this.vm = vm
		this.nodeType = nodeType
		this.update()
		Dep.target = null
	}

	update() {
		this.get()
		if (this.nodeType == 'text') {
			this.node.nodeValue = this.value
		} else if (this.nodeType == 'input') {
			this.node.value = this.value
		}
	}

	get() {
		this.value = this.vm[this.name] // 触发对应属性的get
	}
}
