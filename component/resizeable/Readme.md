## 如何设计可拖拽和调整大小的组件

本篇文章主要介绍如何设计一个完可拖拽和调整大小的组件，代码演示基于 vue。

### 概要：

- [**`组件轮廓`**]
  - [**`template部分`**]
  - [**`入参props和data`**]
- [**`拖拽实现`**]
  - [**`created生命周期重置属性状态`**]
  - [**`mounted生命周期绑定事件等`**]
  - [**`mousedown事件回调`**]

### 组件轮廓

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
```

### 拖拽实现

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
