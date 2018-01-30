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
export let 
    Blood = new SFXType(4, 10, 0, 8),
    Summon = new SFXType(4, 10, 0, 8),
    Sparkle = new SFXType(4, 10, 0, 8, {
        SFX() { this.rotation = Math.randRange(0, Math.TWO_PI); }
    }),
    Lightning = new SFXType(16, 128, 0, 8),
    TopBeam = new SFXType(3, 125, 3, 4),
    BigSummon = new SFXType(8, 20, 4, 4),
    Explosion = new SFXType(48, 48, 48, 4);

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
.add('explosion', 'images/Explosion.png', null,
    res => Explosion.texture = new PIXI.TiledTexture(res.texture, 96, 96));

export default SFXType;