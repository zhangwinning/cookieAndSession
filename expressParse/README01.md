## express 解析01



#### 1.请求是走node服务器的那段代码?(请求只走`requestListener`函数)

#### 2.express如何处理对于node服务器逻辑的?(先构建`requestListener`回调函数,再构建服务器)

1.http.createServer([requestListener])
  官网：参数 requestListener 是一个函数,它将会自动加入到 'request' 事件的监听队列中。

  我们可以把这个requestListener看成中间件，他负责完成处理http请求队列中的每个请求,即http的每个请求。

  请求到来后都要在`requestListener`这个函数中走一遍。
```js
    var http = require("http");

    var server = http.createServer(function(req,res){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
        console.log('请求1');
    });

    server.listen(3000,function(){
        console.log("now listen 3000");
        console.log('请求2');
    });
```
服务器启动时`请求2`会打印出来,而`请求1`不会打印出来,这里server.listen()做的底层操作是创建一个http服务器。

请求到来时 `请求1`会打印出来,然而`请求2`不会打印出来。

2.express

```js
var express = require('express');
var app = express();

var server = app.listen(3000, function () {}）；


```
查看源码发现`express`实际上是工厂函数,用于生产1中提到的<font color="red">requestListener</font>,

相当于请求事件的中间件,所以app和requestListener是等同的,即:而app相当于createServer的回调函数.

3.createServer

2中的app到现在为止只是把createServer的`回调函数`构造好了,但是还没有调用node的http.createServer方法,

express中通过`listen`函数创建服务,同时返回一个服务器.
```js
app.listen = function listen() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```

这一章只是对node原生构建服务器和express构建的服务器做个对比,下一章深究每个函数的功能.

4.js函数

js中的函数就是对象,js中的函数除了可以被调用之外,也是可以添加属相的.

[相关连接1](https://segmentfault.com/a/1190000003874989)

[相关连接2](http://syaning.com/2015/05/20/dive-into-express/)