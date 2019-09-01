> 1154: 一年中的第几天

```javascript
var dayOfYear = function(date) {
    const monthDates = [31,28,31,30,31,30,31,31,30,31,30,31]
    let [year, month, day] = date.split('-').map(item => +item)
    let sum = 0
    if (!(year % (year % 100 ? 4 : 400))) {
        monthDates[1] = 29
    }
    for (let i = 0; i < month - 1; i++) {
        sum += monthDates[i]
    }
    return sum + day
};
```
