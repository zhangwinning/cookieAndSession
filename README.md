practice
===================================
初始cookie
-----------------------------------
# 1.由于http是无状态协议,为了保持一个状态,引出cookie;
### cookie处理流程
cookie处理的3个步骤
1.服务器向客户端发送Cookie;
2.浏览器将cookie保存;
3.之后每次浏览器发送都会携带cookie;
### 客户端和服务器处理cookie的具体形式
1. 客户端发送的Cookie在请求报文的Cookie字段上,我们可以通过curl工具构造这个字段，
如下:<br />
curl -v -H "Cookie: foo=bar; baz = val" "http://localhost:9000"
2. 服务器这边,HTTP_Parser会将报文信息解析到req.header字段上;那么Cookie就是
req.header.cookie。这里获取的是cookie的字段串,通过自定义解析把cookie解析成
JSON数据。(parseCookie方法);<br>
3. 服务器将更新的cookie信息发送至客户端;
>  1. 告知客户端的方式是通过相应报文形式实现的。
>  2. 相应的Cookie值设置到Set-Cookie字段中。
>  3. 客户端收到Set-Cookie响应后,之后的请求会加上Cookie字段中值
			


