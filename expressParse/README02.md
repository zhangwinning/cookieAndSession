## express 解析02



####

####

```js

var express = require('express');
var logger = require('morgan');

var app = express();

//app.engine('html', require('ejs').renderFile);
app.use('/public',express.static(__dirname + '/public'));
app.use(logger());
app.get('/', function(req, res){
	res.send('Hello World');
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

```

上面是一个简单的web程序，返回浏览器hello world，就几个步骤，1.获取express实例对象，2.加入需要的中间件，

3.加入路由响应，4.启动服务器.

相比java框架轻量了很多，而且不需要单独架设web服务器，利用nodejs的异步非阻塞机制，可以大大提高网站的并发量

1.获取express实例对象

``` js
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;

```

可以看出,该方法实际上是一个工厂函数,用来生成一个app实例.而app是一个函数,该函数会有一些其他属性.

```js
  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);
```
mixin是一个依赖模块,它其实是一个extend操作,这两行就是把EventEmitter.prototype的属性和proto的属性扩张到

app上去

``` js
  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
	app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
	app: { configurable: true, enumerable: true, writable: true, value: app }
  })
```
在req对象中添加app属性,具体设置查看test/test10中的例子,app属性的value值为上面创建的app对象

``` js

	 app.init();

```
app.init()调用的是下面的代码;

``` js
/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 *   - setup route reflection methods
 *
 * @private
 */

app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this.defaultConfiguration();
};

```

