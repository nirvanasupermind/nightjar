//nightjar Library
//Usage permitted under terms of MIT License

var Int64 = require("./Int64.js");

//the nightjar module
var nightjar = new function () {
    this.Int64 = Int64;
}

module.exports = nightjar;