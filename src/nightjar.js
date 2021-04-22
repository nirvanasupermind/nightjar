//nightjar Library
//Usage permitted under terms of MIT License

var Int64 = require("./Int64.js");
var Tensor = require("./Tensor.js");

//the nightjar module
var nightjar = new function () {
    this.Int64 = Int64;
    this.Tensor = Tensor;
}

module.exports = nightjar;