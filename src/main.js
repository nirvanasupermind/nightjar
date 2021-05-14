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
   var a = nightjar.Int64(2).cmp(nightjar.Int64(80));
   console.log(a.toString());
}

main();
