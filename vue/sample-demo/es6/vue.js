import Observe from './observe'
import Complie from './complie'

export default class Vue {
	constructor(params) {
		this.data = params.data
		this.el = params.el
		this.observe()
		this.appendChild()
	}

	domToFragment(node) {
		// createDocumentFragment 效率高于原生dom操作很多
		let parent = document.createDocumentFragment()
		let child
		while ((child = node.firstChild)) {
			// 使用documentFragment的append方法，会将作为参数的节点从DOM中截取取出来
			// 而firstChild就指向了本来是排在第二个的元素对象。如此循环下去 *
			// 劫持node所有子节点
			new Complie(child, this)
			parent.appendChild(child)
		}
		return parent
	}

	observe() {
		new Observe(this.data, this)
	}

	appendChild() {
		let nodeEle = document.getElementById(this.el)
		let dom = this.domToFragment(nodeEle)
		nodeEle.appendChild(dom)
	}
}
