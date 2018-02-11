import Dep from './dep';
export default class Observe {
	constructor(data, vm) {
		this.data = data
		this.vm = vm
		this.repeatData()
	}

	repeatData() {
		Object.keys(this.data).forEach(item => {
			this.definePrototy(item, this.data[item])
		})
	}

	definePrototy(key, val) {
		var dep = new Dep()
		Object.defineProperty(this.vm, key, {
			get: function() {
				// 添加订阅者watet到主体对象
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
}
