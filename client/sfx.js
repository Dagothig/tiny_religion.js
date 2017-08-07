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
    update() {
        this.currentFrame--;
        while (this.currentFrame < 0) {
            this.currentFrame += this.type.frameDuration;
            if (this.tileX + 1 === this.tilesX)
                this.shouldRemove = true;
            else this.tileX++;
        }
    }
    render() {
        if (this.pos) {
            this.x = this.pos.x;
            this.y = this.pos.y;
        }
    }
    after(cb) {
        (this._afterCbs = this._afterCbs || []).push(cb);
        return this;
    }
    onRemove() {
        this._afterCbs && this._afterCbs.forEach(x => x());
    }
}
PIXI.loader
.add('lightning', 'images/Lightning.png', null,
    res => Lightning.texture = new PIXI.TiledTexture(res.texture, 32, 128))
.add('miscSFX', 'images/SpecialEffects.png', null, res => {
    Blood.texture = Summon.texture = Sparkle.texture =
        new PIXI.TiledTexture(res.texture, 8, 12);
    Blood.tileY = 0;
    Summon.tileY = 1;
    Sparkle.tileY = 2;
})
.add('bigSummon', 'images/BigSummon.png', null,
    res => BigSummon.texture = new PIXI.TiledTexture(res.texture, 16, 24))
.add('topBeam', 'images/TopBeam.png', null,
    res => TopBeam.texture = new PIXI.TiledTexture(res.texture, 6, 128))
.add('explison', 'images/Explosion.png', null,
    res => Explosion.texture = new PIXI.TiledTexture(res.texture, 96, 96));

class SFXType {
    constructor(decalX, decalY, decalZ, frameDuration, ext) {
        this.decalX = decalX;
        this.decalY = decalY;
        this.decalZ = decalZ;
        this.frameDuration = frameDuration;
        this.tileY = 0;
        Object.merge(this, ext || {});
    }
}
let Blood = new SFXType(4, 10, 0, 8),
    Summon = new SFXType(4, 10, 0, 8),
    Sparkle = new SFXType(4, 10, 0, 8, {
        SFX() { this.rotation = Math.randRange(0, Math.TWO_PI); }
    }),
    Lightning = new SFXType(16, 128, 0, 8),
    TopBeam = new SFXType(3, 125, 3, 4),
    BigSummon = new SFXType(8, 20, 4, 4),
    Explosion = new SFXType(48, 48, 48, 8);