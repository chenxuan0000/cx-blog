# javascript

- [**`1.new date()`**](#date)

## date
```javascript
new Date("2009-08-08"); // [date] Sat Aug 08 2009 08:00:00 GMT+0800 (中国标准时间)   
// 注意是8点
new Date("2009-08-08 00:00:00") // invalid date 不合法

new Date("2009/08/08");// [date] Sat Aug 08 2009 00:00:00 GMT+0800 (中国标准时间)  
// 注意是0点

// 推荐直接采用下面这种写法
new Date(year, month, day, hours, minutes, seconds)
new Date(2009,7,8,0,0,0)  // [date] Sat Aug 08 2009 00:00:00 GMT+0800 (中国标准时间)
// month - 0(代表一月)-11(代表十二月)之间的月份 这个注意下
```