'use strict';

module.exports = function(Report) {
  Report.validatesInclusionOf('generalSafety', {
    in: [1,2,3,4,5,6,7,8,9,10]
  });


  Report.validatesInclusionOf('cleanliness', {
    in: [1,2,3,4,5,6,7,8,9,10]
  });

  Report.validatesLengthOf('comments', {min: 3});

  Report.validatesNumericalityOf('lat', { message: { number: 'is not a number' }});

  Report.validatesNumericalityOf('long', { message: { number: 'is not a number' }});
};
