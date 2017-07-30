var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.SafetyDataArchive;
ds.automigrate('LocationReport', function(err) {
  if (err) throw err;

  var data = [
    /* 1 */
    {
      "_id" : ("597d4cb9cfe60656553f206d"),
      "locationId" : "5749c5fe498e3402fb2b974a",
      "generalSafety" : 10,
      "cleanliness" : 4,
      "comment" : "This place was very safe and well-lighted with many people going in and out, but not clean"
    },

    /* 2 */
    {
      "_id" : ("597d4d3bcfe60656553f206e"),
      "locationId" : "4c4f1a6f51c2c9289ca4709f",
      "generalSafety" : 3,
      "cleanliness" : 4,
      "comment" : "Suspicious people going in and out, looked like it hadn't been cleaned in months. Did not accept credit card so I had to go inside where I saw many suspicious figures going in and out"
    },

    /* 2 */
    {
      "_id" : ("597d4d3bcfe60656553f206e"),
      "locationId" : "4c4f1a6f51c2c9289ca4709f",
      "generalSafety" : 1,
      "cleanliness" : 4,
      "comment" : "Spotted several suspicious people loitering around this area"
    }
  ];
  var count = data.length;
  data.forEach(function(d) {
    app.models.LocationReport.create(d, function(err, model) {
      if (err) throw err;

      console.log('Created:', model);

      count--;
      if (count === 0)
        ds.disconnect();
    });
  });
});
