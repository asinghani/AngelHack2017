'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var express = require("express");

app.start = function() {
  // start the web server

  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  app.use("/ui", express.static(__dirname+"/../..")); // Custom route #1
  app.use("/robots.txt", (req, res) => res.sendFile(__dirname+"/assets/robots.txt"));
  app.use("/humans.txt", (req, res) => res.sendFile(__dirname+"/assets/humans.txt"));

  app.use("/LICENSE.txt", (req, res) => res.sendFile(__dirname+"/assets/LICENSE.txt"));

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
