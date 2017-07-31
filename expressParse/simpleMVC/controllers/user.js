// var mongoose = require('mongoose')
// var Video = require('../models/user');
module.exports.controller = function(app) {

/**
 * a home page route
 */
  app.get('/signup', function(req, res) {
      // any logic goes here
      res.render('users/signup')
  });

/**
 * About page route
 */
  app.get('/login', function(req, res) {
      // any logic goes here
      console.log('test');
      res.render('users/login')
  });
}