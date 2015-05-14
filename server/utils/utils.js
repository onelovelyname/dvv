var utils = {};

//Function to create arrays for testing purposes
utils.createMatrixArrays = function(matrixSize, arrayLength){
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

module.exports = utils;