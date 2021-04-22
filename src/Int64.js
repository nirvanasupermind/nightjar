//nightjar Library
//Usage permitted under terms of MIT License

//CONSTANTS
var hex2bin = {"0":["0","0","0","0"],"1":["0","0","0","1"],"2":["0","0","1","0"],"3":["0","0","1","1"],"4":["0","1","0","0"],"5":["0","1","0","1"],"6":["0","1","1","0"],"7":["0","1","1","1"],"8":["1","0","0","0"],"9":["1","0","0","1"],"10":["1","0","1","0"],"11":["1","0","1","1"],"12":["1","1","0","0"],"13":["1","1","0","1"],"14":["1","1","1","0"],"15":["1","1","1","1"]};
var bin2hex = {"0,0,0,0":0,"0,0,0,1":1,"0,0,1,0":2,"0,0,1,1":3,"0,1,0,0":4,"0,1,0,1":5,"0,1,1,0":6,"0,1,1,1":7,"1,0,0,0":8,"1,0,0,1":9,"1,0,1,0":10,"1,0,1,1":11,"1,1,0,0":12,"1,1,0,1":13,"1,1,1,0":14,"1,1,1,1":15};

//HELPERS
//taken from https://codereview.stackexchange.com/questions/92966/multiplying-and-adding-big-numbers-represented-with-strings
function add(a, b) {
    if (parseInt(a) == 0 && parseInt(b) == 0) {
        return "0";
    }

    a = a.split("").reverse();
    b = b.split("").reverse();
    var result = [];

    for (var i = 0; (a[i] >= 0) || (b[i] >= 0); i++) {
        var sum = (parseInt(a[i]) || 0) + (parseInt(b[i]) || 0);

        if (!result[i]) {
            result[i] = 0;
        }

        var next = parseInt((result[i] + sum) / 10);
        result[i] = (result[i] + sum) % 10;

        if (next) {
            result[i + 1] = next;
        }
    }

    return result.reverse().join("");
}

//taken from https://stackoverflow.com/questions/2050111/subtracting-long-numbers-in-javascript
var subtract = (a, b) => [a, b].map(n => [...n].reverse()).reduce((a, b) => a.reduce((r, d, i) => {
    let s = d - (b[i] || 0)
    if (s < 0) {
        s += 10
        a[i + 1]--
    }
    return '' + s + r
}, '').replace(/^0+/, ''))


//taken from https://codereview.stackexchange.com/questions/92966/multiplying-and-adding-big-numbers-represented-with-strings
function multiply(a, b) {
    if (parseInt(a) === 0 || parseInt(b) === 0) {
        return "0";
    }

    a = a.split("").reverse();
    b = b.split("").reverse();
    var result = [];

    for (var i = 0; a[i] >= 0; i++) {
        for (var j = 0; b[j] >= 0; j++) {
            if (!result[i + j]) {
                result[i + j] = 0;
            }

            result[i + j] += a[i] * b[j];
        }
    }

    for (var i = 0; result[i] >= 0; i++) {
        if (result[i] >= 10) {
            if (!result[i + 1]) {
                result[i + 1] = 0;
            }

            result[i + 1] += parseInt(result[i] / 10);
            result[i] %= 10;
        }
    }

    return result.reverse().join("");
}

function factorial(n) {
    if ((n === 0) || (n === 1))
        return 1;
    else
        return (n * factorial(n - 1));
}


//taken from https://locutus.io/php/strings/ord/
function ord(string) {
    const str = string + ''
    const code = str.charCodeAt(0)
    if (code >= 0xD800 && code <= 0xDBFF) {
        // High surrogate (could change last hex to 0xDB7F to treat
        // high private surrogates as single characters)
        const hi = code
        if (str.length === 1) {
            // This is just a high surrogate with no following low surrogate,
            // so we return its value;
            return code
            // we could also throw an error as it is not a complete character,
            // but someone may want to know
        }
        const low = str.charCodeAt(1)
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
        // Low surrogate
        // This is just a low surrogate with no preceding high surrogate,
        // so we return its value;
        return code
        // we could also throw an error as it is not a complete character,
        // but someone may want to know
    }
    return code
}


