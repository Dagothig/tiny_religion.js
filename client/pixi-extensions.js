'use strict';

(function() {

    let rMask = 0xff0000, rShift = 16,
        gMask = 0x00ff00, gShift = 8,
        bMask = 0x0000ff, bShift = 0;
    let part = (c1, c2, i, j, mask, shift) =>
        (((c1 & mask) >> shift) * j + ((c2 & mask) >> shift) * i) << shift;
    function interpolateColors(c1, c2, i = 0) {
        let j = 1 - i;
        return part(c1, c2, i, j, rMask, rShift)
            | part(c1, c2, i, j, gMask, gShift)
            | part(c1, c2, i, j, bMask, bShift);
    }

    function colorFromRGB(r, g, b) {
        return (r << rShift) | (g << gShift) | (b << bShift);
    }

    let Texture = PIXI.Texture,
        Rectangle = PIXI.Rectangle,
        Sprite = PIXI.Sprite;

    function TiledTexture(texture, tw, th) {
        this.tilesX = texture.width / tw;
        this.tilesY = texture.height / th;
        if (!!((this.tilesX % 1) || (this.tilesY % 1)))
            throw ("The texture size is not a multiple of the tile size:",
                this.tilesX, this.tilesY);

        this.tiles = new Array(this.tilesX).fill().map((col, i) =>
            new Array(this.tilesY).fill().map((_, j) =>
                new Texture(texture, new Rectangle(i * tw, j * th, tw, th))));
    };
    TiledTexture.prototype.getTile =
        function getTile(x, y) { return this.tiles[x][y]; };

    function TiledSprite(tiledTexture) {
        this._tiledTexture = tiledTexture;
        this._tileX = this._tileY = 0;

        Sprite.call(this, tiledTexture.getTile(0, 0));

        let self = this;
        this._decal = {
            get x() { return self.anchor.x * self.width; },
            set x(val) { self.anchor.x = val / self.width; },
            get y() { return self.anchor.y * self.height; },
            set y(val) { self.anchor.y = val / self.height; }
        };
    };
    TiledSprite.prototype = Object.merge(Object.create(Sprite.prototype), {
        constructor: TiledSprite,

        _updateCurrentTexture() {
            this.setTexture(this._tiledTexture.getTile(this.tileX, this.tileY));
        },
        setTiledTexture(texture) {
            this._tiledTexture = texture;
            this._updateCurrentTexture();
        },

        get tileX() { return this._tileX; },
        set tileX(val) {
            this._tileX = val % this.tilesX;
            if (this._tileX < 0)
                this._tileX += this.tilesX;
            this._updateCurrentTexture();
        },

        get tileY() { return this._tileY; },
        set tileY(val) {
            this._tileY = val % this.tilesY;
            if (this._tileY < 0)
                this._tileY += this.tilesY;
            this._updateCurrentTexture();
        },

        get tilesX() { return this._tiledTexture.tilesX; },
        get tilesY() { return this._tiledTexture.tilesY; },

        get decal() { return this._decal; },
        set decal(val) {
            this._decal.x = val.x;
            this._decal.y = val.y;
        }
    });

    function AnimatedSprite(tiledTexture, fps, loop) {
        this.fps = fps;
        this.loop = loop;
        this.currentFrame = this.frameDuration;
        TiledSprite.call(this, tiledTexture);
    };
    AnimatedSprite.prototype = Object.merge(Object.create(TiledSprite.prototype), {
        constructor: AnimatedSprite,

        get fps() { return this._fps; },
        set fps(val) {
            this._fps = val;
            this.frameDuration = 1000 / val;
        },
        update: function(delta) {
            this.currentFrame -= delta;
            while (this.currentFrame < 0) {
                this.currentFrame += this.frameDuration;
                if (!this.loop) {
                    let tmp = this.tileX + 1;
                    if (tmp < this.tilesX) this.tileX++;
                } else this.tileX++;
            }
        }
    });

    requestAnimationFrame(() => {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff, 1);
    graphics.drawRect(0, 0, 1, 1);
    graphics.closePath();
    PIXI.whitePixel = graphics.generateTexture(); });

    PIXI.Color = {
        interpolate: interpolateColors,
        fromRGB: colorFromRGB
    };
    PIXI.TiledTexture = TiledTexture;
    PIXI.TiledSprite = TiledSprite;
    PIXI.AnimatedSprite = AnimatedSprite;
})();