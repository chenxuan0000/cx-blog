# 小程序及wepy框架方面的坑

- [**`1.wepy概述`**](#wepy概述)
- [**`2.autoprefix`**](#autoprefix)
- [**`3.redux,wepy-redux状态管理库`**](#redux)
- [**`4.wepy repeat组件的坑`**](#repeat组件)
- [**`5.小程序里面怎么实现阻止遮罩层的滑动穿透`**](#小程序里面怎么实现阻止遮罩层的滑动穿透)
- [**`6.遮罩层的淡入淡出`**](#遮罩层的淡入淡出)
- [**`7.上啦加载和下啦刷新`**](#上啦加载和下啦刷新)
- [**`8.小程序里面的图片`**](#小程序里面的图片)

## wepy概述
> WePY借鉴了Vue.js（后文简称Vue）的语法风格和功能特性，如果你之前从未接触过Vue，建议先阅读Vue的官方文档，以熟悉相关概念，否则在阅读[**`WePY文档`**](https://tencent.github.io/wepy/document.html#/)以及使用WePY进行开发的过程中，将会遇到比较多的障碍。
> 环境配置等文档内容自行阅读[**`WePY文档`**](https://tencent.github.io/wepy/document.html#/)

## autoprefix
> 在wepy中有[**`两种解决方案`**](https://github.com/Tencent/wepy/issues/551)
  - 1.[**`wepy框架autoprefixer插件`**](https://github.com/Tencent/wepy/tree/master/packages/wepy-plugin-autoprefixer)
  - 2.[**`WePY 使用less autoprefix`**](https://github.com/Tencent/wepy/wiki/WePY-%E4%BD%BF%E7%94%A8less-autoprefix)

## redux
> [**`wepy和redux结合的连接器`**](https://www.npmjs.com/package/wepy-redux)
  - 1.在方法内部调用需要this.methods.aaa()
```javascript
<template>
  <view class="container">
    <button @tap="asyncInc" size="mini">  async inc </button>
  </view>
</template>

 ...

@connect({
    num(state) {
      return state.counter.num
    },
    inc: 'inc'
  }, {
    addNum: INCREMENT,
    asyncInc
  })

export default class Index extends wepy.page {
  	// ...
    methods = {
      aa () {
        this.methods.asyncInc() // 这个有点坑 只能这样调用
      }
    }
    // ...
    onLoad() {
    }
  }
```
    - 2.reducers的操作，数组变化需要concat才能监听变化，并且要拷贝返回。
```javascript
[Get_FRIENDS_LIST](state, { payload }) {
      let items = payload.items;
      return Object.assign({}, state, {
        dynamicInfo: {
          dynamicList: state.dynamicInfo.dynamicList.concat(items),
          lastDynamicId,
          hasNext
        }
      });
    },

//Object.assign({},a,b)  or [...a,...b]

// 注意这里必须要return state，就算没有改变，每次调用actions里面的方法都会进入对应的reducers。
```

## repeat组件
> 目前repeat组件有部分bug[**`repeat的bug`**](https://github.com/Tencent/wepy/issues?utf8=%E2%9C%93&q=repeat)。

## 小程序里面怎么实现阻止遮罩层的滑动穿透
- 1.如果弹出层没有滚动事件，就直接在蒙板上加catchtouchmove="move" move:function(){};

- 2.如果弹出层有滚动事件，那么在弹出层出现的时候给底部的containerView加上一个class 消失的时候移除。
```javascript
<view class="{{showSearchView?'tripList_root':''}}">
.tripList_root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

## 遮罩层的淡入淡出
> 如果一个元素从`display:none`到`display:block`设置透明度的动画是不会生效，除非你用js来实现，透明度的渐变。
> 有个解决方法是用`visibility`
```javascript
// visibility:hidden 是占据空间，无缝点击的。
<view class="shadow-layer {{selectOpen?'fadeIn':''}}"></view>
// 蒙层
.shadow-layer {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.3s;
  &.fadeIn {
    visibility: inherit;
    opacity: 1;
  }
}
```

## 上啦加载和下啦刷新
> 通过`scroll-view`组件实现，尝试下来比较难用
  - 下啦刷新无法很好的控制，会触发很多次，就算用一些方法控制只刷一次，也解决不了松手在刷新的问题。

> 通过onPullDownRefresh，onPageScroll，onReachBottom实现
```javascript
// 建议在单个页面内开启下来刷新的配置项
 config = {
      enablePullDownRefresh: true
    }
```

## 小程序里面的图片
>  小程序里面的图片有默认宽高，而且和html的img不一样需要注意，具体看文档[**`imgae`**](https://mp.weixin.qq.com/debug/wxadoc/dev/component/image.html)
```javascript
<image src="{{item.imgUrl}}" class="slide-image" mode="aspectFill"></image>
```

>  小程序里面的图片用背景图需要用base64，或者网络图片地址。