// Returns true if str1 is smaller than str2.
function isSmaller(str1, str2) {
    // Calculate lengths of both string
    var n1 = str1.length, n2 = str2.length;
    if (n1 < n2)
        return true;
    if (n2 < n1)
        return false;

    for (var i = 0; i < n1; i++)
        if (str1.charAt(i) < str2.charAt(i))
            return true;
        else if (str1.charAt(i) > str2.charAt(i))
            return false;

    return false;
}



function longDivision(number, divisor) {
    if (isSmaller(number, divisor.toString())) { return "0"; }
    //As result can be very large store it in string  
    var ans = "";
    //Find prefix of number that is larger than divisor.  
    var idx = 0;
    var temp = ord(number[idx]) - ord('0');
    while (temp < divisor) {
        temp = (temp * 10 + ord(number[idx + 1]) - ord('0'));
        idx += 1;
    }
    idx += 1;

    //Repeatedly divide divisor with temp. After every division, update temp to 
    //include one more digit.  
    while (number.length > idx) {
        //Store result in answer i.e. temp / divisor  
        ans += String.fromCharCode((temp / divisor) + ord('0'));
        //Take next digit of number 
        temp = ((temp % divisor) * 10 + ord(number[idx]) - ord('0'));
        idx += 1;
    }

    ans += String.fromCharCode((temp / divisor) + ord('0'));

    //If divisor is greater than number  
    if (ans.length === 0) {
        return "0";
    }
    //else return ans  
    return ans;
}

function mod(a, b) {
    return subtract(a, multiply(longDivision(a, b), b)) || "0";
}

function pow(a, b) {
    return (b === 0 ? "1" : multiply(pow(a, b - 1), a));
}

function from_v(v) {
    var result = new Int64(0);
    result.v = v;
    return result;
}

//Converts number to hex
function toHex(v) {
    var result = new Array(15);
    for (var i = 15; i >= 0; i--) {
        result[i] = parseInt(mod(v, "16"));
        if (parseInt(v) < 16) {
            v = "0";
        } else {
            v = longDivision(v, "16");
        }
    }

    return result;
}

//MAIN CLASS
/**
 * Represents a 64-bit signed integer.
 * @param {string|number|Int64} [v]
 */
function Int64(v = "0") {
    if (!(this instanceof Int64)) {
        return new Int64(v);
    } else {
        v = "" + v;
        if (v.charAt(0) === "-") { //Two's complement
            v = subtract("18446744073709551616", v.substring(1));
        }

        this.v = toHex("" + v);
    }
}



/**
 * Addition.
 * @param {string|number|Int64} other 
 */
Int64.prototype.add = function (other) {
    other = new Int64(other);

    var a = this.v.reverse().slice(0);
    var b = other.v.reverse().slice(0);
    var result = [];

    for (var i = 0; (a[i] >= 0) || (b[i] >= 0); i++) {
        var sum = (parseInt(a[i]) || 0) + (parseInt(b[i]) || 0);

        if (!result[i]) {
            result[i] = 0;
        }

        var next = parseInt((result[i] + sum) / 16);
        result[i] = (result[i] + sum) % 16;

        if (next) {
            result[i + 1] = next;
        }
    }

    return from_v(result.reverse().slice(-16));
}

/**
 * Returns the negated value.
 */
Int64.prototype.neg = function () {
    return new Int64(
        from_v(this.v.map((hex_digit, i) => (i === this.v.length - 1
            ? 16 - hex_digit
            : 16 - hex_digit - 1))).toUnsignedString()
    );
}

/**
 * Returns the absolute value of method.
 */
Int64.prototype.abs = function () {
    return this.isNegative() ? this.neg() : this;
}

/**
 * Returns an integer that indicates the sign of the number.
 */
