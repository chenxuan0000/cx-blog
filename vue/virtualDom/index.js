/**
 * mount virtual dom to real dom
 */

;(function() {
	function vnode(tag, data, children, text) {
		this.tag = tag
		this.data = data
		this.children = children
		this.text = text
	}

	function createElm(vnode) {
		var tag = vnode.tag
		var data = vnode.data
		var children = vnode.children

		if (tag !== undefined) {
			vnode.elm = document.createElement(tag)

			if (data.attrs !== undefined) {
				var attrs = data.attrs
				for (var key in attrs) {
					vnode.elm.setAttribute(key, attrs[key])
				}
			}
			if (children) {
				createChildren(vnode, children)
			}
		} else {
			vnode.elm = document.createTextNode(vnode.text)
		}

		return vnode.elm
	}

	function createChildren(vnode, children) {
		for (var i = 0; i < children.length; ++i) {
			vnode.elm.appendChild(createElm(children[i]))
		}
	}

	function patch(el, vnode) {
		createElm(vnode)

		var isRealElement = el.nodeType !== undefined 
		if (isRealElement) {
			el.appendChild(vnode.elm)
		}

		return vnode.elm
	}

	function render1() {
		return new vnode(
			'div',
			{
				attrs: {
					class: 'wrapper'
				}
			},
			[
				new vnode(
					'p',
					{
						attrs: {
							class: 'inner'
						}
					},
					[new vnode(undefined, undefined, undefined, 'Hello world')]
				)
			]
		)
	}
	function render2() {
		return new vnode(
			'div',
			{
				attrs: {
					class: 'wrapper'
				}
			},
			[
				new vnode(
					'input',
					{
						attrs: {
              class: 'inner',
              value: 111
						}
					}
				)
			]
		)
	}

	function mount(el) {
		var vnode1 = render1()
		var vnode2 = render2()
		patch(el, vnode1)
		patch(el, vnode2)
	}

	mount(document.querySelector('#app'))
})()
