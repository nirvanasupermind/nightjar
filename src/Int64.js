//nightjar Library
//Usage permitted under terms of MIT License

//CONSTANTS
var hex_digits = "0123456789abcdef";

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

Int64.from_v = function (v) {
    var result = new Int64(0);
    result.v = v;
    return result;
}

/**
 * Addition.
 * @param {string|number|Int64} other 
 */
Int64.prototype.add = function (other) {
    other = new Int64(other);

    var a = this.v;
    var b = other.v;

    var result = [];
    var carry = 0;
    for (var i = 0; i < a.length; i++) {
        var place = a.length - i - 1;
        var digisum = a[place] + b[place] + carry;
        if (digisum >= 16)
            carry = Math.floor(digisum / 16);
        else
            carry = "0";

        result.unshift(digisum % 16);
    }

    return Int64.from_v(result);
}

/**
 * Returns the negated value.
 */
Int64.prototype.neg = function () {
    return new Int64(
        Int64.from_v(this.v.map((hex_digit, i) => (i === this.v.length - 1 ? 16 - hex_digit : 16 - hex_digit - 1))).toUnsignedString()
    );
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
    
        return Int64.from_v(result.reverse().slice(-16));
    }
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


module.exports = Int64;