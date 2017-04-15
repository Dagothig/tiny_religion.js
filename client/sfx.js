'use strict';

class SFXType {
    constructor(decalX, decalY, decalZ, frameDuration) {
        this.decalX = decalX;
        this.decalY = decalY;
        this.decalZ = decalZ;
        this.frameDuration = frameDuration;
    }
}
let Blood = new SFXType(4, 10, 0, 8),
    Summon = new SFXType(4, 10, 0, 8),
    Sparkle = new SFXType(4, 10, 0, 8),
    Lightning = new SFXType(16, 128, 0, 8);

class SFX extends PIXI.TiledSprite {
    constructor(x, y, type, z) {
        super(type.texture);
        this.currentFrame = type.frameDuration;
        this.decal = { x: type.decalX, y: type.decalY };
        this.x = x;
        this.y = y;
        this.z = z;
        if (Math.random() < 0.5) this.scale.x = -1;
        this.tileY = type.tileY;
        this.type = type;
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
}
PIXI.loader
.add('lightning', 'images/Lightning.png', null, res => {
    SFX.lightning = new PIXI.TiledTexture(res.texture, 32, 128);
    Lightning.texture = SFX.lightning;
    Lightning.tileY = 0;
})
.add('miscSFX', 'images/SpecialEffects.png', null, res => {
    SFX.misc = new PIXI.TiledTexture(res.texture, 8, 12)
    Blood.texture = Summon.texture = Sparkle.texture = SFX.misc;
    Blood.tileY = 0;
    Summon.tileY = 1;
    Sparkle.tileY = 2;
})