Int64.prototype.sign = function() { 
    if(this.toNumber() === 0) { return new Int64(1); }   
    return this.div(this.abs());
}

/**
 * Subtraction.
 * @param {string|number|Int64} other 
 */
Int64.prototype.sub = function (other) {
    other = new Int64(other);
    return this.add(other.neg());
}

/**
 * Multiplication.
 * @param {string|number|Int64} other 
 */
Int64.prototype.mul = function (other) {
    other = new Int64(other);
    if (this.isNegative() && other.isNegative()) {   //Deal with negatives
        return this.neg().mul(other.neg());
    } else if (this.isNegative() && other.isPositive()) {
        return this.neg().mul(other).neg();
    } else if (this.isPositive() && other.isNegative()) {
        return this.mul(other.neg()).neg();
    } else if (this.toNumber() === 0 || other.toNumber() === 0) { //Zero
        return new Int64(0);
    } else { //Main body
        //TODO: optimize this
        var a = this.v.reverse();
        var b = other.v.reverse();
        var result = [];

        for (var i = 0; a[i] >= 0; i++) {
            for (var j = 0; b[j] >= 0; j++) {
                if (!result[i + j]) {
                    result[i + j] = 0;
                }

                result[i + j] += a[i] * b[j];
            }
        }

        for (var i = 0; result[i] >= 0; i++) {
            if (result[i] >= 16) {
                if (!result[i + 1]) {
                    result[i + 1] = 0;
                }

                result[i + 1] += parseInt(result[i] / 16);
                result[i] %= 16;
            }
        }

        return from_v(result.reverse().slice(-16));
    }
}

/**
 * Integer division.
 * @param {string|number|Int64} other 
 */
Int64.prototype.div = function(other) {
    other = new Int64(other);
    if (this.isNegative() && other.isNegative()) {   //Deal with negatives
        return this.neg().div(other.neg());
    } else if (this.isNegative() && other.isPositive()) {
        //special case: this is floor division, not trunc division, 
        //so we need to subtract 1 from result if there is a remainder
        var t = this.neg().div(other).neg();
        var rem = this.neg().sub(t.mul(other.neg()));
        
        if(rem.toNumber() === 0) {
            return t;
        } else {
            return t.sub(1);
        }
    } else if (this.isPositive() && other.isNegative()) {
        //special case almost exactly same as above
        var t = this.div(other.neg()).neg();
        // console.log("ooo!",t);
        var rem = this.neg().sub(t.mul(other.neg()));
        // console.log(t.toString(),rem.toString());
        if(rem.toNumber() === 0) {
            return t;
        } else {
           return t.sub(1);
        }
    } else if (other.toNumber() === 0) { //edge case
        throw new Error("division by zero");
    } else { 
    var n = this.v, d = other.toNumber();
    var num = n,
        numLength = num.length,
        remainder = 0,
        answer = [],
        i = 0;

    while( i < numLength){
        var digit = parseInt(num[i]);

        answer.push(Math.floor((digit + (remainder * 16))/d));
        remainder = (digit + (remainder * 16))%d;
        i++;
    }

    return from_v(answer);
}

}

/**
 * Returns the division remainder.
 * @param {string|number|Int64} other
 */
Int64.prototype.mod = function(other) {
    other = new Int64(other);
    if (other.toNumber() === 0) return new Int64(0);
    if (this.sign()*other.sign()===-1) return this.abs().mod(other.abs()).neg();
    if (this.sign()===-1) return this.abs().mod(other.abs());

    return this.sub(this.div(other).mul(other));
}

/**
 * Applies bitwise AND.
 * @param {string|number|Int64} other 
 */
Int64.prototype.and = function(other) {
    other = new Int64(other);
    var two = new Int64(2);
    var bin1 = [].concat.apply([],this.v.map((e) => hex2bin[e]));
    var bin2 = [].concat.apply([],other.v.map((e) => hex2bin[e]));
    var bin3 = bin1.map((_,idx) => bin1[idx] & bin2[idx]);

    var result = new Int64(0);
    for(var i = 0; i < bin3.length; i++) {
        if(bin3[i]) { result = result.add(two.pow(bin3.length-i-1)); }
    }

    return result;
}


