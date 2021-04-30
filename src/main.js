//nightjar Library
//Usage permitted under terms of MIT License

//testing file
var nightjar = require("./nightjar.js");
function get_performance(task) {
    var a = Date.now();
    task();
    var b = Date.now();
    return b-a;
}
function main() {
   var times = 1e5;
   console.log(nightjar.Int64(189).modular(5).toNumber());
}

main();
