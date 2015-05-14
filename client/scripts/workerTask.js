//Import our math script
importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/1.6.0/math.min.js");
importScripts("https://raw.githubusercontent.com/dfcreative/color-space/master/dist/color-space.min.js");
importScripts("../bower_components/delta-e/dist/deltae.global.min.js");

//Listen to incoming data, evaluate the data and return it
self.addEventListener('message', function(e) {
  var element = e.data.payload;
  var result = eval(e.data.fn);
  self.postMessage(result);
}, false);