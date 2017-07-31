
一:在主项目中
```js 
app.use('/public',express.static(__dirname + '/public'));
```
这里的app.static是调用的是`serve-static`依赖,通过express引入即可,

这里的`serve-static`不是express依赖的范畴,先不深究.

https://expressjs.com/en/starter/static-files.html

讲解这部分的内容.

```js

/**
 * Proxy `Router#use()` to add middleware to the app router.
 * See Router#use() documentation for details.
 *
 * If the _fn_ parameter is an express app, then it will be
 * mounted at the _route_ specified.
 *
 * @public
 */

app.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = flatten(slice.call(arguments, offset));

  if (fns.length === 0) {
    throw new TypeError('app.use() requires middleware functions');
  }

  // setup router
  this.lazyrouter();
  var router = this._router;

  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
      return router.use(path, fn);
    }

    debug('.use app under %s', path);
    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
        setPrototypeOf(req, orig.request)
        setPrototypeOf(res, orig.response)
        next(err);
      });
    });

    // mounted an app
    fn.emit('mount', this);
  }, this);

  return this;
};

```
该方法是Router.use的代理方法

该方法的思路如下:

-首先定义局部变量,offset和path
  - offset:表示从第几个函数开始为中间件函数,默认是0;
  - path:路径,默认是 /
-当第一个参数不为函数的时候
  - while循环是针对第一个参数为数组的情况,即`[fn]`，`[[fn]]`等情况,此时让局部变量`arg`为数组或者多层数组的第一项。
  - 如果arg不为函数,则认为第一个参数为字符串,并将值赋值给path,同时设置offset的值为1.
- 获取参数中offset下标开始的所有参数,并进行扁平化处理,赋值给fns,即代表所有的中间件函数

```js
  // setup router
  this.lazyrouter();
  var router = this._router;
```
其中this.lazyrouter()调用的是

```js 
  /**
 * lazily adds the base router if it has not yet been added.
 *
 * We cannot add the base router in the defaultConfiguration because
 * it reads app settings which might be set after that has run.
 *
 * @private
 */
app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });

    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
};

```
加载`_router`属性,前提是`_router`不存在,而 new Router()方法调用的是Router方法,

而路由对象Router的实例化,则调用下面的代码

```js
/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @return {Router} which is an callable function
 * @public
 */

var proto = module.exports = function(options) {
  var opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
  setPrototypeOf(router, proto)

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
};

```
在这个例子中,`proto`相当于工厂函数,用来生成`router`,

  1.生成一个router对象,实际上router是一个函数,该函数还有一些其他属性.
  
  2.将router的__proto__属性设置为 proto,即让router继承于proto
  这也就是 `setPrototypeOf(router, proto)`这个代码的作用.
  
  3.设置router的一些属性值:
    1. params
    2. _params
    3. caseSensitive
    4. mergeParams
    5. strict
    6. stack

////////////////////////////////////////////////////////////////////////////////

该方法之所以称为`lazyrouter`,是因为只有当需要Router的时候才初始化对象.注释里也解释了

该方法执行之后,app就有一个_router属性,其值是一个Router对象.








