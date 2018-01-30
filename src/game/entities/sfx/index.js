'use strict';

class SFX extends PIXI.TiledSprite {
    constructor(x, y, type, z) {
        super((type || y).texture);
        if (x instanceof Object) {
            this.pos = x;
            z = type;
            type = y;
            y = this.pos.y;
            x = this.pos.x;
        }
        this.currentFrame = type.frameDuration;
        this.decal = { x: type.decalX, y: type.decalY };
        this.x = x;
        this.y = y;
        this.z = z;
        if (Math.random() < 0.5) this.scale.x = -1;
        this.tileY = type.tileY;
        this.type = type;
        if (this.type.SFX) this.type.SFX.apply(this, arguments);
    }
    get z() {
        return Number.isFinite(this._z) ? this._z : this.y + this.type.decalZ;
    }
    set z(val) {
        this._z = val;
    }
    update(delta, game) {
        this.currentFrame--;
        let oldTileX = this.tileX;
        while (this.currentFrame < 0) {
            this.currentFrame += this.type.frameDuration;
            if (this.tileX + 1 === this.tilesX)
                this.shouldRemove = true;
            else this.tileX++;
        }
        for (var x of this._duringCbs || [])
            x(delta, game, this, oldTileX);
    }
    render() {
        if (this.pos) {
            this.x = this.pos.x;
            this.y = this.pos.y;
        }
    }
    after(cb) {
        (this._afterCbs || (this._afterCbs = [])).push(cb);
        return this;
    }
    during(cb) {
        (this._duringCbs || (this._duringCbs = [])).push(cb);
    }
    onRemove() {
        this._afterCbs && this._afterCbs.forEach(x => x());
    }
}

export default SFX;