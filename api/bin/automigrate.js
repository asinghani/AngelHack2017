var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.SafetyDataArchive;
ds.automigrate('Report', function(err) {
  if (err) throw err;

  var data = [
    /* 1 */
    {
      "_id" : ("597d4ac7cfe60656553f206a"),
      "lat" : 36.137758,
      "long" : -120.16542,
      "generalSafety" : 9,
      "cleanliness" : 7,
      "comments" : "Very well-lighted, safe place with lots of activity nearby"
    },

    /* 2 */
    {
      "_id" : ("597d4b02cfe60656553f206b"),
      "lat" : 36.137858,
      "long" : -120.16552,
      "generalSafety" : 10,
      "cleanliness" : 4,
      "comments" : "Safe-seeming place, but the gas stations weren't very clean"
    },

    /* 3 */
    {
      "_id" : ("597d4b2acfe60656553f206c"),
      "lat" : 36.137748,
      "long" : -120.16532,
      "generalSafety" : 7,
      "cleanliness" : 7,
      "comments" : "Somewhat safe area"
    },

    /* 4 */
    {
      "_id" : ("597d4d5dd4b725e944177b17"),
      "lat" : 36.137758,
      "long" : -120.16542,
      "generalSafety" : 6.0,
      "cleanliness" : 4.0
    },

    /* 5 */
    {
      "_id" : ("597d4d70d4b725e944177b18"),
      "lat" : 36.002461,
      "long" : -120.127448,
      "generalSafety" : 6.0,
      "cleanliness" : 4.0
    },

    /* 6 */
    {
      "_id" : ("597d4d90d4b725e944177b19"),
      "lat" : 36.296764,
      "long" : -120.268792,
      "generalSafety" : 9.0,
      "cleanliness" : 9.0
    }
  ];
  var count = data.length;
  data.forEach(function(d) {
    app.models.Report.create(d, function(err, model) {
      if (err) throw err;

      console.log('Created:', model);

      count--;
      if (count === 0)
        ds.disconnect();
    });
  });
});
