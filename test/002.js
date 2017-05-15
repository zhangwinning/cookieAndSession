/**
 * Created by zhangwenning on 17/5/12.
 */
var http = require('http');
var _ = require('lodash');

var sessions = {};
var key = "session_id";
var EXPIRES = 20 * 60 * 1000;


http.createServer((req, res) => {
    req.cookies = parseCookie(req.headers.cookie);
    var id = req.cookies[key];      //检查cookie值
    if (!id) {
        req.session = generate();
    } else {
        var session = sessions[id];
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
                //更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            } else {
                //超时,删除旧数据,并重新生成
                delete sessions[id];
                req.session = generate();
            }
        } else {
            //如果session过期或者口令不对,重新生成session
            req.session = generate();
        }
    }
    handles(req, res);
}).listen(9000, 'localhost');

console.log('Server is running at http://localhost:9000');

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

var handles = (req, res) => {
    if (!req.session.isVisit) {
        var cookies = res.getHeader('Set-Cookie');
        var session = serialize(key, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        res.setHeader('Set-Cookie', _.compact(cookies));
        req.session.isVisit = true;
        res.writeHead(200);
        res.end('welcome to zoo\n');
    } else {
        var cookies = res.getHeader('Set-Cookie');
        var session = serialize(key, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        res.setHeader('Set-Cookie', _.compact(cookies));
        res.writeHead(200);
        res.end('welcome to zoo too \n');
    }
}

var serialize = (name, val, opt) => {
    var pairs = name + '=' + val;
    return pairs;
}
//生成session口令的方法
var generate = function () {
    var session = {};
    session.id = (new Date()).getTime() + Math.random();    //时间戳 + 随机数
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
}