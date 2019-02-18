# 安全

## Nav-List
- [**`xss`**](#xss)
- [**`csrf`**](#csrf)
- [**`密码安全`**](#密码安全)


## xss
> 跨网站指令码（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程式的安全漏洞攻击，是代码注入的一种。

> XSS 分为三种：反射型，存储型和 DOM-based

> js-xss来实现格式化过滤。

## csrf
> 跨站请求伪造（英语：Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。

> 简单点说，CSRF 就是利用用户的登录态发起恶意请求


> 如何防御
- Get 请求不对数据进行修改
- 不让第三方网站访问到用户 Cookie
- 阻止第三方网站请求接口
- 请求时附带验证信息，比如验证码或者 token

> SameSite
- 可以对 Cookie 设置 SameSite 属性。该属性设置 Cookie 不随着跨域请求发送，该属性可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。

> 验证 Referer
- 对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。

> Token
- 服务器下发一个随机 Token（算法不能复杂），每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。


## 密码安全
> 通常需要对密码加盐，然后进行几次不同加密算法的加密。
```javascript
// 加盐也就是给原密码添加字符串，增加原密码长度
sha256(sha1(md5(salt + password + salt)))
```