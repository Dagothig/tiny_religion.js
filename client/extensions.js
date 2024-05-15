'use strict';

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
String.prototype.padStart = String.prototype.padStart
|| function padStart(targetLength,padString) {
    //floor if number or convert non-number to 0;
    targetLength = targetLength >> 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
        return String(this);
    }
    else {
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
            //append to original to ensure we are longer than needed
            padString += padString.repeat(targetLength/padString.length);
        }
        return padString.slice(0,targetLength) + String(this);
    }
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
Array.from = Array.from || (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
                T = arguments[2];
            }
        }
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
    };
}());

Array.prototype.fill = Array.prototype.fill || function fill(value) {
    // Steps 1-2.
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
        len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
        O[k] = value;
        k++;
    }

    // Step 13.
    return O;
};

// Randomize array element order in-place using Durstenfeld shuffle algorithm.
Array.prototype.shuffle =
Int8Array.prototype.shuffle =
Uint8Array.prototype.shuffle =
Uint8ClampedArray.prototype.shuffle =
Int16Array.prototype.shuffle =
Uint16Array.prototype.shuffle =
Int32Array.prototype.shuffle =
Uint32Array.prototype.shuffle =
Float32Array.prototype.shuffle =
Float64Array.prototype.shuffle =
function shuffle() {
    for (var i = this.length; i--;) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

Array.prototype.toObject = function(fn) {
    return Object.fromEntries(fn ? this.map(fn) : this);
}

Math.dst2 = function(a1, a2, b1, b2) {
    let delta1 = b1 - a1, delta2 = b2 - a2;
    return delta1 * delta1 + delta2 * delta2;
};
Math.dst = function() { return Math.sqrt(Math.dst2.apply(this, arguments)); };
Math.bounded = (v, m, M) => Math.min(Math.max(v, m), M);
Math.shift = (v, m, M) => {
    let range = M - m;
    while (v < m) v += range;
    return v % range;
};
Math.randRange = (min, max) => Math.random() * (max - min) + min;
Math.TWO_PI = Math.PI * 2;
Math.angularDistance = (a, b) => Math.min(Math.abs(a - b), Math.abs(b - a));

Object.merge = function merge(to) {
    Array.from(arguments).slice(1).forEach(src => {
        if (!src) return;
        Object.defineProperties(to, Object.keys(src).reduce((descrs, key) => {
            descrs[key] = Object.getOwnPropertyDescriptor(src, key);
            return descrs;
        }, {}));
    });
    return to;
}
Object.only = (obj, ...keys) => keys.reduce((o, k) => (o[k] = obj[k], o), {});
Object.except = (obj, ...keys) =>
    Object.only.call(null, obj, Object.keys(obj).filter(x => keys.indexOf(x) === -1));

Object.merge(Array.prototype, {
    add: Array.prototype.push,
    remove() {
        for (let i = 0; i < arguments.length; i++) {
            let index = this.indexOf(arguments[i]);
            if (index === -1) continue;
            this.splice(index, 1);
        }
    },
    rand_i() {
        return (Math.random() * this.length)|0;
    },
    rand() {
        return this[this.rand_i()];
    },
    get first() {
        return this[0];
    },
    get last() {
        return this[this.length - 1];
    }
});

let Misc = {
    touchToMouseEv(ev) {
        let newEv = Array.from(ev.touches).reduce((obj, touch) => {
            obj.pageX += touch.pageX;
            obj.pageY += touch.pageY;
            return obj;
        }, { pageX: 0, pageY: 0 });
        newEv.pageX /= ev.touches.length;
        newEv.pageY /= ev.touches.length;
        return newEv;
    },
    wrap(f1, f2) { return (...args) => f2(f1.apply(this, args)); }
};

function dom(name, attributes, ...children) {
    let el = document.createElement(name);
    Object.entries(attributes)
        .forEach(x =>
            dom.eventHandlers[x[0]] ? el.addEventListener(x[0], x[1]) :
            el[dom.nameMap[x[0]] || x[0]] = x[1]);
    appendChildren(el, children);
    return el;
}
function appendChildren(el, children) {
    children.filter(x => x).forEach(x =>
        x instanceof Array ? appendChildren(el, x) :
        x instanceof HTMLElement ? el.appendChild(x) :
        el.appendChild(document.createTextNode(x)));
}
dom.eventHandlers = ['click', 'animationend', 'change']
    .reduce((n, x) => (n[x] = true, n), {});
dom.nameMap = { 'class': 'className' };
