# axios业务封装

## http.js
```javascript
import axios from 'axios'
import qs from 'qs'
// 处理部分自带Promise插件 内部Promise不会被babel问题
window.Promise = Promise

const http = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
http.interceptors.request.use(function (config) {
  config.transformRequest = [function (data, header) {
    // 处理请求数据
    return qs.stringify(data)
  }]
  // 给get请求+时间戳
  if (config.params) {
    config.params._time = +new Date()
  } else {
    config.params = {
      _time: +new Date()
    }
  }
  return config
})

export default http
```

## request_http.js
```javascript
import http from './http'
import { Indicator, Toast } from 'mint-ui'

// 判断一个数是否在数量里面
const in_array = (single, arr) => {
  let i = 0,
    n = arr.length
  for (; i < n; ++i) if (arr[i] === single) return i
  return false
}

// 多维数组 => 单维
const getSingleProperty = (arr, name) => {
  let newArr = []
  arr.forEach(item => {
    newArr.push(item[name])
  })
  return newArr
}

const request = ({
  method = 'get',
  url,
  loading = true, // 请求接口是否显示加载laoding
  errorTip = false, // status ！== 0 开启错误弹窗
  customMsg = [], // 自定义status对应的报错信息
  statusNoToast = [] // 没有默认弹窗的status数组
} = {}) => {
  return function (params = {}) {
    let axios
    if (loading) Indicator.open()
    if (method === 'get') {
      axios = http.get(url, params)
    } else if (method === 'post') {
      axios = http.post(url, params)
    }
    return axios.then(({ data }) => {
      if (loading) Indicator.close()
      if (!data.hasOwnProperty('data')) {
        // 非标准格式接口
        return data
      }
      if (data.status === 0) {
        return data.data
      }
      if (errorTip && in_array(data.status, statusNoToast) === false) {
        const statusArr = getSingleProperty(customMsg, 'status')
        const inArray = in_array(data.status, statusArr)
        if (inArray === false) {
          Toast(data.msg)
        } else {
          // 当前返回status在自定义的报错里面
          Toast(customMsg[inArray].msg)
        }
      }
      return Promise.reject({
        status: data.status,
        errMsg: data.msg
      })
    })
  }
}

export default request
```

## 🌰使用例子
```javascript
import request from './request_http'

// 秒杀活动状态export
export const actSkillModule = request({
  url: `${prefix}/secKillStatus`,
  loading: false
})

// 3.8女神节的领取
export const actThreeGetModule = request({
  url: `${prefix}/receiveGirlGift`,
  method: 'post',
  errorTip: true,
  customMsg: [
    {
      status: -4,
      msg: '未开户，即将跳转开户页'
    }
  ]
})
```

