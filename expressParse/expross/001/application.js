var http = require('http');

//路由
var router = [];
router.push({path: '*', fn: function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('404 \n');
}}, {
	path: '/', fn: function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World \n');
}});

http.createServer( (req, res) => {
    //自动匹配
    for(var i=1,len=router.length; i<len; i++) {
        if(req.url === router[i].path) {
            return router[i].fn(req, res);
        }
    }
    return router[0].fn(req, res);
}).listen(3000);