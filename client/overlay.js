class Overlay extends PIXI.Sprite {
    constructor(texture = PIXI.whitePixel) {
        super(texture);
        this.flashes = [];
    }
    render(delta, game, renderer) {
        this.x = -game.x;
        this.y = -game.y;
        this.width = renderer.width;
        this.height = renderer.height;

        let alpha = 0;
        for (let i = this.flashes.length; i--;) {
            let flash = this.flashes[i];
            alpha = Math.max(flash.time / flash.duration, alpha);
            flash.time--;
            if (!flash.time) this.flashes.splice(i, 1);
        }
        this.alpha = alpha;
    }
    flash(duration) {
        this.flashes.push({time: duration, duration: duration});
    }
    get z() { return 1000; }
    outputState() {
        return {
            alpha: this.alpha,
            flashes: this.flashes.slice()
        };
    }
}
Overlay.fromState = function(state, game) {
    let overlay = new Overlay();
    overlay.alpha = state.alpha;
    overlay.flashes = state.flashes;
    return overlay;
};