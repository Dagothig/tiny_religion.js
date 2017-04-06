'use strict';

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
Array.prototype.add = Array.prototype.push;
Array.prototype.remove = function() {
    for (let i = 0; i < arguments.length; i++) {
        let index = this.indexOf(arguments[i]);
        if (index === -1) continue;
        this.splice(index, 1);
    }
}
Array.prototype.rand_i = function() {
    return (Math.random() * this.length)|0;
}
Array.prototype.rand = function() {
    return this[this.rand_i()];
}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
String.prototype.padStart = String.prototype.padStart
|| function padStart(targetLength,padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
        return String(this);
    }
    else {
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0,targetLength) + String(this);
    }
};

let Misc = {
    touchToMouseEv(ev) {
        let newEv = Array.from(ev.touches).reduce((obj, touch) => {
            obj.pageX += touch.pageX;
            obj.pageY += touch.pageY;
            return obj;
        }, { pageX: 0, pageY: 0 });
        newEv.pageX /= ev.touches.length;
        newEv.pageY /= ev.touches.length;
        newEv.pageX *= scaling;
        newEv.pageY *= scaling;
        return newEv;
    },
    wrap(f1, f2) { return (...args) => f2(f1.apply(this, args)); }
};