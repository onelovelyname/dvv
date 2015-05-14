var imageUtils = require('./utils/image.js');
var utils = require('./utils/utils.js');

var init = function(dataArray, width, height){

  var dvv = require('./dvv.js');

  dvv.config({
    staticPath: '/../client',
    timeout: 25000,
    data: dataArray,
    width: width,
    height: height,
    func: 'math.inv',
    clock: true
    callback: function(results) { return results; }
  });

  dvv.start();

};

imageUtils.createDataArrayFromJpegFile('server/rgb.jpg', init);
