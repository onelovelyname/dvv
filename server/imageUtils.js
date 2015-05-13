var fs = require('fs');
var PNG = require('node-png').PNG;
var jpeg = require('jpeg-js');

var imageUtils = {};

imageUtils.createDataArrayFromPngFile = function(filename, callback){

  fs.createReadStream(filename)
    .pipe( new PNG({ filterType: 4 }) )
    .on('parsed', function() {
      var dataArray = [];

      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;

          var r = this.data[idx];
          var g = this.data[idx+1];
          var b = this.data[idx+2];
          var a = this.data[idx+3];
          var rgba = [r,g,b,a];
          dataArray.push(rgba);

        }
      }
      callback(dataArray);
    });
};

imageUtils.createDataArrayFromJpegFile = function(filename, callback){

  fs.readFile(filename, function (err, data) {
    if (err) throw err;

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
 
    callback(dataArray);

  });

};

module.exports = imageUtils;