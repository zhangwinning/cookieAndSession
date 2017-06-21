/**
 * Created by zhangwenning on 17/5/14.
 */

var http = require('http');
var _ = require('lodash');


http.createServer((req, res) => {
    //从客户端获取cookie信息
    req.cookies = parseCookie(req.headers.cookie);
    handles(req, res);
}).listen(9000, 'localhost');

console.log('Server is running at http://localhost:9000');

var handles = (req, res)=> {
    if (!req.cookies.isVisit) {
        //3. 服务器将更新的cookie信息发送至客户端;
        res.setHeader('Set-Cookie', serialize('isVisit', '1'));
        res.writeHead(200);
        res.end("welcome to zoo" + '\n');
    } else {
        res.writeHead(200);
        res.end("welcome to zoo too" + '\n');
    }
}

/**
 * 解析cookie;
 * 'name = value; paht= /; Ecpxires = 12'    解析成对象形式
 */
var parseCookie = (cookie) => {
    var cookies = {};
    if (!cookie) {
        return cookies;
    } else {
        var list = cookie.split(';');
        _.forEach(_.split(cookie, ';'), (value, index) => {
            var pair = value.split('=');
            cookies[_.trim(pair[0])] = pair[1];
        });
        return cookies;
    }
}

/**
 * 将Cookie序列化成规范字符串
 * @returns {string}
 */
var serialize = (name, val, opt) => {
    var pairs = name + '=' + val;
    return pairs;
}