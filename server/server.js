var imageUtils = require('./utils/image.js');
var utils = require('./utils/utils.js');
var dvv = require('./dvv.js');

var init = function(dataArray, width, height){

  dvv.config({
    staticPath: '/../client',
    timeout: 25000,
    data: dataArray,
    width: width,
    height: height,
    func: 'math.inv',
    clock: true,
    callback: function(results, width, height) {
      var file = __dirname + '/../client/img/results.jpg';
      imageUtils.createJpegFileFromDataArray(file, results, width, height, function(){
        console.log('Finished creating file:', file);
      });
    }
  });

  dvv.start();

};

imageUtils.createDataArrayFromJpegFile(__dirname + '/assets/rgb.jpg', init);
