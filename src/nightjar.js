//nightjar Library
//Usage permitted under terms of MIT License

var ints = require("./ints.js");
var NdArray = require("./NdArray.js");

//the nightjar module
var nightjar = new function () {
    this.Int32 = ints.Int32;
    this.Int64 = ints.Int64;
    this.NdArray = NdArray;
}

module.exports = nightjar;