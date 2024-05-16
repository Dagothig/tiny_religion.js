class Overlay extends PIXI.Sprite {
    constructor(z) {
        super(PIXI.whitePixel);
        this.nonCullable = true;
        this.z = z;
        this.flashes = [];
        this.fadeIns = [];
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
        for (const fadeIn of this.fadeIns) {
            alpha = Math.max((fadeIn.duration - fadeIn.time) / fadeIn.duration, alpha);
            fadeIn.time--;
            if (fadeIn.time < -10) {
                fadeIn.onEnd();
            }
        }
        this.alpha = Math.pow(alpha, 2);
    }
    flash(duration) {
        this.flashes.push({time: duration, duration: duration});
    }
    fadeIn(duration, onEnd) {
        this.fadeIns.push({ time: duration, duration, onEnd });
    }
    outputState() {
        return {
            alpha: this.alpha,
            flashes: this.flashes.slice()
        };
    }
}
Overlay.fromState = function(state, z, game) {
    let overlay = new Overlay(z);
    overlay.alpha = state.alpha;
    overlay.flashes = state.flashes;
    return overlay;
};
