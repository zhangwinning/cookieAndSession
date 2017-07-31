var expross = require('./001/expross');
var app = expross();

// console.log('####', app);

app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('first' + '\n');
    next();
});

app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('second' + '\n');
});

app.route('/book').get(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Get a random book' + '\n');
});

app.listen(3000);