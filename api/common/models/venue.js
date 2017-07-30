'use strict';
var request = require("request");
var _ = require("underscore");

module.exports = function(Venue) {


  Venue.validatesLengthOf('id', {min: 3});

  Venue.validatesLengthOf('name', {min: 2});

  Venue.validatesLengthOf('hours', {min: 2});

  Venue.validatesLengthOf('menu', {min: 2});


  Venue.search = function(searchstring, lat, long, cb) {
    console.log(searchstring);
    console.log(`https://api.foursquare.com/v2/venues/explore?v=20170101&client_id=YU22IYZ050HHUIRKJGEXT4ENBWUJTS5D524T2IBKGSJMBFPB&client_secret=ZPBQXS4OKS5J1VNEZC0HUXEPTLQ0OS5U0PPCLSSNGKLEIBE1&ll=${lat},${long}&query=${encodeURIComponent(searchstring)}`);
    request(`https://api.foursquare.com/v2/venues/explore?v=20170101&client_id=YU22IYZ050HHUIRKJGEXT4ENBWUJTS5D524T2IBKGSJMBFPB&client_secret=ZPBQXS4OKS5J1VNEZC0HUXEPTLQ0OS5U0PPCLSSNGKLEIBE1&ll=${lat},${long}&query=${encodeURIComponent(searchstring)}`, (err, res, body) => {
      if(err || !body) {
        cb(err);
      } else {
        let data = [];
        console.log(JSON.parse(body));
        data = JSON.parse(body).response.groups[0].items;
        data = _.pluck(data, "venue");
        data = _.sortBy(data, venue => venue.location.distance); // Distance sorting
        //console.log(data);
        cb(null, data);
      }
    });
  };

  Venue.remoteMethod("search", {
    accepts: [{arg: "searchstring", type: "string"}, {arg: "lat", type: "number"}, {arg: "long", type: "number"}],
    returns: {arg: "venues", type: "array"},
    description: "Search for nearby venues based on location and searchString",
    notes: "Search for nearby venues based on location and searchString"
  });
};
