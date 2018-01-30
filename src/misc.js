export default {
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