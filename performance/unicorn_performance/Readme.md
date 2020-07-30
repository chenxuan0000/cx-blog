## 前言

首先我会介绍一下我们公司内部的`数据可视化平台` —— `Unicorn`，让大家了解下unicorn目前有哪些功能。

本次的主要议题 —— `如何快速定位性能问题`，在这部分我将向大家着重介绍一些我们产品迭代中的一些问题和优化手段。

## 产品介绍

### 业务背景
首先先来说一下为什么我们要做这样一个数据可视化平台，主要有以下几个方面：

| 产品 | 是否免费 | Ops账号登录、细分权限  | 易上手 | 公司计算引擎集成 |
| :--- |    :----:   |    :---: |     ---: |     :---: |
| Tableau |  ❌  |  ❌  |  ✅  |  ❌  |
| 网易有数 | ❌ | ❌ | ✅ |  ❌  |
| Excel | ❌ | ❌ | ✅ |  ❌  |
| Unicorn | ✅|  ✅ | ✅ |  ✅ |

由于有上面这些业务场景，我们便开始搭建属于喜马拉雅的一个数据可视化平台。

<img src="1.png">


### 产品功能效果图

简单展示一下unicorn的实际效果图

首先是`数据模型`界面，进入“数据模型”模块，可以创建数据模型，包括静态数据模型&动态数据模型&CSV数据模型，其中动态数据模型支持占位符的配置：

<img src="数据模型.png">

配置好数据模型的`sql语句`和`配置信息`，点击执行按钮成功后，就可以到仪表盘的编辑界面使用做好的数据模型制作仪表盘。

<img src="编辑页.png">

用户可以根据需求，添加自己所需要的图表、筛选器、指标卡、文本、监控等，
用户再图表编辑面板上选择数据模型，调整图表样式配置。

<img src="首页.png">


## 如何快速定位性能问题

### unicorn迭代中遇到的问题
用户长时间使用unicorn，会感觉交互会慢慢变卡，图表过多切换过快甚至会奔溃。

<!-- 2、数据模型页面加载和退出会卡顿3s以上 -->

### 调试定位问题

1、在`unicorn`下面里面制做两个相同的仪表盘，制定一个`Benchmark`，共`14`个echart面积图，每个图表`378`个数据点，且显示所有数据点。

2、为了避免装给浏览器装的一些插件造成影响，使用`Chrome`的隐身模式页面，它会把所有的插件都给禁掉。

3、打开本地启动的`Unicorn`项目对应的Benchmark的仪表盘-验证图表性能，打开`Chorme`控制台右上角的更多里面的More tools的`Performance monitor`,这个面板可以看到CPU usage,JS heap size等实时指标。

4、从验证图表性能仪表盘，点击跳转到验证图表性能1仪表盘，观察CPU usage,JS heap size等指标变化情况。

第一次加载完后10s:
![alt text](../unicorn/优化前第一次加载完.jpg "优化前第一次加载完")

第三次加载完后10s:
![alt text](../unicorn/优化前第三次加载完.jpg "优化前第一次加载完")

### 性能问题原因猜想

> 根据上一步`JS heap size`持续上涨，没有回收的趋势，判断项目里面存在[`JS内存泄漏`](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html), unicorn项目中占用内存较多的如：`echarts、ace`等。

### 定位问题

#### 1、用Memory的Heap snapshot来定位问题

heap snapshot(堆快照)，给当前内存堆拍一张照片。因为动态申请的内存都是在堆里面的，而局部变量是在内存栈里面，是由操作系统分配管理的是不会内存泄露了。所以关心堆的情况就好了。

**操作流程**
- 在`unicorn`下面里面制做两个相同的仪表盘（两个柱状图1，两个柱状图2）。

- 打开两个柱状图1仪表盘，然后点击拍照按钮。

![alt text](../unicorn/shot.jpg "Take heap snapshot")

它就会把当前页面的内存堆扫描一遍显示出来，如下图所示：

![alt text](../unicorn/snapshot1.jpg "snapshot1")

- 打开两个柱状图2仪表盘，点击垃圾回收的按钮,避免其他干扰问题，然后点击拍照按钮。

![alt text](../unicorn/垃圾回收.jpg "垃圾回收")

它就会把当前页面的内存堆扫描一遍显示出来，如下图所示：

![alt text](../unicorn/snapshot2.jpg "snapshot2")

#### 2、用Class Filter定位明细

1、 在Class Filter的搜索框里搜一下echart：

第一次快照

![alt text](../unicorn/echartShot1.jpg "echartShot1")

第二次快照

![alt text](../unicorn/echartShot2.jpg "echartShot2")

2、Class Filter搜索框里搜一下detached:


![alt text](../unicorn2/img1.jpg "detached")

它会显示所有已经分离的DOM结点，我们把鼠标放上去等个2s，它就会显示这个div的DOM信息：

![alt text](../unicorn2/img2.jpg "detail")

通过className等信息可以知道它是检查页面中的DOM节点，点击一个DOM节点，在下面的Object的窗口查看详细信息：

![alt text](../unicorn2/img3.jpg "detail")


### 问题总结

1、echart实例在路由切换，前面一个组件已经销毁后，并没有释放掉。

2、detached的dom没有被回收的问题。

3、部分event listener没有被及时回收。


### 优化前后Benchmark对比
| 优化阶段 | JS heap size | DOM Nodes | JS event listeners |
| :---         | :---:    | ---:          | :-----------  |
| 优化前      | 281MB-548MB-806MB   | 6306-3815-5374       | 4181-2624-3563          |
| 优化后      | 60.5MB-60.9MB-66.6MB   | 2315-2297-2333     | 1728-1739-1806   |
