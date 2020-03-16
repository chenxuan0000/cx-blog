## 如何设计可拖拽和调整大小的组件

本篇文章主要介绍如何设计一个完可拖拽和调整大小的组件，代码演示基于 vue。

### 概要：

- [**`组件轮廓`**]
  - [**`template部分`**]
  - [**`入参props和data和computed`**]
- [**`拖拽实现`**]
  - [**`created生命周期重置属性状态`**]
  - [**`mounted生命周期绑定事件等`**]
  - [**`mousedown事件回调`**]
  - [**`watch属性更新left,top`**]
  - [**`beforeDestroy生命周期解绑事件`**]

### 组件轮廓

#### template部分
```html
<template>
  <div :style="style" :class="[className]" @mousedown.left="elementDown"></div>
</template>
```

#### props入参
```javascript
props: {
      className: {
        type: String,
        default: 'chart'
      },
      // 组件是否激活态
      active: {
        type: Boolean,
        default: false
      },
      // 是否可拖拽
      draggable: {
        type: Boolean,
        default: true
      },
      w: {
        type: Number,
        default: 200,
        validator: (val) => val > 0
      },
      h: {
        type: Number,
        default: 200,
        validator: (val) => val > 0
      },
      x: {
        type: Number,
        default: 0,
        validator: (val) => typeof val === 'number'
      },
      y: {
        type: Number,
        default: 0,
        validator: (val) => typeof val === 'number'
      },
      // 将组件的移动和尺寸限制为父组件（如果提供了true），或者限制为由有效CSS选择器标识的元素
      parent: {
        type: Boolean,
        default: false
      },
      grid: {
        type: Array,
        default: () => [1, 1]
      },
},
data () {
      return {
        rawWidth: this.w,
        rawHeight: this.h,
        rawLeft: this.x,
        rawTop: this.y,
        rawRight: null,
        rawBottom: null,
        left: this.x,
        top: this.y,
        right: null,
        bottom: null,
        parentWidth: null,
        parentHeight: null,
        enabled: this.active,
        // 拖拽状态是否可以进入
        dragging: false,
        bounds: {}
      }
},
computed: {
      style () {
        return {
          position: 'absolute',
          top: this.top + 'px',
          left: this.left + 'px',
          width: this.width + 'px',
          height: this.height + 'px'
        }
      },
    },
```

### 拖拽实现

#### created生命周期重置属性状态
```javascript
created () {
      this.resetBoundsAndMouseState()
},
methods: {
    resetBoundsAndMouseState () {
        // 初始化
        this.mouseClickPosition = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 }
        this.bounds = {
          minLeft: null,
          maxLeft: null,
          minRight: null,
          maxRight: null,
          minTop: null,
          maxTop: null,
          minBottom: null,
          maxBottom: null
        }
      }
}
```

#### mounted生命周期绑定事件等
```javascript
mounted () {
      [this.parentWidth, this.parentHeight] = this.getParentSize()

      this.rawRight = this.parentWidth - this.rawWidth - this.rawLeft
      this.rawBottom = this.parentHeight - this.rawHeight - this.rawTop

      addEvent(document.documentElement, 'mousedown', this.deselect)
},
methods: {
    getParentSize () {
        if (this.parent) {
          const style = window.getComputedStyle(this.$el.parentNode, null)

          return [
            parseInt(style.getPropertyValue('width'), 10),
            parseInt(style.getPropertyValue('height'), 10)
          ]
        }

        return [null, null]
    },
    deselect (e) {
        const target = e.target || e.srcElement
        const regex = new RegExp(this.className + '-([trmbl]{2})', '')
        if (!this.$el.contains(target) && !regex.test(target.className)) {
          if (this.enabled) {
            this.enabled = false

            this.$emit('deactivated')
            this.$emit('update:active', false)
          }
          removeEvent(document.documentElement, 'mousemove', this.handleMove)
        }

        this.resetBoundsAndMouseState()
    },

}
```


#### mousedown事件回调
```javascript
methods: {
     elementDown (e) {
        const target = e.target || e.srcElement

        if (this.$el.contains(target)) {

          if (!this.enabled) {
            this.enabled = true

            this.$emit('activated')
            this.$emit('update:active', true)
          }

          if (this.draggable) {
            this.dragging = true
          }

          this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
          this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY

          this.mouseClickPosition.left = this.left
          this.mouseClickPosition.right = this.right
          this.mouseClickPosition.top = this.top
          this.mouseClickPosition.bottom = this.bottom
          addEvent(document.documentElement, 'mousemove', this.move)
          addEvent(document.documentElement, 'mouseup', this.handleUp)
        }
      },
      handleUp () {

        this.resetBoundsAndMouseState()

        this.rawTop = this.top
        this.rawBottom = this.bottom
        this.rawLeft = this.left
        this.rawRight = this.right

        if (this.dragging) {
          this.dragging = false
        }
        removeEvent(document.documentElement, 'mousemove', this.handleMove)
      },
      move (e) {
        if (this.resizing) {
        // 调整大小
          this.handleMove(e)
        } else if (this.dragging) {
        // 拖拽移动
          this.elementMove(e)
        }
      },
      elementMove (e) {
        const mouseClickPosition = this.mouseClickPosition

        const tmpDeltaX = mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX)
        const tmpDeltaY = mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY)
        const [deltaX, deltaY] = this.snapToGrid(this.grid, tmpDeltaX, tmpDeltaY)
        this.rawTop = mouseClickPosition.top - deltaY
        this.rawBottom = mouseClickPosition.bottom + deltaY
        this.rawLeft = mouseClickPosition.left - deltaX
        this.rawRight = mouseClickPosition.right + deltaX
        this.$emit('dragging', this.left, this.top)
      },
      snapToGrid (grid, pendingX, pendingY) {
        pendingX = parseInt(pendingX, 10)
        pendingY = parseInt(pendingY, 10)
        const x = Math.round(pendingX / grid[0]) * grid[0]
        const y = Math.round(pendingY / grid[1]) * grid[1]

        return [x, y]
      },
}
```

#### beforeDestroy生命周期解绑事件
```javascript
beforeDestroy () {
      removeEvent(document.documentElement, 'mousedown', this.deselect)
      removeEvent(document.documentElement, 'mousemove', this.move)
      removeEvent(document.documentElement, 'mouseup', this.handleUp)
      removeEvent(window, 'resize', this.checkParentSize)
    },
```