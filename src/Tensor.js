var assert = require("assert");
//taken from https://stackoverflow.com/questions/55420156/get-arrays-depth-in-javascript
function getArrayDepth(value) {
    return Array.isArray(value) ? 
      1 + Math.max(...value.map(getArrayDepth)) :
      0;
}

function shape(value) {
    if(getArrayDepth(value) === 0) return [1];
    if(getArrayDepth(value) === 1) return [value.length];
    return shape(value.map((el) => el[0])).concat(shape(value[0]));
}

//element-wise unary operator
function unary_op(f,a) {
    if(getArrayDepth(a) === 0) {
        return f(a);
    } else {
        return a.map((el) => unary_op(f,el));
    }
}


//element-wise binary operator
function bin_op(f,a,b) {
    assert(shape(a).toString() === shape(b).toString());
    if(getArrayDepth(a) === 0) {
        return f(a,b);
    } else {
        return a.map((el,i) => bin_op(f,a[i],b[i]));
    }
}



/**
 * An unoptimized tensor object.
 * @param {Array} elements 
 */
function Tensor(elements) {
    if(!(this instanceof Tensor)) {
        return new Tensor(elements);
    }

    if(elements instanceof Tensor) { 
        elements = elements.elements;
    }

    this.elements = unary_op(parseFloat,elements);
}


//Alias.
Tensor.prototype.plus = Tensor.prototype.add;
Tensor.prototype.minus = Tensor.prototype.subtract = Tensor.prototype.sub;
Tensor.prototype.multiply = Tensor.prototype.times = Tensor.prototype.mul;
Tensor.prototype.divide = Tensor.prototype.div;
Tensor.prototype.modular = Tensor.prototype.mod;


module.exports = Tensor;