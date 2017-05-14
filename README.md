practice
=====
初始cookie
------
1.由于http是无状态协议,为了保持一个状态,引出cookie;
cookie
	cookie处理的3个步骤
	1.服务器向客户端发送Cookie;
	2.浏览器将cookie保存;
	3.之后每次浏览器发送都会携带cookie;
代码详见001
	客户端发送的Cookie在请求报文的Cookie字段上,我们可以通过curl工具构造这个字段，
	如下:
	curl -v -H "Cookie: foo=bar; baz = val" "http://localhost:9000"
	在服务器这边:HTTP_Parser会将报文信息解析到req.header字段上;那么Cookie就是
	req.header.cookie。这里获取的是cookie的字段串,通过自定义解析把cookie解析成
	JSON数据。(parseCookie方法);
