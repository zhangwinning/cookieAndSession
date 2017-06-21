/**
 * Created by zhangwenning on 17/6/21.
 */
var express = require('express');
var session = require('express-session');

var app = express();

//这里做的东西是类似于test中002中sessions对象,这个对象现在是通过session中间件创建的.
// Use the session middleware
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}, name: 'test sessions'}));

// Access the session as req.session
app.get('/', function (req, res, next) {
    var sess = req.session;
    if (sess.views) {
        sess.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + sess.views + '</p>')
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        sess.views = 1
        res.end('welcome to the session demo. refresh!' + '\n');
    }
});

app.listen(9000);