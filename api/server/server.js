'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var express = require("express");

var registerNewsData = require("../node_modules/getNewsData/getNewsData");

app.start = function() {
  // start the web server

  // Only critical data which must be sent to users immediately
  registerNewsData((data) => {
    if(data) {
      // Push data to client

      var notification = new Notification({
        expirationInterval: 3600,
        badge: 10,
        sound: 'ping.aiff',
        alert: data,
        messageFrom: 'Find-Safe.Space'
      });

      PushModel.notifyById(req.params.id, note, function (err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
      });
    }
  });

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

  app.use("/ui", express.static(__dirname+"/../..")); // Custom routes
  app.use("/robots.txt", (req, res) => res.sendFile(__dirname+"/assets/robots.txt"));
  app.use("/humans.txt", (req, res) => res.sendFile(__dirname+"/assets/humans.txt"));

  app.use("/LICENSE.txt", (req, res) => res.sendFile(__dirname+"/assets/LICENSE.txt"));

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
