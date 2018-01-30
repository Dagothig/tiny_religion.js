'use strict';

import 'pixi.js';

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
function colorFromHSL(h, s, l) {
    return colorFromRGB.apply(null, HSLtoRGB(h, s, l));
}
function rgbFromColor(c) {
    return [
        (c & rMask) >> rShift,
        (c & gMask) >> gShift,
        (c & bMask) >> bShift
    ];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function HSLtoRGB(h, s, l) {
    var r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t++;
            if (t > 1) t--;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function RGBtoHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function setSVGFilterColorMatrixFromColor(colorMatrix, color) {
    let rgb = rgbFromColor(color).map(p => p / 255);
    colorMatrix.setAttribute('values', `
        ${rgb[0]} 0 0 0 0
        0 ${rgb[1]} 0 0 0
        0 0 ${rgb[2]} 0 0
        0 0 0 1 0`);
}

let Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Sprite = PIXI.Sprite;

function TiledTexture(texture, tw, th) {
    this.tilesX = texture.width / tw;
    this.tilesY = texture.height / th;
    if ((this.tilesX % 1) || (this.tilesY % 1))
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
        this.texture = this._tiledTexture.getTile(this.tileX, this.tileY);
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

class OscillatingSprite extends Sprite {
    constructor(texture, duration, minX, maxX, minY, maxY) {
        super(texture);
        this.time = 0;
        this.mult = Math.PI * 2 / duration;
        this.minX = minX; this.rangeX = maxX - minX;
        this.minY = minY; this.rangeY = maxY - minY;
        this.displayX = this.displayY = 0;
    }
    update(delta) {
        this.time += this.mult * delta;
        let moment = (Math.sin(this.time) + 1)/2;
        super.x = this.displayX + moment * this.rangeX + this.minX;
        super.y = this.displayY + moment * this.rangeY + this.minY;
    }
    get x() { return this.displayX; }
    set x(val) { this.displayX = val; }
    get y() { return this.displayY; }
    set y(val) { this.displayY = val; }
}

let thresholdMatrix = [
     1.0/17.0,  9.0/17.0,  3.0/17.0, 11.0/17.0,
    13.0/17.0,  5.0/17.0, 15.0/17.0,  7.0/17.0,
     4.0/17.0, 12.0/17.0,  2.0/17.0, 10.0/17.0,
    16.0/17.0,  8.0/17.0, 14.0/17.0,  6.0/17.0
];

let sideSize = Math.sqrt(thresholdMatrix.length);

let vertShader =
    `attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat3 projectionMatrix;

    varying vec2 vTextureCoord;

    void main(void)
    {
        gl_Position = vec4(
            (projectionMatrix * vec3(aVertexPosition, 1.0)).xy,
            0.0,
            1.0);
        vTextureCoord = aTextureCoord;
    }`;

let thresholdChecks =
    new Array(sideSize).fill().reduce((n, x, i) =>
        `${n ? n + 'else' : ''} if (x == ${i}) {
            ${new Array(sideSize).fill().reduce((m, y, j) =>
                `${m ? m + 'else' : ''} if (y == ${j} && thresholdMatrix[${i}][${j}] > alpha) gl_FragColor = vec4(0);`,
                '')}}`,
        '');
let fragShader =
    `precision mediump float;

    varying vec2 vTextureCoord;

    uniform sampler2D uSampler;
    uniform mat${sideSize} thresholdMatrix;
    uniform float alpha;
    uniform vec2 dimensions;

    float modo(float x, float y) {
        return x - y * floor(x/y);
    }

    void main(void) {
        vec2 uvs = vTextureCoord.xy;
        vec4 fg = texture2D(uSampler, uvs);
        gl_FragColor = fg;

        int x = int(mod(vTextureCoord.x * dimensions.x / 2.0, ${sideSize}.0));
        int y = int(mod(vTextureCoord.y * dimensions.y / 2.0, ${sideSize}.0));

        ${thresholdChecks}
    }`;

PIXI.filters.DitherFilter =
class DitherFilter extends PIXI.Filter {
    constructor() {
        super(vertShader, fragShader);
        thresholdMatrix.forEach((n, i) => this.uniforms.thresholdMatrix[i] = n);
    }

    apply(filterManager, input, output) {
        this.uniforms.dimensions[0] = input.texture.width
        this.uniforms.dimensions[1] = input.texture.height

        filterManager.applyFilter(this, input, output);
    }

    render(alpha) {
        this.uniforms.alpha = alpha;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    let whitePixel = new PIXI.Graphics();
    whitePixel.beginFill(0xffffff, 1);
    whitePixel.drawRect(0, 0, 1, 1);
    whitePixel.closePath();
    PIXI.whitePixel = whitePixel.generateCanvasTexture();

    let gradient = new PIXI.Graphics();
    let n = 256;
    for (let i = 0; i < n; i++) {
        gradient.beginFill(0xffffff, Math.pow(i/n, 2));
        gradient.drawRect(0, i, 1, 1);
        gradient.closePath();
    }
    PIXI.gradient = gradient.generateCanvasTexture();
});

PIXI.Color = {
    interpolate: interpolateColors,
    fromRGB: colorFromRGB,
    fromHSL: colorFromHSL,
    toRGB: rgbFromColor,
    RGBtoHSL: RGBtoHSL,
    HSLtoRGB: HSLtoRGB,
    setSVGFilterColorMatrixFromColor: setSVGFilterColorMatrixFromColor
};
PIXI.TiledTexture = TiledTexture;
PIXI.TiledSprite = TiledSprite;
PIXI.AnimatedSprite = AnimatedSprite;
PIXI.OscillatingSprite = OscillatingSprite;