this.defaultConfiguration()调用的是下面的代码:

``` js

/**
 * Initialize application configuration.
 * @private
 */

app.defaultConfiguration = function defaultConfiguration() {
  var env = process.env.NODE_ENV || 'development';

  // default settings
  this.enable('x-powered-by');
  this.set('etag', 'weak');
  this.set('env', env);
  this.set('query parser', 'extended');
  this.set('subdomain offset', 2);
  this.set('trust proxy', false);

  // trust proxy inherit back-compat
  Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
    configurable: true,
    value: true
  });

  debug('booting in %s mode', env);

  this.on('mount', function onmount(parent) {
    // inherit trust proxy
    if (this.settings[trustProxyDefaultSymbol] === true
      && typeof parent.settings['trust proxy fn'] === 'function') {
      delete this.settings['trust proxy'];
      delete this.settings['trust proxy fn'];
    }

    // inherit protos
    setPrototypeOf(this.request, parent.request)
    setPrototypeOf(this.response, parent.response)
    setPrototypeOf(this.engines, parent.engines)
    setPrototypeOf(this.settings, parent.settings)
  });

  // setup locals
  this.locals = Object.create(null);

  // top-most app is mounted at /
  this.mountpath = '/';

  // default locals
  this.locals.settings = this.settings;

  // default configuration
  this.set('view', View);
  this.set('views', resolve('views'));
  this.set('jsonp callback name', 'callback');

  if (env === 'production') {
    this.enable('view cache');
  }

  Object.defineProperty(this, 'router', {
    get: function() {
      throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
    }
  });
};

```

该方法主要是初始化一些配置选项,例如:

x-powered-by
etag

```js
var env = process.env.NODE_ENV || 'development';
```
设置环境变量，其中默认是'development';

```js
this.enable('x-powered-by');
```

这里调用的是

```js
/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @public
 */

app.enable = function enable(setting) {
  return this.set(setting, true);
};
```
而`this.set(setting, true)`调用的是

```js 
/**
 * Assign `setting` to `val`, or return `setting`'s value.
 *
 *    app.set('foo', 'bar');
 *    app.get('foo');
 *    // => "bar"
 *
 * Mounted servers inherit their parent server's settings.
 *
 * @param {String} setting
 * @param {*} [val]
 * @return {Server} for chaining
 * @public
 */

app.set = function set(setting, val) {
  if (arguments.length === 1) {
    // app.get(setting)
    return this.settings[setting];
  }

  debug('set "%s" to %o', setting, val);

  // set value
  this.settings[setting] = val;

  // trigger matched settings
  switch (setting) {
    case 'etag':
      this.set('etag fn', compileETag(val));
      break;
    case 'query parser':
      this.set('query parser fn', compileQueryParser(val));
      break;
    case 'trust proxy':
      this.set('trust proxy fn', compileTrust(val));

      // trust proxy inherit back-compat
      Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
        configurable: true,
        value: false
      });

      break;
  }

  return this;
};

```
这里`arguments.length`是2，没调用，但是调用了 this.settings[setting] = val;

保存变量到this中去，奥，明白了，总结起来

this.enable('x-powered-by')的输出是; this.settings[setting] = val; 这里的val是true;

'x-powered-by'属性是http相应中普通非标准的特性，默认值会说明服务器的'constructed'是通过

什么技术搭建的。

"X-Powered-By" is a common non-standard HTTP response header (most headers prefixed with an 'X-' are non-standard). It's often included by default in responses constructed via a particular scripting technology

https://stackoverflow.com/questions/33580671/what-does-x-powered-by-means

2.this.set('etag', 'weak');

这段代码实际调用的是上面的app.set()方法.

同理 这里`arguments.length`是2，没调用，但是调用了 this.settings[setting] = val;

现在settings对象中是 `{x-powered-by: true, etag: "weak"}`.

然后调用switch方法(),走 (case 'etag')方法，从而调用

```js 
this.set('etag fn', compileETag(val));
```
最后break跳出;

而上面的`compileETag(val)`其实也是一个函数,在util中;

```js 
	/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */

exports.compileETag = function(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    case 'weak':
      fn = exports.wetag;
      break;
    default:
      throw new TypeError('unknown value for etag function: ' + val);
  }

  return fn;
}

```

val的值是'weak',并非function, 走switch的 (case 'weak'),fn的值是 exports.wetag

同样'exports.wetag'也是util的函数,为以下代码;

