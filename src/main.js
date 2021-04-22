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
    console.log(nightjar.Tensor([[1,2,3],[4,5,6]]));
}

main();