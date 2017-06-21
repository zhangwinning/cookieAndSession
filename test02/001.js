/**
 * Created by zhangwenning on 17/6/21.
 *
 * 这个cookie-parser 就是把请求头中cookie信息解析成对象,可以获取
 * 这个功能类似于本项目中test中001的代码.
 *
 */
var express = require('express');
var cookieParse = require('cookie-parser');

var app = express();
app.use(cookieParse());

app.get('/', (req, res) => {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies);
    return res.send('success');
});

app.listen(9000);

console.log('the server is running, port is 9000');