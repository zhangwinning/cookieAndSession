
var Layer = require('./layer');
var Item = require('./item');


var Route = function(path) {
	this.path = path;	//path代表该route所对应的URL,
	this.stack = [];	//stack代表上图中route内部item所在的数组


	this.methods = {};	//methods用来快速判断该route中是是否存在某种HTTP请求方法
};

//判断该请求方法是否存在于该路由中;例如api/getlist get方法是否存在于该url中.
Route.prototype._handles_method = function(method) {
	var name = method.toLowerCase();
	return Boolean(this.methods[name]);
}


Route.prototype.get = function(fn) {
	// var layer = new Layer('/', fn);
	// layer.method = 'get';
	var item = new Item('/', fn);
	item.method = 'get';

	this.methods['get'] = true;
	this.stack.push(item);

	return this;
}

Route.prototype.dispatch = function(req, res) {
	var self = this;
	method = req.method.toLowerCase();

	for(var i=0,len=self.stack.length; i<len; i++) {
		if(method === self.stack[i].method) {
			return self.stack[i].handle_request(req, res);
		}
	}
}

module.exports = Route; 