```js 
  /**
 * Return weak ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */

exports.wetag = function wetag(body, encoding){
  var buf = !Buffer.isBuffer(body)
    ? new Buffer(body, encoding)
    : body;

  return etag(buf, {weak: true});
};

```
返回的 'etag'是个缓存函数, 而这个缓存函数是调用的 `var etag = require('etag');`这里

eteg是在http协议的一部分,ETag是HTTP协议提供的若干机制中的一种Web缓存验证机制，并且允许客户

端进行缓存协商。这就使得缓存变得更加高效，而且节省带宽。如果资源的内容没有发生改变，Web服务器就

不需要发送一个完整的响应。

https://zh.wikipedia.org/wiki/HTTP_ETag

这里`compileETag(val)`返回的是一个函数, 调用 this.set('etag fn', compileETag(val));

又重新调用了app.set()函数，此时`arguments.length`还是2，只调用了

```js
// set value
  this.settings[setting] = val;
```
这是this.settings的值是{
	etag:"weak"
	etag fn:function wetag(body, encoding){ … }
	x-powered-by:true
}
这里这么做的原因是保存`etag fn`这个属性,值为函数。用于进行缓存处理的函数

3.this.set('env', env);

这里env变量值为'development', 走app.set()函数, 输出为settings变量中仅仅添加一个属性

`env`, 现在 this.settings的值为:{
	env:"development"
    etag:"weak"
	etag fn:function wetag(body, encoding){ … }
	x-powered-by:true
}

4.this.set('query parser', 'extended');

调用app.set()函数,第一次调用在settings变量中添加一个属性`query parser`

,值为'extended',然后走`switch`函数的` case 'query parser': `,

```js 
    case 'query parser':
      this.set('query parser fn', compileQueryParser(val));
      break;
```

这里再次调用 'compileQueryParser(val)'函数,

```js 

  /**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 * 
 */

exports.compileQueryParser = function compileQueryParser(val) {
  var fn;

  if (typeof val === 'function') {
    return val;
  }

  switch (val) {
    case true:
      fn = querystring.parse;
      break;
    case false:
      fn = newObject;
      break;
    case 'extended':
      fn = parseExtendedQueryString;
      break;
    case 'simple':
      fn = querystring.parse;
      break;
    default:
      throw new TypeError('unknown value for query parser function: ' + val);
  }

  return fn;
}

```

这里返回的是一个函数,

```js 
  /**
 * Parse an extended query string with qs.
 *
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
  return qs.parse(str, {
    allowPrototypes: true
  });
}

```
而qs函数解析的是字符串到 'nesting'对象。返回一个这么的函数,具体方法解析看

https://github.com/ljharb/qs

这个函数走完----->输出结果为 this.setting 为 {
    env:"development"
    etag:"weak"
    etag fn:function wetag(body, encoding){ … }
    query parser:"extended"
    query parser fn:function parseExtendedQueryString(str) { … }
    x-powered-by:true
}

5.this.set('subdomain offset', 2);

输出为:this.settings: {
    env:"development"
    etag:"weak"
    etag fn:function wetag(body, encoding){ … }
    query parser:"extended"
    query parser fn:function parseExtendedQueryString(str) { … }
    subdomain offset:2
    x-powered-by:true
}

6.this.set('trust proxy', false);

设置this.settings.并且调用switch函数

```js 
    case 'trust proxy':
      this.set('trust proxy fn', compileTrust(val));

      // trust proxy inherit back-compat
      Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
        configurable: true,
        value: false
      });

      break;

```

这里有个调用先设置为false, 后来设置为true,并且代码是一样的。着实不解。

二:

this.locals = Object.create(null);

创建本地对象,这里的输出为this.locals = {};

三:

```js 
// default locals
  this.locals.settings = this.settings;
```

这里的this.locals.settings赋值为刚才设置的变量。

四:

```js 
 // default configuration
  this.set('view', View);
  this.set('views', resolve('views'));
  this.set('jsonp callback name', 'callback');

```
解读这里:
this.set('view', View); 
把View函数保存到view属性上. @zhangwennning, 这里请求来之后再深究.

this.set('views', resolve('views'));
把`views`属性保存到settings上,resolve('views')的值为`"/Users/zhangwenning/study/project/git/expressParse/views"`

path.resolve()方法是把项目运行的路径加上 + views目录，

同理运行`this.set('jsonp callback name', 'callback');`就是单纯的添加属性

在settings上。

到现在所有的属性都设置完毕,返回app了。





































