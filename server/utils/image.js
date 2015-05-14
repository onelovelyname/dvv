var fs = require('fs');
var PNG = require('node-png').PNG;
var jpeg = require('jpeg-js');

var imageUtils = {};

imageUtils.createDataArrayFromPngFile = function(filename, callback){

  fs.createReadStream(filename)
  .pipe( new PNG({ filterType: 4 }) )
  .on('parsed', function() {

    var dataArray = [];
    for (var i=0; i<this.data.length; i+=4){
      var r = this.data[i];
      var g = this.data[i+1];
      var b = this.data[i+2];
      var rgb = [r,g,b];
      dataArray.push(rgb);
    }

    callback(dataArray);

  });
};

imageUtils.createDataArrayFromJpegFile = function(filename, callback){

  fs.readFile(filename, function (err, data) {

    if (err) return console.log(err);

    var parsedData = jpeg.decode(data);

    var dataArray = [];
    for (var i=0; i<parsedData.data.length; i+=4) {
      var r = parsedData.data[i];
      var g = parsedData.data[i+1];
      var b = parsedData.data[i+2];
      var a = parsedData.data[i+3];
      var rgba = [r,g,b,a];

      dataArray.push(rgba);
    }

    callback(dataArray, parsedData.width, parsedData.height);

  });



};

imageUtils.createJpegFileFromDataArray = function(filename, dataArray, width, height, callback){

  var rgbToRgbaDataBuffer = new Buffer(width * height * 4);
  for (var i=0; i<dataArray.length; i++) {
    rgbToRgbaDataBuffer[i*4] = dataArray[i][0];   // Red
    rgbToRgbaDataBuffer[i*4+1] = dataArray[i][1]; // Green
    rgbToRgbaDataBuffer[i*4+2] = dataArray[i][2]; // Blue
    rgbToRgbaDataBuffer[i*4+3] = 255;             // Alpha
  }

  var rawImageData = {
    data: rgbToRgbaDataBuffer,
    width: width,
    height: height
  };

  var jpegImageData = jpeg.encode(rawImageData, 100);

  fs.writeFile(filename, jpegImageData.data, function(err) {
    if(err) return console.log(err);
    callback();
  });

};

module.exports = imageUtils;