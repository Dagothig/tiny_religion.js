'use strict';

class Bird extends PIXI.AnimatedSprite {
    constructor(x, y, tint) {
        super(Bird.texture, 4, true);
        this.x = this.targetX = x;
        this.y = this.targetY = y;
        this.tint = tint;
        this.movX = this.movY = 0;
        this.anchor.x = this.anchor.y = 0.5;
        this.z = 300;
    }
    update(delta, game) {
        super.update(delta);

        if (Math.dst2(this.x, this.y, this.targetX, this.targetY) < 64) {
            let bounds = game.getLocalBounds();
            this.targetX = 1.25 * Math.randRange(bounds.left, bounds.right);
            this.targetY = 1.25 * Math.randRange(bounds.top, bounds.bottom);
        }
        this.movX += Math.sign(this.targetX - this.x) * 0.01;
        this.movY += Math.sign(this.targetY - this.y) < 0 ? -0.005 : 0.02;
        this.x += this.movX *= 0.99;
        this.y += this.movY *= 0.99;
        this.scale.x = this.movX < 0 ? -1 : 1;
    }
    die(game) {
        this.shouldRemove = true;
        game.addChild(new SFX(this.x, this.y, Blood, this.z));
    }
}
PIXI.loader.add('bird', 'images/Bird.png', null, res =>
    Bird.texture = new PIXI.TiledTexture(res.texture, 8, 8));