/**
 * Applies bitwise OR.
 * @param {string|number|Int64} other 
 */
 Int64.prototype.or = function(other) {
    other = new Int64(other);
    var two = new Int64(2);
    var bin1 = [].concat.apply([],this.v.map((e) => hex2bin[e]));
    var bin2 = [].concat.apply([],other.v.map((e) => hex2bin[e]));
    var bin3 = bin1.map((_,idx) => bin1[idx] | bin2[idx]);

    var result = new Int64(0);
    for(var i = 0; i < bin3.length; i++) {
        if(bin3[i]) { result = result.add(two.pow(bin3.length-i-1)); }
    }

    return result;
}


/**
 * Applies bitwise XOR.
 * @param {string|number|Int64} other 
 */
 Int64.prototype.xor = function(other) {
    other = new Int64(other);
    var two = new Int64(2);
    var bin1 = [].concat.apply([],this.v.map((e) => hex2bin[e]));
    var bin2 = [].concat.apply([],other.v.map((e) => hex2bin[e]));
    var bin3 = bin1.map((_,idx) => bin1[idx] ^ bin2[idx]);

    var result = new Int64(0);
    for(var i = 0; i < bin3.length; i++) {
        if(bin3[i]) { result = result.add(two.pow(bin3.length-i-1)); }
    }

    return result;
}




/**
 * Exponentiation.
 * @param {string|number} exponent
 */
Int64.prototype.pow = function(exponent) {
    exponent = parseInt(exponent);
    if(exponent < 0) throw new Error("no negative exponents");
    var result = new Int64(1);
    for(var i = 0; i < exponent; i++) {
        result = result.mul(this);
    }

    return result;
}

/**
 * Returns whether number is negative. Returns false for 0.
 */
Int64.prototype.isNegative = function () {
    return this.v[0] >= 8;
}

/**
 * Returns whether number is positive. Returns true for 0.
 */
Int64.prototype.isPositive = function () {
    return !this.isNegative();
}

/**
 * Returns whether number is less than other.
 * @param {Int64} other 
 */
Int64.prototype.lt = function (other) {
    other = new Int64(other);
    if(this.isNegative() && other.isNegative()) return !this.neg().lt(other.neg())
    if(this.isNegative() && other.isPositive()) return true
    if(this.isPositive() && other.isNegative()) return false

    var a = this.v.map((e) => "0123456789abcdef".charAt(e)).join("");
    var b = other.v.map((e) => "0123456789abcdef".charAt(e)).join("");

    return a.localeCompare(b) === -1;
}

/**
 * Converts the number into Number.
 */

Int64.prototype.toNumber = function () {
    return parseInt(this.toString());
}

/**
 * Converts the number into String.
 */
Int64.prototype.toString = function () {
    if (this.isNegative()) {
        return "-" + this.neg().toUnsignedString()
    }
    return this.toUnsignedString();
}

Int64.prototype.toUnsignedString = function () {
    var result = "0";
    for (var i = 0; i < this.v.length; i++) {
        var t = "1";
        //Compute power of 16
        for (var j = 0; j < this.v.length - i - 1; j++) {
            t = multiply("16", t);
        }


        result = add(result, multiply(t, "" + this.v[i]));
    }

    return result;
}

Int64.MIN_VALUE = new Int64("-9223372036854775808");
Int64.MAX_VALUE = new Int64("9223372036854775807");


//Alias.
Int64.prototype.plus = Int64.prototype.add;
Int64.prototype.minus = Int64.prototype.subtract = Int64.prototype.sub;
Int64.prototype.multiply = Int64.prototype.times = Int64.prototype.mul;
Int64.prototype.divide = Int64.prototype.div;
Int64.prototype.modular = Int64.prototype.mod;

module.exports = Int64;