'use strict';

module.exports = function(Locationreport) {

  Locationreport.validatesInclusionOf('generalSafety', {
    in: [1,2,3,4,5,6,7,8,9,10]
  });


  Locationreport.validatesInclusionOf('cleanliness', {
    in: [1,2,3,4,5,6,7,8,9,10]
  });

  Locationreport.validatesLengthOf('comment', {min: 3});

  Locationreport.validatesLengthOf('locationId', {min: 3});
};
