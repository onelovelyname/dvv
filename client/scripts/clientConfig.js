dvvClientConfig({
  "onData" : onDataAnim,    // animate the arrival of data with EXPLOSIONS!
  "onReady": startAnim,     // agitate force layout
  "onProgress": updateProgress, // update progess meter
  "onEndProgress": stopAnim,
  "onResults": displayCompletion, // display final results
  "numberOfWorkers": 1
});

dvvClientStart();