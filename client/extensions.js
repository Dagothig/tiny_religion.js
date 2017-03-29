'use strict';

Math.dst2 = function(a1, a2, b1, b2) {
    let delta1 = b1 - a1, delta2 = b2 - a2;
    return delta1 * delta1 + delta2 * delta2;
};
Math.dst = function() { return Math.sqrt(Math.dst2.apply(this, arguments)); };
Math.bounded = (v, m, M) => Math.min(Math.max(v, m), M);
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
Array.prototype.rand = function() {
    return this[(Math.random() * this.length)|0];
}