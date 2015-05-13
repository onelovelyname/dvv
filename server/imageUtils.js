var fs = require('fs');
var PNG = require('node-png').PNG;
 
var imageUtils = {};

imageUtils.createDataArrayFromImageFile = function(filename, callback){

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

module.exports = imageUtils;