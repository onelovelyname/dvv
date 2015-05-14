var imageUtils = require('./utils/image.js');
var utils = require('./utils/utils.js');
var dvv = require('./dvv.js');
// colorSpace used to convert RGB to LAB
// https://www.npmjs.com/package/color-space
var colorSpace = require('color-space');
// DeltaE used to determine color difference 
// see: https://www.npmjs.com/package/delta-e
var DeltaE = require('delta-e');

var init = function(dataArray, width, height){

  dvv.config({
    staticPath: '/../client',
    timeout: 25000,
    data: dataArray,
    partitionLength: 32,
    width: width,
    height: height,
    func: findColor,
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


// function to return pixels with rgb values similar to red as themselves; all other pixels are converted to grayscale
var findColor = function () {
  var red = {
    L: 53.23288178584245,
    A: 80.10930952982204,
    B: 67.22006831026425
  };
  var redCounter = 0;
  var grayCounter = 0;
  var resultsArray = [];
  for (var i = 0; i < arguments.length; i++) {
    //convert each pixel from rgb to lab 

    var pixelRGB = arguments[i].slice(0,3);
    var pixelLAB = colorSpace.rgb.lab(pixelRGB);
    var color = {
      L: pixelLAB[0],
      A: pixelLAB[1],
      B: pixelLAB[2]
    };
    var difference = DeltaE.getDeltaE76(red, color);
    //convert pixel from lab to rgb
    pixelRGB = colorSpace.lab.rgb(pixelLAB);
    roundedPixelRGB = [];
    for (var j = 0; j < pixelRGB.length; j++) {
      roundedPixelRGB.push(Math.round(pixelRGB[j]));
    }

    if (difference < 35) {
      resultsArray.push(roundedPixelRGB);
      redCounter++;
    } else {
      // rgb weighting identified in the following:
      // http://en.wikipedia.org/wiki/Luma_%28video%29
      // http://stackoverflow.com/questions/687261/converting-rgb-to-grayscale-intensity
      var gray = Math.round((0.299 * (pixelRGB[0])) + (0.587 * (pixelRGB[1])) + (0.114 * (pixelRGB[2])));
      resultsArray.push([gray, gray, gray]);
      grayCounter++;
    }
  }
  resultsArray.push(redCounter);
  resultsArray.push(grayCounter);
  return resultsArray;
};

imageUtils.createDataArrayFromJpegFile(__dirname + '/assets/rgb.jpg', init);
