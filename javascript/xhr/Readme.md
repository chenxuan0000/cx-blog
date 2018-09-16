# 原生ajax请求

```javascript
function createXhr() {
    if (window.XMLHttoRequest) {
        return new XMLHttoRequest();
    } else {
        // 兼容ie5 6
        return new ActiveXObject('Microsoft.XMLHttp');
    }
}

const xhr = createXhr();
xhr.onReadyStateChange = function() {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            console.log(xhr.responseText)
        } else {
            // ...
        }
    }
}

// GET
xhr.open('GET', url);
xhr.send();

// POST
xhr.open('POST', url);
xhr.send(data);
```