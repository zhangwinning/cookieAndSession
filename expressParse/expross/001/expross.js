var application = require('./applicationPlus');

exports = module.exports = createApplication;

function createApplication () {
	var app = new application();
	return app;
}