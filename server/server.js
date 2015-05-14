var dvv = require('./dvv.js');
// colorSpace used to convert RGB to LAB
// https://www.npmjs.com/package/color-space
var colorSpace = require('color-space');
// DeltaE used to determine color difference 
// see: https://www.npmjs.com/package/delta-e
var DeltaE = require('delta-e');
 

//Function to create arrays for testing purposes
var createMatrixArrays = function(matrixSize, arrayLength){
  var randomArray = function(n){
    var result = [];
    for(var i = 0; i < n ; i++){
      var row = [];
      for (var j = 0; j < n; j++){
        row.push(Math.floor(Math.random()*100));
      }
      result.push(row);
    }
    return result;
  };
  var result = [];
  for(var i = 0; i < arrayLength; i++){
    result.push(randomArray(matrixSize));
  }
  return result;
};

// function to return pixels with rgb values similar to red as themselves; all other pixels are converted to grayscale
var findColor = function () {
  var red = {
    L: 53.23288178584245,
    A: 80.10930952982204,
    B: 67.22006831026425
  };
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
    if (difference < 35) {
      resultsArray.push(pixelRGB);
    } else {
      // rgb weighting identified in the following:
      // http://en.wikipedia.org/wiki/Luma_%28video%29
      // http://stackoverflow.com/questions/687261/converting-rgb-to-grayscale-intensity
      var gray = (0.299 * (pixelRGB[0])) + (0.587 * (pixelRGB[1])) + (0.114 * (pixelRGB[2]));
      resultsArray.push([gray, gray, gray]);
    }
  }
  return resultsArray;
};

var pixelArray = [ [ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 255, 0, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 0, 0, 255, 255 ],
[ 255, 0, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 0, 255, 255 ],
[ 255, 255, 255, 255 ],
[ 255, 0, 0, 255 ],
[ 0, 255, 0, 255 ],
[ 0, 0, 255, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ],
[ 255, 255, 255, 255 ],
[ 0, 0, 0, 255 ] ];

//findColor(pixelArray);

// //Test : invert a matrix using math.js's math.inv function imported on client side
// //partitionLength is set to 1 by default
// dvv.config({
//  staticPath: '/../client',
//  timeout: 25000,
//  data: createMatrixArrays(5, 2),
//  func: 'math.inv',
//  clock: true
// });

dvv.config({
 staticPath: '/../client',
 timeout: 25000,
 data: pixelArray,
 partitionLength: 20,
 func: findColor,
 clock: true,
 callback: function(results) { return results; }

});

dvv.start();