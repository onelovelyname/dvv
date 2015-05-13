imageUtils = require('./imageUtils.js');

var init = function(dataArray, width, height){
  console.log('DATA ARRAY:')
  console.log(dataArray);

  var dvv = require('./dvv.js');

  // //Test : invert a matrix using math.js's math.inv function imported on client side
  // //partitionLength is set to 1 by default
  dvv.config({
   staticPath: '/../client',
   timeout: 25000,
   // data: createMatrixArrays(200, 5),
   data: dataArray,
   width: width,
   height: height,
   func: 'math.inv',
   clock: true
   callback: function(results) { return results; }
  });

  dvv.start();

};

imageUtils.createDataArrayFromImageFile('server/rgb.png', init);
