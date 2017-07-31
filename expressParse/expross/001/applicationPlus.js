let http = require('http');

var layer = require('./layer');

var Router = require('./router');

var Application = function() {
    //第二划,第二划 LAYER
    this._router = new Router();
};

    
Application.prototype.use = function(path, fn) {
    var router = this._router;
    return router.use(path, fn);
    // this.router.push(new layer(path, cb));
};


//接着改变Listen函数,将其主要逻辑封装到handle函数中,用来匹配处理请求函数
//并且遵守单一职责原则
Application.prototype.handle = function(req, res){
    var router = this._router;
    router.handle(req, res);
}

Application.prototype.listen = function(port) {
    var self = this;
    http.createServer(function(req, res) {
        self.handle(req, res);
    }).listen(port);
};

Application.prototype.get = function(path, fn) {
    var router = this._router;
    return router.get(path, fn);
};

Application.prototype.route = function (path) {
  return this._router.route(path);
};

module.exports  = Application;




