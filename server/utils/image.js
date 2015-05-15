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

    // take jpeg data (from file read) and decode it into an object
    // {width: ... , height: ... , data: <buffer ... >}
    var parsedData = jpeg.decode(data);

    // create a dataArray to hold the pixels from the raw image data
    var dataArray = []; // dataArray = [ [r,g,b,a], [r,g,b,a], [r,g,b,a], [r,g,b,a], ... ]
    for (var i=0; i<parsedData.data.length; i+=4) {

      // grab the rgba values (red, green, blue, alpha) from the raw image data
      var r = parsedData.data[i];
      var g = parsedData.data[i+1];
      var b = parsedData.data[i+2];
      var a = parsedData.data[i+3];
      var rgba = [r,g,b,a]; // individual pixel

      // push the pixel to the dataArray
      dataArray.push(rgba);
    }

    // callback that makes use of the dataArray
    // the callback needs to hold onto the width and height.
    // dataArray is a flat array, has no way to express width and height,
    // which will be needed by the createJpegFileFromDataArray function
    // to reassemble the jpeg from the incoming dataArray formed from the
    // data coming from the clients.
    callback(dataArray, parsedData.width, parsedData.height);

  });



};

imageUtils.createJpegFileFromDataArray = function(filename, dataArray, width, height, callback){

  // dataArray is assumed to be the same format as what was produced from createDataArrayFromJpegFile(...)
  // [ [r,g,b], [r,g,b], [r,g,b], [r,g,b], ... ] , except with the alpha missing

  // the jpeg image needs to have the alpha value even though jpegs don't use transparency.
  // rgbToRgbaDataBuffer takes the rgb triplet from dataArray along with a default alpha value
  // to populate the raw image data buffer for the jpeg file. 
  var rgbToRgbaDataBuffer = new Buffer(width * height * 4);
  for (var i=0; i<dataArray.length; i++) {
    rgbToRgbaDataBuffer[i*4] = dataArray[i][0];   // Red
    rgbToRgbaDataBuffer[i*4+1] = dataArray[i][1]; // Green
    rgbToRgbaDataBuffer[i*4+2] = dataArray[i][2]; // Blue
    rgbToRgbaDataBuffer[i*4+3] = 255;             // Alpha
  }

  // raw image data object needed by the jpeg encode function
  var rawImageData = {
    data: rgbToRgbaDataBuffer,
    width: width,
    height: height
  };

  // jpeg image data needed to write the file
  var jpegImageData = jpeg.encode(rawImageData, 100);

  // write jpeg file, then execute a callback on completion
  fs.writeFile(filename, jpegImageData.data, function(err) {
    if(err) return console.log(err);
    callback();
  });

};

module.exports = imageUtils;