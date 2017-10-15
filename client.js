'use strict';

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart

String.prototype.padStart = String.prototype.padStart || function padStart(targetLength, padString) {
    //floor if number or convert non-number to 0;
    targetLength = targetLength >> 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
        return String(this);
    } else {
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            //append to original to ensure we are longer than needed
            padString += padString.repeat(targetLength / padString.length);
        }
        return padString.slice(0, targetLength) + String(this);
    }
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
Array.from = Array.from || function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) {
            return 0;
        }
        if (number === 0 || !isFinite(number)) {
            return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
                T = arguments[2];
            }
        }
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
    };
}();

Array.prototype.fill = Array.prototype.fill || function fill(value) {
    // Steps 1-2.
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
        O[k] = value;
        k++;
    }

    // Step 13.
    return O;
};

// Randomize array element order in-place using Durstenfeld shuffle algorithm.
Array.prototype.shuffle = Int8Array.prototype.shuffle = Uint8Array.prototype.shuffle = Uint8ClampedArray.prototype.shuffle = Int16Array.prototype.shuffle = Uint16Array.prototype.shuffle = Int32Array.prototype.shuffle = Uint32Array.prototype.shuffle = Float32Array.prototype.shuffle = Float64Array.prototype.shuffle = function shuffle() {
    for (var i = this.length; i--;) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};

Math.dst2 = function (a1, a2, b1, b2) {
    var delta1 = b1 - a1,
        delta2 = b2 - a2;
    return delta1 * delta1 + delta2 * delta2;
};
Math.dst = function () {
    return Math.sqrt(Math.dst2.apply(this, arguments));
};
Math.bounded = function (v, m, M) {
    return Math.min(Math.max(v, m), M);
};
Math.shift = function (v, m, M) {
    var range = M - m;
    while (v < m) {
        v += range;
    }return v % range;
};
Math.randRange = function (min, max) {
    return Math.random() * (max - min) + min;
};
Math.TWO_PI = Math.PI * 2;
Math.angularDistance = function (a, b) {
    return Math.min(Math.abs(a - b), Math.abs(b - a));
};

Object.merge = function merge(to) {
    Array.from(arguments).slice(1).forEach(function (src) {
        if (!src) return;
        Object.defineProperties(to, Object.keys(src).reduce(function (descrs, key) {
            descrs[key] = Object.getOwnPropertyDescriptor(src, key);
            return descrs;
        }, {}));
    });
    return to;
};
Object.only = function (obj) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        keys[_key - 1] = arguments[_key];
    }

    return keys.reduce(function (o, k) {
        return o[k] = obj[k], o;
    }, {});
};
Object.except = function (obj) {
    for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        keys[_key2 - 1] = arguments[_key2];
    }

    return Object.only.call(null, obj, Object.keys(obj).filter(function (x) {
        return keys.indexOf(x) === -1;
    }));
};

Object.merge(Array.prototype, {
    add: Array.prototype.push,
    remove: function remove() {
        for (var i = 0; i < arguments.length; i++) {
            var index = this.indexOf(arguments[i]);
            if (index === -1) continue;
            this.splice(index, 1);
        }
    },
    rand_i: function rand_i() {
        return Math.random() * this.length | 0;
    },
    rand: function rand() {
        return this[this.rand_i()];
    },

    get first() {
        return this[0];
    },
    get last() {
        return this[this.length - 1];
    }
});

var Misc = {
    touchToMouseEv: function touchToMouseEv(ev) {
        var newEv = Array.from(ev.touches).reduce(function (obj, touch) {
            obj.pageX += touch.pageX;
            obj.pageY += touch.pageY;
            return obj;
        }, { pageX: 0, pageY: 0 });
        newEv.pageX /= ev.touches.length;
        newEv.pageY /= ev.touches.length;
        return newEv;
    },
    wrap: function wrap(f1, f2) {
        var _this = this;

        return function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return f2(f1.apply(_this, args));
        };
    }
};

function dom(name, attributes) {
    var el = document.createElement(name);
    Object.entries(attributes).forEach(function (x) {
        return dom.eventHandlers[x[0]] ? el.addEventListener(x[0], x[1]) : el[dom.nameMap[x[0]] || x[0]] = x[1];
    });

    for (var _len4 = arguments.length, children = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        children[_key4 - 2] = arguments[_key4];
    }

    appendChildren(el, children);
    return el;
}
function appendChildren(el, children) {
    children.filter(function (x) {
        return x;
    }).forEach(function (x) {
        return x instanceof Array ? appendChildren(el, x) : x instanceof HTMLElement ? el.appendChild(x) : el.appendChild(document.createTextNode(x));
    });
}
dom.eventHandlers = ['click', 'animationend', 'change'].reduce(function (n, x) {
    return n[x] = true, n;
}, {});
dom.nameMap = { 'class': 'className' };
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

    var rMask = 0xff0000,
        rShift = 16,
        gMask = 0x00ff00,
        gShift = 8,
        bMask = 0x0000ff,
        bShift = 0;
    var part = function part(c1, c2, i, j, mask, shift) {
        return ((c1 & mask) >> shift) * j + ((c2 & mask) >> shift) * i << shift;
    };
    function interpolateColors(c1, c2) {
        var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var j = 1 - i;
        return part(c1, c2, i, j, rMask, rShift) | part(c1, c2, i, j, gMask, gShift) | part(c1, c2, i, j, bMask, bShift);
    }

    function colorFromRGB(r, g, b) {
        return r << rShift | g << gShift | b << bShift;
    }
    function colorFromHSL(h, s, l) {
        return colorFromRGB.apply(null, HSLtoRGB(h, s, l));
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
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
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
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h,
            s,
            l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);break;
                case g:
                    h = (b - r) / d + 2;break;
                case b:
                    h = (r - g) / d + 4;break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    var Texture = PIXI.Texture,
        Rectangle = PIXI.Rectangle,
        Sprite = PIXI.Sprite;

    function TiledTexture(texture, tw, th) {
        var _this = this;

        this.tilesX = texture.width / tw;
        this.tilesY = texture.height / th;
        if (this.tilesX % 1 || this.tilesY % 1) throw "The texture size is not a multiple of the tile size:", this.tilesX, this.tilesY;

        this.tiles = new Array(this.tilesX).fill().map(function (col, i) {
            return new Array(_this.tilesY).fill().map(function (_, j) {
                return new Texture(texture, new Rectangle(i * tw, j * th, tw, th));
            });
        });
    };
    TiledTexture.prototype.getTile = function getTile(x, y) {
        return this.tiles[x][y];
    };

    function TiledSprite(tiledTexture) {
        this._tiledTexture = tiledTexture;
        this._tileX = this._tileY = 0;

        Sprite.call(this, tiledTexture.getTile(0, 0));

        var self = this;
        this._decal = {
            get x() {
                return self.anchor.x * self.width;
            },
            set x(val) {
                self.anchor.x = val / self.width;
            },
            get y() {
                return self.anchor.y * self.height;
            },
            set y(val) {
                self.anchor.y = val / self.height;
            }
        };
    };
    TiledSprite.prototype = Object.merge(Object.create(Sprite.prototype), {
        constructor: TiledSprite,

        _updateCurrentTexture: function _updateCurrentTexture() {
            this.setTexture(this._tiledTexture.getTile(this.tileX, this.tileY));
        },
        setTiledTexture: function setTiledTexture(texture) {
            this._tiledTexture = texture;
            this._updateCurrentTexture();
        },


        get tileX() {
            return this._tileX;
        },
        set tileX(val) {
            this._tileX = val % this.tilesX;
            if (this._tileX < 0) this._tileX += this.tilesX;
            this._updateCurrentTexture();
        },

        get tileY() {
            return this._tileY;
        },
        set tileY(val) {
            this._tileY = val % this.tilesY;
            if (this._tileY < 0) this._tileY += this.tilesY;
            this._updateCurrentTexture();
        },

        get tilesX() {
            return this._tiledTexture.tilesX;
        },
        get tilesY() {
            return this._tiledTexture.tilesY;
        },

        get decal() {
            return this._decal;
        },
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

        get fps() {
            return this._fps;
        },
        set fps(val) {
            this._fps = val;
            this.frameDuration = 1000 / val;
        },
        update: function update(delta) {
            this.currentFrame -= delta;
            while (this.currentFrame < 0) {
                this.currentFrame += this.frameDuration;
                if (!this.loop) {
                    var tmp = this.tileX + 1;
                    if (tmp < this.tilesX) this.tileX++;
                } else this.tileX++;
            }
        }
    });

    var OscillatingSprite = function (_Sprite) {
        _inherits(OscillatingSprite, _Sprite);

        function OscillatingSprite(texture, duration, minX, maxX, minY, maxY) {
            _classCallCheck(this, OscillatingSprite);

            var _this2 = _possibleConstructorReturn(this, (OscillatingSprite.__proto__ || Object.getPrototypeOf(OscillatingSprite)).call(this, texture));

            _this2.time = 0;
            _this2.mult = Math.PI * 2 / duration;
            _this2.minX = minX;_this2.rangeX = maxX - minX;
            _this2.minY = minY;_this2.rangeY = maxY - minY;
            _this2.displayX = _this2.displayY = 0;
            return _this2;
        }

        _createClass(OscillatingSprite, [{
            key: 'update',
            value: function update(delta) {
                this.time += this.mult * delta;
                var moment = (Math.sin(this.time) + 1) / 2;
                _set(OscillatingSprite.prototype.__proto__ || Object.getPrototypeOf(OscillatingSprite.prototype), 'x', this.displayX + moment * this.rangeX + this.minX, this);
                _set(OscillatingSprite.prototype.__proto__ || Object.getPrototypeOf(OscillatingSprite.prototype), 'y', this.displayY + moment * this.rangeY + this.minY, this);
            }
        }, {
            key: 'x',
            get: function get() {
                return this.displayX;
            },
            set: function set(val) {
                this.displayX = val;
            }
        }, {
            key: 'y',
            get: function get() {
                return this.displayY;
            },
            set: function set(val) {
                this.displayY = val;
            }
        }]);

        return OscillatingSprite;
    }(Sprite);

    var thresholdMatrix = [1.0 / 17.0, 9.0 / 17.0, 3.0 / 17.0, 11.0 / 17.0, 13.0 / 17.0, 5.0 / 17.0, 15.0 / 17.0, 7.0 / 17.0, 4.0 / 17.0, 12.0 / 17.0, 2.0 / 17.0, 10.0 / 17.0, 16.0 / 17.0, 8.0 / 17.0, 14.0 / 17.0, 6.0 / 17.0];

    var sideSize = Math.sqrt(thresholdMatrix.length);

    var vertShader = 'attribute vec2 aVertexPosition;\n        attribute vec2 aTextureCoord;\n\n        uniform mat3 projectionMatrix;\n\n        varying vec2 vTextureCoord;\n\n        void main(void)\n        {\n            gl_Position = vec4(\n                (projectionMatrix * vec3(aVertexPosition, 1.0)).xy,\n                0.0,\n                1.0);\n            vTextureCoord = aTextureCoord;\n        }';

    var thresholdChecks = new Array(sideSize).fill().reduce(function (n, x, i) {
        return (n ? n + 'else' : '') + ' if (x == ' + i + ') {\n                ' + new Array(sideSize).fill().reduce(function (m, y, j) {
            return (m ? m + 'else' : '') + ' if (y == ' + j + ' && thresholdMatrix[' + i + '][' + j + '] > alpha) gl_FragColor = vec4(0);';
        }, '') + '}';
    }, '');
    var fragShader = 'precision mediump float;\n\n        varying vec2 vTextureCoord;\n\n        uniform sampler2D uSampler;\n        uniform mat' + sideSize + ' thresholdMatrix;\n        uniform float alpha;\n        uniform vec2 dimensions;\n\n        float modo(float x, float y) {\n            return x - y * floor(x/y);\n        }\n\n        void main(void) {\n            vec2 uvs = vTextureCoord.xy;\n            vec4 fg = texture2D(uSampler, uvs);\n            gl_FragColor = fg;\n\n            int x = int(mod(vTextureCoord.x * dimensions.x / 2.0, ' + sideSize + '.0));\n            int y = int(mod(vTextureCoord.y * dimensions.y / 2.0, ' + sideSize + '.0));\n\n            ' + thresholdChecks + '\n        }';

    PIXI.filters.DitherFilter = function (_PIXI$Filter) {
        _inherits(DitherFilter, _PIXI$Filter);

        function DitherFilter() {
            _classCallCheck(this, DitherFilter);

            var _this3 = _possibleConstructorReturn(this, (DitherFilter.__proto__ || Object.getPrototypeOf(DitherFilter)).call(this, vertShader, fragShader));

            thresholdMatrix.forEach(function (n, i) {
                return _this3.uniforms.thresholdMatrix[i] = n;
            });
            return _this3;
        }

        _createClass(DitherFilter, [{
            key: 'apply',
            value: function apply(filterManager, input, output) {
                this.uniforms.dimensions[0] = input.texture.width;
                this.uniforms.dimensions[1] = input.texture.height;

                filterManager.applyFilter(this, input, output);
            }
        }, {
            key: 'render',
            value: function render(alpha) {
                this.uniforms.alpha = alpha;
            }
        }]);

        return DitherFilter;
    }(PIXI.Filter);

    window.addEventListener('DOMContentLoaded', function () {
        var whitePixel = new PIXI.Graphics();
        whitePixel.beginFill(0xffffff, 1);
        whitePixel.drawRect(0, 0, 1, 1);
        whitePixel.closePath();
        PIXI.whitePixel = whitePixel.generateTexture();

        var gradient = new PIXI.Graphics();
        var n = 256;
        for (var i = 0; i < n; i++) {
            gradient.beginFill(0xffffff, Math.pow(i / n, 2));
            gradient.drawRect(0, i, 1, 1);
            gradient.closePath();
        }
        PIXI.gradient = gradient.generateTexture();
    });

    PIXI.Color = {
        interpolate: interpolateColors,
        fromRGB: colorFromRGB,
        fromHSL: colorFromHSL,
        RGBtoHSL: RGBtoHSL,
        HSLtoRGB: HSLtoRGB
    };
    PIXI.TiledTexture = TiledTexture;
    PIXI.TiledSprite = TiledSprite;
    PIXI.AnimatedSprite = AnimatedSprite;
    PIXI.OscillatingSprite = OscillatingSprite;
})();
'use strict';

var strs = {
    tips: {
        jobs: 'villagers make babies and cut trees\n            priests make summons and convert\n            warriors fight, builders build',
        buildings: 'houses raise the pop limit\n            barracks make warriors stronger\n            temples raise the summon limit\n            and make priests better\n            greenhouses raise the sapling limit\n            bridges discover new islands',
        color: 'God has changed color!\n            Is God the same?',
        please: 'God demands pleasing!\n            Find out what pleases God!'
    },
    msgs: {
        noSpot: {
            message: 'no suitable spot found',
            extra: 'try again or make room'
        },

        builded: {
            message: 'project limit reached',
            extra: 'wait for current projects to complete or conquer more islands'
        },
        noIsland: 'island not owned',
        building: function building(type) {
            return 'building ' + type.name;
        },

        growed: {
            message: 'sapling limit reached',
            extra: 'wait or build more greenshouses'
        },
        planting: 'tree planted',

        noTree: {
            message: 'no tree to cut',
            extra: 'plant more trees'
        },
        treeNotFound: {
            message: 'tree not found',
            extra: 'try again or plant more trees'
        },
        treeFelled: 'tree felled',

        trained: function trained(job) {
            return job.name + ' trained';
        },
        villagerNotFound: 'no villager found',

        untrained: function untrained(job) {
            return job.name + ' untrained';
        },
        jobNotFound: function jobNotFound(job) {
            return 'no ' + job.name + ' untrained';
        },

        housed: {
            message: 'pop limit reached',
            extra: 'build houses, plant trees, conquer islands or kill people'
        },
        babyMade: 'baby made',
        babyAttempted: {
            message: 'baby attempted',
            extra: 'give villagers more time or make more villagers'
        },

        templed: {
            message: 'pop limit reached',
            extra: 'build more temples'
        },
        summonDone: 'summon successful',
        summonAttempted: {
            message: 'summon attempted',
            extra: 'give priests more time or train more priests'
        },

        praying: 'praying',

        noEnemy: 'no enemy',
        attacking: 'warriors sent',
        converting: 'priests sent',

        noRetreat: 'no one to retreat',
        retreating: 'retreating',

        noSacrifice: 'nobody to sacrifice',
        sacrificing: 'boom!'
    }
};
'use strict';

/* Usage of settings:
<strat> should implement read(key, conf) and write(key, conf)
(local-storage-strat is an exemple)
<confs> is an object of configurations. Each configuration is a tuple consisting of:
the default value, the type of the value and the nature of access of the value.
the type of the value can be 'str', 'num' or 'bool' and reflects the types
that should be supported by the strat
(corresponding to string, numerical and boolean each)
example of use:
let settingsEx = settings(strat, {
    boolEx: [true, 'bool', 'usr'],
    numEx: [0, 'num', 'sys'],
    strEx: ['', 'str', 'usr'],
    choiceEx: ['short', 'choice', 'usr', { short: 1, medium: 2, long: 3 }]
});
*/
var settings = function (strat, confs) {
    return Object.keys(confs).reduce(function (settings, key) {
        var conf = confs[key];

        settings.all.push(key);
        settings[conf[2]].push(key);

        var _key = '_' + key;
        var _keyConf = _key + 'Conf';
        var _keyCBs = _key + 'CBs';

        settings[_key] = strat.read(key, conf);
        settings[_keyConf] = conf;
        settings[_keyCBs] = [];

        Object.defineProperty(settings, key, {
            get: function get() {
                return this[_key];
            },
            set: function set(val) {
                this[_key] = strat.write(key, conf, val);
                this[_keyCBs].forEach(function (cb) {
                    return cb(val);
                });
            }
        });

        return settings;
    }, {
        all: [],
        usr: [],
        sys: [],
        bind: function bind(key, cb) {
            this['_' + key + 'CBs'].push(cb);
            cb(this[key]);
        },
        _clear: function _clear(key) {
            var _this = this;

            this[key] = this['_' + key + 'Conf'][0];
            this['_' + key + 'CBs'].forEach(function (cb) {
                return cb(_this[key]);
            });
        },
        clear: function clear() {
            var _this2 = this;

            if (arguments.length) Array.from(arguments).forEach(function (key) {
                return _this2._clear(key);
            });else this.all.forEach(function (key) {
                return _this2._clear(key);
            });
        },
        _index: function _index(name, conf) {
            // Fuzzy search
            return Object.values(conf[3]).findIndex(function (e) {
                return e.value == settings[name];
            });
        },
        _inputFor: {
            str: function str(name) {
                return dom('input', { type: 'text', value: settings[name] });
            },
            num: function num(name) {
                return dom('input', { type: 'numeric', value: settings[name] });
            },
            bool: function bool(name) {
                return dom('input', { type: 'checkbox', checked: settings[name] });
            },
            choice: function choice(name, conf) {
                return dom('select', { selectedIndex: settings._index(name, conf) }, Object.entries(conf[3]).map(function (x) {
                    return dom('option', { value: x[1] }, x[0]);
                }));
            }
        },
        inputFor: function inputFor(name) {
            var _this3 = this;

            var conf = this['_' + name + 'Conf'];
            var input = this._inputFor[conf[1]](name, conf);
            input.id = input.name = name;
            input.onchange = conf[1] === 'bool' ? function () {
                return _this3[name] = input.checked;
            } : function () {
                return _this3[name] = input.value;
            };
            this.bind(name, function (t) {
                return input.value = input.checked = t;
            });
            return input;
        }
    });
}( /* local storage strat */{
    str: { toStr: function toStr(str) {
            return str + '';
        }, fromStr: function fromStr(str) {
            return str;
        } },
    num: { toStr: function toStr(num) {
            return num + '';
        }, fromStr: function fromStr(str) {
            return new Number(str).valueOf();
        } },
    bool: { toStr: function toStr(val) {
            return val ? 'true' : 'false';
        }, fromStr: function fromStr(str) {
            return str === 'true';
        } },
    choice: {
        toStr: function toStr(val, conf) {
            return (// Fuzzy equality
                Object.entries(conf[3]).find(function (entry) {
                    return entry[1] == val;
                })[0]
            );
        },
        fromStr: function fromStr(str, conf) {
            return Object.entries(conf[3]).find(function (entry) {
                return entry[0] === str;
            })[1];
        }
    },

    read: function read(key, conf) {
        var stored = localStorage.getItem(key);
        return stored !== null ? this[conf[1] || 'str'].fromStr(stored, conf) : conf[0];
    },
    write: function write(key, conf, value) {
        localStorage.setItem(key, this[conf[1] || 'str'].toStr(value, conf));
        return value;
    }
}, {
    tips: [true, 'bool', 'usr'],
    tooltips: [true, 'bool', 'usr'],
    music: [true, 'bool', 'usr'],
    sound: [true, 'bool', 'usr'],
    goal: [12000, 'choice', 'sys', {
        tiny: 3000,
        short: 6000,
        medium: 12000,
        long: 24000
    }],
    fps: [false, 'bool', 'usr']
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetchSound = function fetchSound(src) {
    var el = document.createElement('audio');
    el.src = src;
    el.volume = 1;
    return el;
};

var Sound = function () {
    function Sound() {
        var _this = this;

        _classCallCheck(this, Sound);

        for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
            paths[_key] = arguments[_key];
        }

        this.paths = paths;
        this.sounds = paths.map(function (p, i) {
            var snd = fetchSound(p);
            var self = _this;
            snd.onended = function () {
                self.available[i].add(this);
            };
            return snd;
        });
        this.available = this.sounds.map(function (s) {
            return Object.merge([s], { total: 1 });
        });
    }

    _createClass(Sound, [{
        key: 'play',
        value: function play(onended) {
            var volume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            if (Sound.mute) return;
            var i = this.sounds.rand_i();
            var sound = this.available[i].pop();
            if (!sound && this.available[i].total < 5) {
                var base = this.sounds[i];
                sound = base.cloneNode();
                sound.onended = base.onended;
                this.available[i].total++;
            }
            if (!sound) return;
            if (onended) {
                var handler = function handler() {
                    onended();
                    sound.removeEventListener('ended', handler);
                };
                sound.addEventListener('ended', handler);
            }
            sound.volume = volume;
            sound.play();
        }
    }]);

    return Sound;
}();

settings.bind('sound', function (m) {
    return Sound.mute = !m;
});
var sounds = {
    titleScreen: new Sound('sounds/TitleScreen.mp3'),

    build: new Sound('sounds/Build.mp3'),
    done: new Sound('sounds/Done.mp3'),

    builderTrain: new Sound('sounds/BuilderTrain.mp3'),
    warriorTrain: new Sound('sounds/WarriorTrain.mp3'),
    priestTrain: new Sound('sounds/PriestTrain.mp3'),
    untrain: new Sound('sounds/VillagerTrain.mp3'),

    baby: new Sound('sounds/DoBabies.mp3'),
    summon: new Sound('sounds/Summon.mp3'),
    pray: new Sound('sounds/Pray.mp3'),

    hit: new Sound('sounds/Hit1.mp3', 'sounds/Hit2.mp3', 'sounds/Hit3.mp3'),
    convert: new Sound('sounds/Convert.mp3'),
    death: new Sound('sounds/Death.mp3'),
    lightning: new Sound('sounds/Lightning.mp3'),

    islandLose: new Sound('sounds/IslandLose.mp3'),
    islandWin: new Sound('sounds/IslandWin.mp3'),

    angry: new Sound('sounds/Angry.mp3'),
    happy: new Sound('sounds/Happy.mp3'),

    new: new Sound('sounds/New.mp3'),
    loss: new Sound('sounds/Loss.mp3'),
    win: new Sound('sounds/Win.mp3')
};

var Music = {
    music: null,
    switchTo: function switchTo(music) {
        if (music === this.music) return;
        if (this.music) this.music.pause();
        this.music = music;
        this.music.currentTime = 0;
        if (this.play) music.play();
    },
    toggle: function toggle(play) {
        this.play = play;
        if (this.music) {
            if (this.play) this.music.play();else this.music.pause();
        }
    },
    stop: function stop() {
        if (!this.music) return;
        this.music.pause();
        this.music = null;
    },
    resume: function resume() {
        if (!this.music || !this.play) return;
        this.music.play();
    },
    pause: function pause() {
        if (!this.music) return;
        this.music.pause();
    }
};
settings.bind('music', function (p) {
    return Music.toggle(p);
});
var musics = {
    regular: fetchSound('sounds/Music1.ogg'),
    combat: fetchSound('sounds/Music2.ogg')
};
Object.keys(musics).map(function (k) {
    return musics[k];
}).forEach(function (m) {
    m.volume = 0.5;m.loop = true;
});
"use strict";

// Title state
var titleState = {};

// Game state
var gameState = {};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SFX = function (_PIXI$TiledSprite) {
    _inherits(SFX, _PIXI$TiledSprite);

    function SFX(x, y, type, z) {
        _classCallCheck(this, SFX);

        var _this = _possibleConstructorReturn(this, (SFX.__proto__ || Object.getPrototypeOf(SFX)).call(this, (type || y).texture));

        if (x instanceof Object) {
            _this.pos = x;
            z = type;
            type = y;
            y = _this.pos.y;
            x = _this.pos.x;
        }
        _this.currentFrame = type.frameDuration;
        _this.decal = { x: type.decalX, y: type.decalY };
        _this.x = x;
        _this.y = y;
        _this.z = z;
        if (Math.random() < 0.5) _this.scale.x = -1;
        _this.tileY = type.tileY;
        _this.type = type;
        if (_this.type.SFX) _this.type.SFX.apply(_this, arguments);
        return _this;
    }

    _createClass(SFX, [{
        key: 'update',
        value: function update(delta, game) {
            this.currentFrame--;
            var oldTileX = this.tileX;
            while (this.currentFrame < 0) {
                this.currentFrame += this.type.frameDuration;
                if (this.tileX + 1 === this.tilesX) this.shouldRemove = true;else this.tileX++;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (this._duringCbs || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var x = _step.value;

                    x(delta, game, this, oldTileX);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.pos) {
                this.x = this.pos.x;
                this.y = this.pos.y;
            }
        }
    }, {
        key: 'after',
        value: function after(cb) {
            (this._afterCbs || (this._afterCbs = [])).push(cb);
            return this;
        }
    }, {
        key: 'during',
        value: function during(cb) {
            (this._duringCbs || (this._duringCbs = [])).push(cb);
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            this._afterCbs && this._afterCbs.forEach(function (x) {
                return x();
            });
        }
    }, {
        key: 'z',
        get: function get() {
            return Number.isFinite(this._z) ? this._z : this.y + this.type.decalZ;
        },
        set: function set(val) {
            this._z = val;
        }
    }]);

    return SFX;
}(PIXI.TiledSprite);

PIXI.loader.add('lightning', 'images/Lightning.png', null, function (res) {
    return Lightning.texture = new PIXI.TiledTexture(res.texture, 32, 128);
}).add('miscSFX', 'images/SpecialEffects.png', null, function (res) {
    Blood.texture = Summon.texture = Sparkle.texture = new PIXI.TiledTexture(res.texture, 8, 12);
    Blood.tileY = 0;
    Summon.tileY = 1;
    Sparkle.tileY = 2;
}).add('bigSummon', 'images/BigSummon.png', null, function (res) {
    return BigSummon.texture = new PIXI.TiledTexture(res.texture, 16, 24);
}).add('topBeam', 'images/TopBeam.png', null, function (res) {
    return TopBeam.texture = new PIXI.TiledTexture(res.texture, 6, 128);
}).add('explosion', 'images/Explosion.png', null, function (res) {
    return Explosion.texture = new PIXI.TiledTexture(res.texture, 96, 96);
});

var SFXType = function SFXType(decalX, decalY, decalZ, frameDuration, ext) {
    _classCallCheck(this, SFXType);

    this.decalX = decalX;
    this.decalY = decalY;
    this.decalZ = decalZ;
    this.frameDuration = frameDuration;
    this.tileY = 0;
    Object.merge(this, ext || {});
};

var Blood = new SFXType(4, 10, 0, 8),
    Summon = new SFXType(4, 10, 0, 8),
    Sparkle = new SFXType(4, 10, 0, 8, {
    SFX: function SFX() {
        this.rotation = Math.randRange(0, Math.TWO_PI);
    }
}),
    Lightning = new SFXType(16, 128, 0, 8),
    TopBeam = new SFXType(3, 125, 3, 4),
    BigSummon = new SFXType(8, 20, 4, 4),
    Explosion = new SFXType(48, 48, 48, 4);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var God = function (_PIXI$Container) {
    _inherits(God, _PIXI$Container);

    function God() {
        _classCallCheck(this, God);

        var _this = _possibleConstructorReturn(this, (God.__proto__ || Object.getPrototypeOf(God)).call(this));

        _this.mood = _this.overallMood = 0;
        _this.lookAtX = _this.lookAtY = 0;

        _this.background = new PIXI.Sprite(God.background);
        _this.background.anchor.x = 0.5;
        _this.background.x = -10;

        _this.head = new PIXI.Sprite(God.head);
        _this.head.anchor.x = 0.5;
        _this.head.x = -10;

        _this.leftEyeSocket = new PIXI.Container();
        _this.leftEyeSocket.x = -70;_this.leftEyeSocket.y = 74;
        _this.leftEye = new PIXI.Sprite(God.eye);
        _this.leftEye.anchor.x = _this.leftEye.anchor.y = 0.5;
        _this.leftEyeSocket.addChild(_this.leftEye);

        _this.rightEyeSocket = new PIXI.Container();
        _this.rightEyeSocket.x = 70;_this.rightEyeSocket.y = 74;
        _this.rightEye = new PIXI.Sprite(God.eye);
        _this.rightEye.anchor.x = _this.rightEye.anchor.y = 0.5;
        _this.rightEyeSocket.addChild(_this.rightEye);

        _this.leftBrow = new PIXI.TiledSprite(God.brow);
        _this.leftBrow.anchor.x = _this.leftBrow.anchor.y = 0.5;
        _this.leftBrow.x = -74;_this.leftBrow.y = 56;

        _this.rightBrow = new PIXI.TiledSprite(God.brow);
        _this.rightBrow.anchor.x = _this.rightBrow.anchor.y = 0.5;
        _this.rightBrow.x = 74;_this.rightBrow.y = 56;
        _this.rightBrow.scale.x = -1;

        _this.mouth = new PIXI.TiledSprite(God.mouth);
        _this.mouth.anchor.x = _this.mouth.anchor.y = 0.5;
        _this.mouth.x = -2;_this.mouth.y = 112;

        _this.addChild(_this.background, _this.head, _this.leftEyeSocket, _this.rightEyeSocket, _this.leftBrow, _this.rightBrow, _this.mouth);

        _this.events = {
            warrior: function warrior() {
                return -_this.likesLife / 2;
            },
            priest: function priest() {
                return _this.likesAttention / 2;
            },
            builder: function builder() {
                return _this.likesManMade / 2;
            },
            baby: function baby() {
                return _this.likesLife;
            },
            bridge: function bridge() {
                return _this.likesManMade * 4;
            },
            house: function house() {
                return _this.likesManMade * 2 + _this.likesLife * 1.5;
            },
            barracks: function barracks() {
                return _this.likesManMade * 3 - _this.likesLife * 2;
            },
            temple: function temple() {
                return _this.likesManMade * 3 + _this.likesAttention * 2;
            },
            workshop: function workshop() {
                return _this.likesManMade * 4;
            },
            greenhouse: function greenhouse() {
                return -_this.likesManMade * 3 + _this.likesLife * 2;
            },
            tree: function tree() {
                return _this.likesLife - _this.likesManMade;
            },
            fallingTree: function fallingTree() {
                return _this.likesManMade - _this.likesLife;
            },
            sacrifice: function sacrifice() {
                return _this.likesAttention - _this.likesLife * 2;
            },
            fight: function fight() {
                return -_this.likesLife / 150;
            },
            kill: function kill() {
                return -_this.likesLife * 2;
            },
            converting: function converting() {
                return _this.likesAttention / 150;
            },
            convert: function convert() {
                return _this.likesAttention + _this.likesLife;
            },
            pray: function pray() {
                return _this.likesAttention;
            },
            summon: function summon() {
                return _this.likesAttention / 2 - _this.likesLife / 2;
            },
            statue: function statue() {
                return _this.likesAttention * 2 + _this.likesManMade * 2;
            }
        };

        _this.changePersonality(true);
        _this.birds = [];
        return _this;
    }

    _createClass(God, [{
        key: 'update',
        value: function update(delta, game) {
            this.overallMood += this.mood;
            this.mood /= 1.01;
            if (Math.abs(this.mood) < 0.01) this.mood = 0;

            // Birds
            if (Math.random() < 0.01) if (this.birds.length < this.birdTarget) {
                var bounds = game.getLocalBounds();
                var bird = new Bird(Math.randRange(bounds.left, bounds.right), Math.randRange(bounds.top, bounds.bottom), this.tint);
                this.birds.add(bird);
                game.addChild(bird);
                game.addChild(new SFX(bird.x, bird.y, Summon, bird.z));
            } else if (this.birds.length > this.birdTarget) {
                var _bird = this.birds.rand();
                if (_bird) {
                    game.addChild(new SFX(_bird.x, _bird.y, Lightning, _bird.z));
                    _bird.die(game);
                    this.birds.remove(_bird);
                    this.lookAt(_bird);
                }
            }

            var feeling = this.feeling(game.goal);

            if (feeling < 0) {
                feeling *= -1;
                // Check for punish
                if (Math.random() < feeling * this.deathModifier / 200) this.doSacrifice(game);

                if (Math.random() < feeling * this.natureModifier / 200) this.convertToTree(game);

                if (Math.random() < feeling * this.lifeModifier / 200) this.convertToBird(game);
            } else {
                // Check for reward
                if (Math.random() < feeling * this.deathModifier / 400) this.convertToMinotaur(game);

                if (Math.random() < feeling * this.natureModifier / 600) this.convertToBigTree(game);

                if (Math.random() < feeling * this.attentionModifier / 600) game.player.build(game, Statue, true);
            }

            if (this.mood > 0) {
                this.satisfaction += this.mood;
                if (this.satisfaction > game.goal / 5) this.changePersonality(false, game);
            }

            this.sincePersonality++;
            if (this.sincePersonality > God.personalityLength) this.changePersonality(false, game);
        }
    }, {
        key: 'render',
        value: function render(delta, game, renderer) {
            this.background.tint = PIXI.Color.interpolate(game.cloudColor, 0xffffff, 0.5);

            var feeling = this.feeling(game.goal);
            this.tileY = Math.bounded(3 - Math.round(feeling * 3), 0, 6);

            var x = this.x + this.leftEyeSocket.x,
                y = this.y + this.leftEyeSocket.y;
            var dstToLeftEye = Math.dst(x, y, this.lookAtX, this.lookAtY);
            this.leftEye.x = 4 * (this.lookAtX - x) / dstToLeftEye;
            this.leftEye.y = 4 * (this.lookAtY - y) / dstToLeftEye;

            x = this.x + this.rightEyeSocket.x;
            y = this.y + this.rightEyeSocket.y;
            var dstToRightEye = Math.dst(x, y, this.lookAtX, this.lookAtY);
            this.rightEye.x = 4 * (this.lookAtX - x) / dstToRightEye;
            this.rightEye.y = 4 * (this.lookAtY - y) / dstToRightEye;
        }
    }, {
        key: 'randomPerson',
        value: function randomPerson(game, filter) {
            var islands = game.islands.filter(function (i) {
                return i.people.find(function (p) {
                    return p.kingdom === game.player;
                });
            });
            var island = islands.rand();
            if (!island) return null;
            var dude = void 0,
                i = 10;
            do {
                dude = island.people.rand();
            } while (!(dude.kingdom === game.player && (!filter || filter(dude))) && i--);
            return i + 1 && dude;
        }
    }, {
        key: 'randomBuilding',
        value: function randomBuilding(game, filter) {
            var island = game.islands.filter(function (i) {
                return i.kingdom === game.player;
            }).rand();
            return island && island.buildings.filter(filter || function () {
                return true;
            }).rand();
        }
    }, {
        key: 'doSacrifice',
        value: function doSacrifice(game) {
            var dude = this.randomPerson(game);
            if (!dude) return strs.msgs.noSacrifice;
            this.event('sacrifice', 1, dude.position);
            game.addChild(new SFX(dude.x, dude.y, Lightning));
            sounds.lightning.play();
            game.overlay.flash(8);
            dude.die(game);
            return strs.msgs.sacrificing;
        }
    }, {
        key: 'convertToMinotaur',
        value: function convertToMinotaur(game) {
            var minotaur = this.randomPerson(game, function (x) {
                return x.job !== Minotaur;
            });
            if (!minotaur) return;
            game.addChild(new SFX(minotaur, TopBeam).after(function () {
                if (minotaur.shouldRemove) return;
                minotaur.sinceTookDamage = 24;
                game.addChild(new SFX(minotaur, BigSummon));
                sounds.warriorTrain.play();
                minotaur.changeJob(Minotaur);
            }));
        }
    }, {
        key: 'convertToTree',
        value: function convertToTree(game) {
            var _this2 = this;

            var person = this.randomPerson(game);
            if (!person) return;
            game.addChild(new SFX(person, TopBeam).after(function () {
                if (person.shouldRemove) return;
                _this2.event(Tree.name, 1, person.position);
                game.addChild(new SFX(person.x, person.y, BigSummon));
                sounds.done.play();
                var tree = new Building(person.x, person.y, Tree, person.kingdom, person.island, true);
                person.island.buildings.filter(function (b) {
                    return b.type !== BigTree && b.type !== Bridge && b.isInRadius(tree, 0.1);
                }).forEach(function (b) {
                    return b.explode(game);
                });
                tree.grow = 0.3;
                person.island.buildings.add(tree);
                game.addChild(tree);
                person.shouldRemove = true;
            }));
        }
    }, {
        key: 'convertToBigTree',
        value: function convertToBigTree(game) {
            var tree = this.randomBuilding(game, function (x) {
                return x.type === Tree;
            });
            if (!tree) return;
            game.addChild(new SFX(tree, TopBeam).after(function () {
                if (tree.kingdom !== game.player) return;
                game.addChild(new SFX(tree, BigSummon));
                var bigTree = new Building(tree.x, tree.y, BigTree, tree.kingdom, tree.island, true);
                bigTree.grow = 0.1;
                tree.island.buildings.add(bigTree);
                game.addChild(bigTree);
                tree.shouldRemove = true;
            }));
        }
    }, {
        key: 'convertToBird',
        value: function convertToBird(game) {
            var _this3 = this;

            var person = this.randomPerson(game);
            if (!person) return;

            game.addChild(new SFX(person, TopBeam).after(function () {
                if (person.shouldRemove) return;
                game.addChild(new SFX(person.x, person.y, Blood));
                person.shouldRemove = true;
                _this3.event('baby', 1, person.position);
                for (var i = 3; i--;) {
                    var bird = new Bird(person.x, person.y - 4, _this3.tint);
                    _this3.birds.add(bird);
                    game.addChild(bird);
                }
            }));
        }
    }, {
        key: 'feeling',
        value: function feeling(goal) {
            return (this.mood + this.overallMood / (this.overallMood < 0 ? goal / 4 : goal)) / 2;
        }
    }, {
        key: 'changePersonality',
        value: function changePersonality(base, game) {
            if (game) game.overlay.flash(60);
            sounds.new.play();
            this.sincePersonality = 0;
            this.mood = 0;
            this.satisfaction = 0;

            var min = -God.preferenceModifier,
                max = God.preferenceModifier;
            if (base) {
                this.updatePersonality(max, -min, max / 4);
                this.sincePersonality = God.personalityLength * 4 / 5;
            } else {
                var range = max - min;
                this.updatePersonality(min + Math.random() * range, min + Math.random() * range, min + Math.random() * range);
            }
            if (game) game.onGodChangePersonality();
        }
    }, {
        key: 'updatePersonality',
        value: function updatePersonality(life, man, attention) {
            this.likesLife = life;
            this.likesAttention = attention;
            this.likesManMade = man;
            this.birdTarget = 5 + 5 * (this.likesLife / God.preferenceModifier);
            this.updateColor();
        }
    }, {
        key: 'updateColor',
        value: function updateColor() {
            var life = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.likesLife / God.preferenceModifier;
            var man = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.likesManMade / God.preferenceModifier;
            var attention = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.likesAttention / God.preferenceModifier;

            // Get the angle into the range [0, 4[
            var stops = God.hues.length;
            var angle = Math.atan2(man, life) * 2 / Math.PI + stops;

            var start = God.hues[Math.floor(angle) % stops];
            var end = God.hues[Math.ceil(angle) % stops];
            if (end < start) end += 1;
            var hue = Math.shift(start + (end - start) * (angle % 1), 0, 1);
            var saturation = Math.max(Math.abs(life), Math.abs(man));
            var lightness = attention / (attention < 0 ? 6 : 4) + 0.5;
            this.tint = PIXI.Color.fromHSL(hue, saturation, lightness);
            this.offTint = PIXI.Color.fromHSL(hue, saturation * 0.5, lightness * 0.5);
        }
    }, {
        key: 'event',
        value: function event(what, scalar, where) {
            if (!this.events[what]) return;
            var change = this.events[what]() * scalar;
            // Negative changes are slightly larger than positive to prevent abuse
            if (change < 0) change *= 1.5;
            this.mood += change;
            this.lookAt(where);
        }
    }, {
        key: 'lookAt',
        value: function lookAt(pt) {
            this.lookAtX = pt.x;
            this.lookAtY = pt.y;
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return {
                likesLife: this.likesLife,
                likesAttention: this.likesAttention,
                likesManMade: this.likesManMade,
                mood: this.mood,
                overallMood: this.overallMood,
                sincePersonality: this.sincePersonality,
                satisfaction: this.satisfaction,
                lookAtX: this.lookAtX,
                lookAtY: this.lookAtY
            };
        }
    }, {
        key: 'readState',
        value: function readState(state, game) {
            this.likesLife = state.likesLife;
            this.likesAttention = state.likesAttention;
            this.likesManMade = state.likesManMade;
            this.mood = state.mood;
            this.overallMood = state.overallMood;
            this.sincePersonality = state.sincePersonality;
            this.satisfaction = state.satisfaction;
            this.lookAtX = state.lookAtX;
            this.lookAtY = state.lookAtY;
            this.updateColor();
        }
    }, {
        key: 'z',
        get: function get() {
            return -200;
        }
    }, {
        key: 'tint',
        set: function set(val) {
            this.head.tint = this.mouth.tint = this.leftBrow.tint = this.rightBrow.tint = val;
        },
        get: function get() {
            return this.head.tint;
        }
    }, {
        key: 'tileY',
        get: function get() {
            return this.mouth.tileY;
        },
        set: function set(val) {
            this.mouth.tileY = this.leftBrow.tileY = this.rightBrow.tileY = val;
        }
    }, {
        key: 'lifeModifier',
        get: function get() {
            return Math.max(this.likesLife, 0);
        }
    }, {
        key: 'deathModifier',
        get: function get() {
            return -Math.min(this.likesLife, 0);
        }
    }, {
        key: 'manMadeModifier',
        get: function get() {
            return Math.max(this.likesManMade, 0);
        }
    }, {
        key: 'natureModifier',
        get: function get() {
            return -Math.min(this.likesManMade, 0);
        }
    }, {
        key: 'attentionModifier',
        get: function get() {
            return Math.max(this.likesAttention, 0);
        }
    }, {
        key: 'hermitModifier',
        get: function get() {
            return -Math.min(this.likesAttention, 0);
        }
    }]);

    return God;
}(PIXI.Container);

God.preferenceModifier = 1;
God.personalityLength = 5000;
// The quadrants are +life, +man, -life, -man
God.hues = [9 / 16, 13 / 16, 0 / 16, 4 / 16];
PIXI.loader.add('background', 'images/Background.png', null, function (res) {
    return God.background = res.texture;
}).add('head', 'images/God.png', null, function (res) {
    return God.head = res.texture;
}).add('eye', 'images/Eye.png', null, function (res) {
    return God.eye = res.texture;
}).add('brow', 'images/Brow.png', null, function (res) {
    return God.brow = new PIXI.TiledTexture(res.texture, 34, 45);
}).add('mouth', 'images/Mouth.png', null, function (res) {
    return God.mouth = new PIXI.TiledTexture(res.texture, 98, 54);
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kingdom = function () {
    function Kingdom(name, tint, isPlayer) {
        var _this = this;

        _classCallCheck(this, Kingdom);

        this.name = name;
        this.tint = tint;
        this.isPlayer = isPlayer;

        var resetCount = function resetCount(x) {
            return _this[x.name + 'Count'] = 0;
        };

        this.islandCount = 0;
        this.unfinished = 0;
        this.growing = 0;
        Building.types.forEach(resetCount);
        this.peopleCount = 0;
        this.summonCount = 0;
        Person.jobs.forEach(resetCount);

        var personCount = function personCount(amount) {
            return function (x) {
                return x.kingdom === _this && (x.isSummon ? _this.summonCount += amount : _this.peopleCount += amount, _this[x.job.name + 'Count'] += amount);
            };
        };
        this.addToPersonCount = personCount(1);
        this.removeFromPersonCount = personCount(-1);

        var buildingCount = function buildingCount(amount) {
            return function (x) {
                return x.finished ? _this[x.type.name + 'Count'] += amount : x.type === Tree ? _this.growing += amount : x.type !== FallingTree ? _this.unfinished += amount : null;
            };
        };
        this.addToBuildingCount = buildingCount(1);
        this.removeFromBuildingCount = buildingCount(-1);

        var islandCount = function islandCount(amount) {
            return function (x) {
                return _this.islandCount += amount;
            };
        };
        this.addToIslandCount = islandCount(1);
        this.removeFromIslandCount = islandCount(-1);
    }

    _createClass(Kingdom, [{
        key: 'count',
        value: function count(game) {
            var _this2 = this;

            this.islandCount = 0;
            this.unfinished = 0;
            this.growing = 0;
            Building.types.forEach(this.resetCount);
            this.peopleCount = 0;
            this.summonCount = 0;
            Person.jobs.forEach(this.resetCount);
            game.islands.forEach(function (island) {
                island.people.forEach(_this2.addToPersonCount);
                if (island.kingdom !== _this2) return;
                _this2.islandCount++;
                island.buildings.forEach(_this2.addToBuildingCount);
            });
        }
    }, {
        key: 'linkedTo',
        value: function linkedTo(game, other) {
            for (var i = 0; i < game.islands.length - 1; i++) {
                var j = i + 1;
                var islI = game.islands[i],
                    islJ = game.islands[j];
                if (islI.bridge && islI.bridge.finished && (islI.kingdom === this && islJ.kingdom === other || islI.kingdom === other && islJ.kingdom === this)) return true;
            }
            return false;
        }
    }, {
        key: 'findOfJob',
        value: function findOfJob(game, job, filter) {
            for (var i = 0; i < game.islands.length; i++) {
                var island = game.islands[i];
                for (var j = 0; j < island.people.length; j++) {
                    var person = island.people[j];
                    if (person.kingdom === this && person.job === job && (!filter || filter(person))) return person;
                }
            }
        }
    }, {
        key: 'build',
        value: function build(game, type) {
            var skipChecks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (!skipChecks && this.builded) return strs.msgs.builded;
            var isls = game.islands.slice(0).sort(function () {
                return Math.random() - 0.5;
            });
            for (var i = 0; i < isls.length; i++) {
                var isl = isls[i];
                if (isl.kingdom !== this) continue;
                var building = isl.generateBuilding(type, false);
                if (!building) continue;
                game.addChild(building);
                for (var j = 0; j < 3; j++) {
                    var person = this.findOfJob(game, Builder, function (p) {
                        return !p.building;
                    });
                    if (!person) break;
                    person.building = building;
                    person.movements.length = 0;
                }
                if (this.isPlayer) {
                    game.god.event(type.name, 0.5, building.position);
                    sounds.build.play();
                }
                return strs.msgs.building(type);
            }
            return strs.msgs.noSpot;
        }
    }, {
        key: 'buildBridge',
        value: function buildBridge(game) {
            var _this3 = this;

            var skipChecks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!skipChecks && this.builded) return strs.msgs.builded;
            var index = game.islands.findIndex(function (i) {
                return !i.bridge && i.kingdom === _this3;
            });
            var island = game.islands[index];
            if (!island) return strs.msgs.noIsland;

            var bridge = island.generateBridge(false);
            game.addChild(bridge);
            if (index === game.islands.length - 1) game.generateNewIsland();

            for (var j = 0; j < 3; j++) {
                var person = this.findOfJob(game, Builder, function (p) {
                    return !p.building;
                });
                if (!person) break;
                person.building = bridge;
                person.movements.length = 0;
            }
            if (this.isPlayer) {
                game.god.event(Bridge.name, 0.5, bridge.position);
                sounds.build.play();
            }
            return strs.msgs.building(bridge.type);
        }
    }, {
        key: 'forestate',
        value: function forestate(game) {
            var skipChecks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!skipChecks && this.growed) return strs.msgs.growed;
            for (var i = 0; i < game.islands.length * 3; i++) {
                var island = game.islands.rand();
                if (island.kingdom !== this) continue;
                var tree = island.generateBuilding(Tree, false);
                if (!tree) continue;
                game.addChild(tree);
                if (this.isPlayer) {
                    game.god.event(Tree.name, 0.5, tree.position);
                    sounds.build.play();
                }
                return strs.msgs.planting;
            }
            return strs.msgs.noSpot;
        }
    }, {
        key: 'deforest',
        value: function deforest(game) {
            var _this4 = this;

            var islands = game.islands.filter(function (island) {
                return island.kingdom === _this4;
            });
            if (!this.treeCount) return strs.msgs.noTree;
            var trees = null,
                island = null,
                maxTries = 10000;
            while (!trees || !trees.length) {
                island = islands[Math.random() * islands.length | 0];
                trees = island.buildings.filter(function (b) {
                    return b.type === Tree && b.finished;
                });
                if (!maxTries--) return strs.msgs.treeNotFound;
            }
            if (!trees || !trees.length) return strs.msgs.treeNotFound;
            var tree = trees[Math.random() * trees.length | 0];
            tree.shouldRemove = true;
            var felled = new Building(tree.x, tree.y, FallingTree, this, island);
            game.addChild(felled);
            island.buildings.add(felled);
            if (this.isPlayer) {
                game.god.event('fallingTree', 0.5, felled.position);
                sounds.build.play();
            }
            return strs.msgs.treeFelled;
        }
    }, {
        key: 'train',
        value: function train(game, job) {
            var person = this.findOfJob(game, Villager);
            if (person) {
                game.addChild(new SFX(person.x, person.y, Summon));
                person.changeJob(job);
                if (this.isPlayer) {
                    game.god.event(job.name, 1, person.position);
                    sounds[job.name + 'Train'].play();
                }
                return strs.msgs.trained(job);
            }
            return strs.msgs.villagerNotFound;
        }
    }, {
        key: 'untrain',
        value: function untrain(game, job) {
            var person = this.findOfJob(game, job);
            if (!person) return strs.msgs.jobNotFound(job);

            game.addChild(new SFX(person.x, person.y, Summon));
            person.changeJob(Villager);
            if (this.isPlayer) {
                game.god.event(job.name, -1, person.position);
                sounds.untrain.play();
            }
            return strs.msgs.untrained(job);
        }
    }, {
        key: 'doBaby',
        value: function doBaby(game) {
            var _this5 = this;

            var skipChecks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!skipChecks && this.housed) return strs.msgs.housed;
            if (game.islands.find(function (island) {
                return island.people.find(function (person) {
                    return person.kingdom === _this5 && person.job === Villager && Villager.doBaby.call(person, game);
                });
            }) && this.isPlayer) {
                sounds.baby.play();
                return strs.msgs.babyMade;
            }
            return strs.msgs.babyAttempted;
        }
    }, {
        key: 'attemptSummon',
        value: function attemptSummon(game) {
            var _this6 = this;

            var skipChecks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!skipChecks && this.templed) return strs.msgs.templed;
            if (game.islands.find(function (island) {
                return island.people.find(function (person) {
                    return person.kingdom === _this6 && person.job === Priest && Priest.doSummon.call(person, game);
                });
            }) && this.isPlayer) {
                sounds.summon.play();
                return strs.msgs.summonDone;
            }
            return strs.msgs.summonAttempted;
        }
    }, {
        key: 'pray',
        value: function pray(game) {
            var _this7 = this;

            var c = 0,
                p = void 0;
            game.islands.forEach(function (island) {
                return island.people.forEach(function (person) {
                    if (person.kingdom !== _this7) return;
                    if (person.pray()) {
                        c++;
                        if (!p) p = person;
                    }
                });
            });
            if (this.isPlayer && p) {
                var prop = c / (this.peopleCount + this.summonCount);
                sounds.pray.play(null, prop);
                game.god.event('pray', prop * (1 + this.statueCount), p.position);
            }
            return strs.msgs.praying;
        }
    }, {
        key: 'sendAttack',
        value: function sendAttack(game) {
            var _this8 = this;

            var mean = game.islands.filter(function (isl) {
                return isl.kingdom !== _this8;
            }).rand();
            if (!mean) return strs.msgs.noEnemy;
            game.islands.forEach(function (island) {
                return island.kingdom === _this8 && island.people.forEach(function (person) {
                    return person.kingdom === _this8 && (person.job === Warrior || person.job === Minotaur) && person.moveTo(game.islands, mean.index);
                });
            });
            return strs.msgs.attacking;
        }
    }, {
        key: 'sendConvert',
        value: function sendConvert(game) {
            var _this9 = this;

            var mean = game.islands.filter(function (isl) {
                return isl.kingdom !== _this9;
            }).rand();
            if (!mean) return strs.msgs.noEnemy;
            game.islands.forEach(function (island) {
                return island.kingdom === _this9 && island.people.forEach(function (person) {
                    return person.kingdom === _this9 && person.job === Priest && person.moveTo(game.islands, mean.index);
                });
            });
            return strs.msgs.converting;
        }
    }, {
        key: 'sendRetreat',
        value: function sendRetreat(game) {
            var _this10 = this;

            var ally = game.islands.filter(function (isl) {
                return isl.kingdom === _this10;
            }).rand();
            if (!ally) return strs.msgs.noRetreat;
            game.islands.forEach(function (island) {
                return island.kingdom !== _this10 && island.people.forEach(function (person) {
                    return person.kingdom === _this10 && person.moveTo(game.islands, ally.index);
                });
            });
            return strs.msgs.retreating;
        }
    }, {
        key: 'maxPop',
        get: function get() {
            return this.islandCount * 5 + this.houseCount * 5 + this.treeCount / 4 + this.bigTreeCount * 5 | 0;
        }
    }, {
        key: 'housed',
        get: function get() {
            return this.peopleCount >= this.maxPop;
        }
    }, {
        key: 'maxSummon',
        get: function get() {
            return this.templeCount * 5 + 5;
        }
    }, {
        key: 'templed',
        get: function get() {
            return this.summonCount >= this.maxSummon;
        }
    }, {
        key: 'maxUnfinished',
        get: function get() {
            return Math.floor(this.islandCount / 2 + 1);
        }
    }, {
        key: 'builded',
        get: function get() {
            return this.unfinished >= this.maxUnfinished;
        }
    }, {
        key: 'maxGrow',
        get: function get() {
            return this.greenHouseCount * 2 + this.bigTreeCount * 2 + 2;
        }
    }, {
        key: 'growed',
        get: function get() {
            return this.growing >= this.maxGrow;
        }
    }]);

    return Kingdom;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Island = function (_PIXI$Container) {
    _inherits(Island, _PIXI$Container);

    function Island(x, y, kingdom) {
        _classCallCheck(this, Island);

        var _this = _possibleConstructorReturn(this, (Island.__proto__ || Object.getPrototypeOf(Island)).call(this));

        _this.x = x;
        _this.y = y;
        _this.ground = new PIXI.TiledSprite(Island.ground);
        _this.cloudBack = new PIXI.OscillatingSprite(Island.cloudBack, cloudBackCycle, 0, 0, 0, 8);
        _this.cloudFront = new PIXI.OscillatingSprite(Island.cloudFront, cloudFrontCycle, 0, 0, 0, 8);
        _this.ground.anchor.x = _this.cloudBack.anchor.x = _this.cloudFront.anchor.x = 0.525;
        _this.ground.anchor.y = _this.cloudBack.anchor.y = _this.cloudFront.anchor.y = 0.275;
        _this.addChild(_this.cloudBack, _this.ground, _this.cloudFront);
        _this.buildings = [];
        _this.people = [];
        _this.kingdom = kingdom;

        _this.zoneWidth = 300;
        _this.zoneHeight = 120;
        return _this;
    }

    _createClass(Island, [{
        key: 'generateBuilding',
        value: function generateBuilding(type) {
            var finished = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var _this2 = this;

            var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : type.radius;
            var attempts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10 * radius;

            var _loop = function _loop(i) {
                var pos = _this2.getRandomPoint(radius);
                if (_this2.buildings.find(function (b) {
                    return b.type !== Bridge && b.isInRadius(pos, radius);
                })) return 'continue';
                var b = new Building(pos.x, pos.y, type, _this2.kingdom, _this2, finished);
                _this2.buildings.add(b);
                return {
                    v: b
                };
            };

            for (var i = 0; i < attempts; i++) {
                var _ret = _loop(i);

                switch (_ret) {
                    case 'continue':
                        continue;

                    default:
                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }
            }
        }
    }, {
        key: 'generateBuildings',
        value: function generateBuildings(count) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < count; i++) {
                this.generateBuilding.apply(this, args);
            }
        }
    }, {
        key: 'generateBridge',
        value: function generateBridge() {
            var finished = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (this.bridge) throw 'bridge already exists';
            var bridge = new Building(this.x + this.getLocalBounds().right, this.y, Bridge, this.kingdom, this, finished);
            this.buildings.add(bridge);
            this.bridge = bridge;
            return bridge;
        }
    }, {
        key: 'generateForest',
        value: function generateForest() {
            this.generateBuildings(Math.random() * 20 + 10, Tree);
        }
    }, {
        key: 'generatePlain',
        value: function generatePlain() {
            this.generateBuildings(Math.random() * 10, Tree);
        }
    }, {
        key: 'generateOutpost',
        value: function generateOutpost() {
            var houses = Math.random() * 3;
            this.generatePlain();
            this.generateBuildings(houses, House);
            this.generateBuilding(Barracks);
            this.people.add(new Person(this.x, this.y, Builder, this.kingdom, this), new Person(this.x, this.y, Priest, this.kingdom, this), new Person(this.x, this.y, Villager, this.kingdom, this), new Person(this.x, this.y, Villager, this.kingdom, this));
            var extra = 5 + houses * 4;
            for (var i = 4; i < extra; i++) {
                this.people.add(new Person(this.x, this.y, Warrior, this.kingdom, this));
            }
        }
    }, {
        key: 'generateCity',
        value: function generateCity() {
            var houses = 10 + Math.random() * 10;
            var special = Math.random() * 3;
            var trees = Math.random() * 10;
            var types = [Barracks, Temple, Workshop];
            for (var i = 0; i < special; i++) {
                this.generateBuilding(types.rand());
            }this.generateBuildings(houses, House);
            this.generateBuildings(trees, Tree);
            for (var _i = 0; _i < 5 + houses * 4; _i++) {
                this.people.add(new Person(this.x, this.y, Person.jobs.rand(), this.kingdom, this));
            }
        }
    }, {
        key: 'generateTemple',
        value: function generateTemple() {
            var temples = Math.random() * 3;
            var trees = Math.random() * 20;
            this.generateBuildings(temples, Temple);
            this.generateBuildings(trees, Tree);
            for (var i = 0; i < temples * 5; i++) {
                this.people.add(new Person(this.x, this.y, Priest, this.kingdom, this));
            }
        }
    }, {
        key: 'getRandomPoint',
        value: function getRandomPoint() {
            var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            // we have (x/hw)^2 + (y/hh)^2 < 1 where hw half-width and hh half-height
            // we take x in [-hw, hw]
            // then (y/hh)^2 < 1 - (x/hw)^2
            // and y < hh * Math.sqrt(1 - (x/hw)^2)
            var hwidth = (this.zoneWidth - radius) / 2,
                hheight = (this.zoneHeight - radius) / 2;
            var x = Math.random() * hwidth * 2 - hwidth;
            var yrange = hheight * Math.sqrt(1 - Math.pow(x / hwidth, 2));
            var y = Math.random() * yrange * 2 - yrange;
            return { x: this.x + x, y: this.y + y, island: this };
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            var _this3 = this;

            var alliedPresence = null,
                enemyPresence = null;
            this.people = this.people.filter(function (p) {
                if (p.kingdom === _this3.kingdom) alliedPresence = p.kingdom;else enemyPresence = p.kingdom;
                return !p.shouldRemove;
            });
            if (!alliedPresence && enemyPresence) this.changeKingdom(enemyPresence);

            var eco = 0;
            this.buildings = this.buildings.filter(function (b) {
                return eco += b.finished ? b.eco : 0, !b.shouldRemove && !b.exploded;
            });
            this.ground.tileX = Math.bounded(eco, 0, 3) | 0;

            this.cloudBack.update(delta);
            this.cloudFront.update(delta);
        }
    }, {
        key: 'render',
        value: function render(delta, game, renderer) {
            this.cloudBack.tint = game.cloudColor;
            this.cloudFront.tint = game.cloudColor;
            this.ground.tint = game.globalColor;
        }
    }, {
        key: 'changeKingdom',
        value: function changeKingdom(newKingdom) {
            this.kingdom.removeFromIslandCount(this);
            this.kingdom = newKingdom;
            this.kingdom.addToIslandCount(this);
            this.buildings.forEach(function (b) {
                return b.changeKingdom(newKingdom);
            });

            if (this.kingdom.isPlayer) sounds.islandWin.play();else sounds.islandLose.play();
        }
    }, {
        key: 'onAdd',
        value: function onAdd() {
            this.kingdom.addToIslandCount(this);
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            this.kingdom.removeFromIslandCount(this);
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return {
                people: this.people.map(function (person) {
                    return person.outputState();
                }),
                buildings: this.buildings.map(function (building) {
                    return building.outputState();
                }),
                kingdom: this.kingdom.name
            };
        }
    }, {
        key: 'resolveIndices',
        value: function resolveIndices(game) {
            this.people.forEach(function (person) {
                return person.resolveIndices(game);
            });
            this.buildings.forEach(function (building) {
                return building.resolveIndices(game);
            });
        }
    }, {
        key: 'z',
        get: function get() {
            return -100;
        }
    }]);

    return Island;
}(PIXI.Container);

Island.fromState = function (state, game) {
    var isl = new Island(game.islandsWidth, 0, game[state.kingdom]);
    isl.people = state.people.map(function (s) {
        return Person.fromState(s, isl, game);
    });
    isl.buildings = state.buildings.map(function (s) {
        return Building.fromState(s, isl, game);
    });
    return isl;
};
PIXI.loader.add('island', 'images/Island.png', null, function (res) {
    return Island.ground = new PIXI.TiledTexture(res.texture, 480, 240);
}).add('cloudBack', 'images/CloudBack.png', null, function (res) {
    return Island.cloudBack = res.texture;
}).add('cloudFront', 'images/CloudFront.png', null, function (res) {
    return Island.cloudFront = res.texture;
}).add('cloudStartBack', 'images/CloudStartBack.png', null, function (res) {
    return Island.cloudStartBack = res.texture;
}).add('cloudStartFront', 'images/CloudStartFront.png', null, function (res) {
    return Island.cloudStartFront = res.texture;
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Building = function (_PIXI$TiledSprite) {
    _inherits(Building, _PIXI$TiledSprite);

    function Building(x, y, type, kingdom, island) {
        var finished = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Building);

        var _this = _possibleConstructorReturn(this, (Building.__proto__ || Object.getPrototypeOf(Building)).call(this, type.texture));

        _this.x = x;
        _this.y = y;
        _this._z = 0;
        if (Math.random() < 0.5) _this.scale.x = -1;
        _this.decal.x = _this.texture.width / 2 + type.decal.x;
        _this.decal.y = _this.texture.height / 2 + type.decal.y;
        _this.type = type;
        _this.buildTime = finished ? 0 : type.buildTime;
        _this.kingdom = kingdom;
        _this.island = island;
        _this.finished = finished;
        _this.exploded = 0;
        if (_this.type.building) _this.type.building.apply(_this, arguments);
        _this.updateTextureState();
        return _this;
    }

    _createClass(Building, [{
        key: 'isInRadius',
        value: function isInRadius(o, radius) {
            radius = radius || o.radius;
            return radius ? Math.dst(this.x, this.y, o.x, o.y) < this.radius + radius : Math.dst2(this.x, this.y, o.x, o.y) < this.radius2;
        }
    }, {
        key: 'changeKingdom',
        value: function changeKingdom(newKingdom) {
            this.kingdom.removeFromBuildingCount(this);
            this.kingdom = newKingdom;
            this.kingdom.addToBuildingCount(this);
            this.updateTextureState();
        }
    }, {
        key: 'onAdd',
        value: function onAdd() {
            this.kingdom.addToBuildingCount(this);
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            this.kingdom.removeFromBuildingCount(this);
        }
    }, {
        key: 'updateTextureState',
        value: function updateTextureState() {
            this.tileX = !this.type.playerColored || this.kingdom.isPlayer ? 0 : 1;
            this.tileY = this.finished ? 1 : 0;
        }
    }, {
        key: 'progressBuild',
        value: function progressBuild(amount, game) {
            this.buildTime -= amount;
            if (this.buildTime <= 0) {
                this.kingdom.removeFromBuildingCount(this);
                this.finished = true;
                this.kingdom.addToBuildingCount(this);

                this.updateTextureState();
                if (this.kingdom.isPlayer) {
                    game.god.event(this.type.name, 0.5, this.position);
                    this.notifyCompletion();
                    sounds.done.play();
                }
                if (this.type.onFinished) this.type.onFinished.call(this);
            }
        }
    }, {
        key: 'notifyCompletion',
        value: function notifyCompletion() {
            if (this.type.notifyCompletion) this.type.notifyCompletion.call(this);else ui.notify(this.type.name + ' built');
        }
    }, {
        key: 'explode',
        value: function explode(game) {
            if (this.exploded) return;

            this.exploded = 1;
            this.filters = [this.ditherFilter = new PIXI.filters.DitherFilter()];

            if (this.kingdom.isPlayer) game.god.event(this.type.name, -0.5, this.position);

            if (this.type.explode && this.type.explode.start) this.type.explode.start.call(this, game);
        }
    }, {
        key: 'updateCheckExplosion',
        value: function updateCheckExplosion(delta, game) {
            var duration = this.type.explode && this.type.explode.duration || 40;
            if (this.exploded > duration) this.shouldRemove = true;

            var freq = this.type.explode && this.type.explode.freq || 6;
            if (!((this.exploded - 1) % freq)) {
                var bounds = this.type.explode && this.type.explode.bounds || this.getLocalBounds();

                var explosion = new SFX(this.x + Math.randRange(bounds.left, bounds.right), this.y + Math.randRange(bounds.top, bounds.bottom), Explosion);

                var minScale = this.type.explode && this.type.explode.scale && this.type.explode.scale.min || 0.25;

                var maxScale = this.type.explode && this.type.explode.scale && this.type.explode.scale.max || 0.75;

                var scale = Math.randRange(minScale, maxScale);

                explosion.scale.x = explosion.scale.y = scale;
                explosion.rotation = Math.randRange(0, Math.TWO_PI);
                game.addChild(explosion);
            }

            this.exploded++;
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            if (this.type.update) this.type.update.apply(this, arguments);
            if (this.exploded) this.updateCheckExplosion(delta, game);
        }
    }, {
        key: 'render',
        value: function render(delta, game, renderer) {
            var duration = this.type.explode && this.type.explode.duration || 60;
            if (this.exploded) this.ditherFilter.render(1 - this.exploded / duration);

            this.tint = game.globalColor;

            if (this.type.render) this.type.render.apply(this, arguments);
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return {
                x: this.x,
                y: this.y,
                type: this.type.name,
                kingdom: this.kingdom.name,
                buildTime: this.buildTime,
                finished: this.finished
            };
        }
    }, {
        key: 'resolveIndices',
        value: function resolveIndices(game) {}
    }, {
        key: 'radius',
        get: function get() {
            return this.type.radius;
        }
    }, {
        key: 'radius2',
        get: function get() {
            return this.type.radius2;
        }
    }, {
        key: 'eco',
        get: function get() {
            return this.type.eco;
        }
    }, {
        key: 'z',
        get: function get() {
            return this._z + this.y + this.type.decal.z;
        },
        set: function set(val) {
            this._z = val - this.y - this.type.decal.z;
        }
    }]);

    return Building;
}(PIXI.TiledSprite);

Building.fromState = function (s, island, game) {
    var type = Building.types.find(function (t) {
        return t.name === s.type;
    });
    var kingdom = game[s.kingdom];
    var b = new Building(s.x, s.y, type, kingdom, island, s.finished);
    b.finished = s.finished;
    return b;
};
Building.types = [];

var BuildingType = function () {
    function BuildingType(opts) {
        var _this2 = this;

        _classCallCheck(this, BuildingType);

        Building.types.add(this);

        opts.radius2 = opts.radius * opts.radius;
        Object.merge(this, opts || {});

        PIXI.loader.add(opts.name, opts.path, null, function (res) {
            return _this2.init(res.texture);
        });
    }

    _createClass(BuildingType, [{
        key: 'init',
        value: function init(texture) {
            this.texture = new PIXI.TiledTexture(texture, this.playerColored ? texture.width / 2 : texture.width, texture.height / 2);
        }
    }]);

    return BuildingType;
}();

var Bridge = new BuildingType({
    name: 'bridge',
    path: 'images/Bridge.png',
    decal: { x: -10, y: -52, z: -30 },
    playerColored: false,
    radius: 200,
    eco: 0,
    buildTime: 10000,

    explode: {
        start: function start(game) {
            var _this3 = this;

            var filter = function filter(p) {
                return _this3.isInRadius(p, -Bridge.radius / 2);
            };
            this.island.people.filter(filter).concat(this.island.index + 1 < game.islands.length ? game.islands[this.island.index + 1].people.filter(filter) : []).forEach(function (p) {
                return p.die(game);
            });
            this.island.bridge = null;
        },

        freq: 2,

        bounds: {
            left: -70,
            right: 70,
            top: -30,
            bottom: 30
        }
    },

    building: function building() {
        this.island.bridge = this;
        this.scale.x = 1;
    }
}),
    House = new BuildingType({
    name: 'house',
    path: 'images/House.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 20,
    eco: 1 / 3,
    buildTime: 2000,

    explode: {
        scale: {
            max: 0.5
        },
        freq: 8,
        bounds: {
            left: -20,
            right: 20,
            top: -30,
            bottom: 20
        }
    }
}),
    Barracks = new BuildingType({
    name: 'barracks',
    path: 'images/Barracks.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: 1 / 2,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
    Workshop = new BuildingType({
    name: 'workshop',
    path: 'images/Workshop.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: 1,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
    Temple = new BuildingType({
    name: 'temple',
    path: 'images/Temple.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: 1 / 2,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
    GreenHouse = new BuildingType({
    name: 'greenHouse',
    path: 'images/GreenHouse.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: -1 / 6,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -20,
            right: 20,
            top: -30,
            bottom: 20
        }
    }
}),
    Tree = new BuildingType({
    name: 'tree',
    path: 'images/Tree.png',
    decal: { x: 0, y: 5, z: 0 },
    playerColored: false,
    radius: 10,
    eco: -1 / 6,
    buildTime: 1000,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    },

    building: function building() {
        this.rotation = (Math.random() - 0.5) * Math.PI / 16;
        this.grow = 1;
    },
    update: function update(delta, game) {
        if (!this.finished) this.progressBuild(1, game);
        if (this.grow < 1) this.grow = Math.min(this.grow + 0.1, 1);
    },
    render: function render() {
        if (this.scale.x < 1 || this.grow < 1) this.scale.x = this.scale.y = this.grow;
    },
    notifyCompletion: function notifyCompletion() {
        ui.notify('tree grown');
    }
}),
    FallingTree = new BuildingType({
    name: 'fallingTree',
    path: 'images/FallingTree.png',
    decal: { x: 0, y: 5, z: 0 },
    playerColored: false,
    radius: 10,
    eco: 0,
    buildTime: 120,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    },

    onFinished: function onFinished() {
        this.shouldRemove = true;
    },
    notifyCompletion: function notifyCompletion() {
        ui.notify('stump removed');
    }
}),
    BigTree = new BuildingType({
    name: 'bigTree',
    path: 'images/BigTree.png',
    decal: { x: 0, y: 45, z: 0 },
    playerColored: false,
    radius: 10,
    eco: -1,
    buildTime: 0,

    explode: {
        bounds: {
            left: -20,
            right: 20,
            top: -90,
            bottom: 10
        }
    },

    building: function building() {
        this.grow = 1;
    },
    update: function update(delta, game) {
        if (!this.finished) this.progressBuild(1, game);
        if (this.grow < 1) this.grow = Math.min(this.grow + 0.1, 1);
        if (Math.random() < 0.05) game.addChild(new SFX(Math.randRange(this.x - 32, this.x + 32), Math.randRange(this.y - 20, this.y - 92), Sparkle, 80));
    },
    render: function render() {
        if (this.scale.x < 1 || this.grow < 1) this.scale.x = this.scale.y = this.grow;
        if (!this.finished) this.tint = 0xffffff;
    }
}),
    Statue = new BuildingType({
    name: 'statue',
    path: 'images/Statue.png',
    decal: { x: 0, y: 18, z: 3 },
    playerColored: false,
    radius: 8,
    eco: 1 / 4,
    buildTime: 1000,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    }
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Person = function (_PIXI$AnimatedSprite) {
    _inherits(Person, _PIXI$AnimatedSprite);

    function Person(x, y, job, kingdom, island) {
        var isSummon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Person);

        var _this = _possibleConstructorReturn(this, (Person.__proto__ || Object.getPrototypeOf(Person)).call(this, job.texture, 10, true));

        _this.decal = { x: 4, y: 10 };
        _this.x = x;
        _this.y = y;
        _this.job = job;

        _this.health = 100;
        _this.sinceTookDamage = 0;
        _this.praying = 0;
        _this.speed = 0.25;
        _this.target = null;
        _this.movements = [];

        _this.island = island;
        _this.kingdom = kingdom;
        _this.isSummon = isSummon;
        return _this;
    }

    _createClass(Person, [{
        key: 'takeDamage',
        value: function takeDamage(amount, game) {
            this.health -= amount;
            this.sinceTookDamage = 10;
            if (this.health <= 0) this.die(game);
        }
    }, {
        key: 'die',
        value: function die(game) {
            this.shouldRemove = true;
            game.addChild(new SFX(this.x, this.y, Blood));
            sounds.death.play();
        }
    }, {
        key: 'changeKingdom',
        value: function changeKingdom(newKingdom) {
            this.kingdom.removeFromPersonCount(this);
            this.kingdom = newKingdom;
            this.kingdom.addToPersonCount(this);
        }
    }, {
        key: 'onAdd',
        value: function onAdd() {
            this.kingdom.addToPersonCount(this);
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            this.kingdom.removeFromPersonCount(this);
        }
    }, {
        key: 'changeJob',
        value: function changeJob(newJob) {
            this.kingdom.removeFromPersonCount(this);
            this.job = newJob;
            this.kingdom.addToPersonCount(this);
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            if (this.health < 100) this.health += 0.025;
            if (this.sinceTookDamage > 0) this.sinceTookDamage--;
            if (this.praying > 0) {
                this.praying--;
                this.tileX = 0;
                return;
            }

            if (this.job.update.apply(this, arguments)) return;

            // Movement
            var dstToTarget = 0;
            if (!this.target || this.x === this.target.x && this.y === this.target.y) {
                // Switch island
                if (this.target && this.island !== this.target.island) {
                    this.island.people.remove(this);
                    this.island = this.target.island;
                    this.island.people.add(this);
                }

                // Ensure that the next target (if there is one) is accessible
                var newIsland = this.movements.length && this.movements[0].island;
                if (newIsland && newIsland !== this.island) {
                    // Ensure that there is a bridge
                    var bridge = (this.island.index < newIsland.index ? this.island : newIsland).bridge;
                    if (!bridge || !bridge.finished) this.movements = [];
                }

                // Ensure that there is a next target
                if (!this.movements.length) this.findNextTarget(game);

                // Setup movement
                this.speed = (Math.random() + 1) / 4;
                this.target = this.movements.shift();
                dstToTarget = Math.dst(this.x, this.y, this.target.x, this.target.y);
                var ratio = this.speed / dstToTarget;
                this.movX = (this.target.x - this.x) * ratio, this.movY = (this.target.y - this.y) * ratio;
            } else dstToTarget = Math.dst(this.x, this.y, this.target.x, this.target.y);

            if (dstToTarget < this.speed) {
                this.x = this.target.x;
                this.y = this.target.y;
            } else {
                this.x += this.movX;
                this.y += this.movY;
            }

            _get(Person.prototype.__proto__ || Object.getPrototypeOf(Person.prototype), 'update', this).call(this, delta);
        }
    }, {
        key: 'render',
        value: function render(delta, game, renderer) {
            this.tileY = Math.abs(this.movX) > Math.abs(this.movY) ? this.movX > 0 ? this.tileY = 1 : this.tileY = 2 : this.movY > 0 ? this.tileY = 3 : this.tileY = 4;
            this.tint = this.sinceTookDamage > 4 ? 0xffffff : this.kingdom.tint;
        }
    }, {
        key: 'findNextTarget',
        value: function findNextTarget(game) {
            if (this.job.findNextTarget.call(this, game)) return;
            this.movements.push(this.island.getRandomPoint());
            if (Math.random() < 0.25) this.moveTo(game.islands, Math.random() * game.islands.length | 0);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(islands, index) {
            var start = (this.movements.last || this).island;
            var dir = Math.sign(index - start.index);
            for (var i = start.index; i !== index; i += dir) {
                var prev = islands[i],
                    next = islands[i + dir];
                var bridge = (dir > 0 ? prev : next).bridge;
                if (!bridge || !bridge.finished) return;
                this.movements.push({
                    x: bridge.x - dir * 90,
                    y: bridge.y + Math.randRange(-15, 5),
                    island: prev
                }, {
                    x: bridge.x,
                    y: bridge.y + Math.randRange(-15, 5),
                    island: next
                }, {
                    x: bridge.x + dir * 90,
                    y: bridge.y + Math.randRange(-15, 5),
                    island: next
                });
            }
        }
    }, {
        key: 'targetForIsland',
        value: function targetForIsland(dst2, filter, island) {
            for (var i = island.people.length; i--;) {
                var p = island.people[i];
                if (p.kingdom !== this.kingdom && (!filter || filter(p)) && Math.dst2(this.x, this.y, p.x, p.y) < dst2) return p;
            }
            return null;
        }
    }, {
        key: 'findTarget',
        value: function findTarget(game, dst2, filter) {
            var target = this.targetForIsland(dst2, filter, this.island);
            if (target) return target;

            var toIsland = this.x - this.island.x;
            if (toIsland > 150 && this.island.index + 1 < game.islands.length) return this.targetForIsland(dst2, filter, game.islands[this.island.index + 1]);else if (toIsland < -150 && this.island.index - 1 >= 0) return this.targetForIsland(dst2, filter, game.islands[this.island.index - 1]);
        }
    }, {
        key: 'pray',
        value: function pray() {
            return this.praying <= 0 && (this.praying = Math.random() * 50 + 75);
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return Object.merge({
                x: this.x,
                y: this.y,
                job: this.job.name,
                health: this.health,
                isSummon: this.isSummon,
                sinceTookDamage: this.sinceTookDamage,
                praying: this.praying,
                speed: this.speed,
                movX: this.movX,
                movY: this.movY,
                target: this.target && {
                    x: this.target.x,
                    y: this.target.y,
                    island: this.target.island.index
                },
                movements: this.movements.map(function (m) {
                    return {
                        x: m.x,
                        y: m.y,
                        island: m.island.index
                    };
                }),
                kingdom: this.kingdom.name
            }, this.job.outputState && this.job.outputState.apply(this, arguments));
        }
    }, {
        key: 'resolveIndices',
        value: function resolveIndices(game) {
            if (this.target) this.target.island = game.islands[this.target.island];
            this.movements.forEach(function (m) {
                return m.island = game.islands[m.island];
            });
            this.job.resolveIndices && this.job.resolveIndices.apply(this, arguments);
        }
    }, {
        key: 'z',
        get: function get() {
            return this.y;
        }
    }, {
        key: 'targetReached',
        get: function get() {
            return Math.dst(this.x, this.y, this.target.x, this.target.y) < this.speed;
        }
    }, {
        key: 'job',
        get: function get() {
            return this._job;
        },
        set: function set(job) {
            this._job = job;
            this.setTiledTexture(job.texture);
            if (job.person) job.person.apply(this, arguments);
        }
    }]);

    return Person;
}(PIXI.AnimatedSprite);

Person.fromState = function (s, island, game) {
    var job = Person.jobs[s.job],
        kingdom = game[s.kingdom];
    var p = new Person(s.x, s.y, job, kingdom, island, s.isSummon);
    p.health = s.health;
    p.sinceTookDamage = s.sinceTookDamage;
    p.praying = s.praying;
    p.speed = s.speed;
    p.movX = s.movX;
    p.movY = s.movY;
    p.target = s.target && {
        x: s.target.x, y: s.target.y,
        island: s.target.island
    };
    p.movements = s.movements.map(function (m) {
        return { x: m.x, y: m.y, island: m.island };
    });
    p.job.readState && p.job.readState.apply(p, arguments);
    return p;
};
Person.jobs = [];

var Job = function () {
    function Job(name, path, ext) {
        var _this2 = this;

        _classCallCheck(this, Job);

        this.name = name;
        Person.jobs.add(this);
        Person.jobs[name] = this;
        PIXI.loader.add(name, path, null, function (res) {
            return _this2.init(res.texture);
        });
        Object.merge(this, ext);
    }

    _createClass(Job, [{
        key: 'init',
        value: function init(texture) {
            this.texture = new PIXI.TiledTexture(texture, 8, 12);
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'findNextTarget',
        value: function findNextTarget() {}
    }, {
        key: 'outputState',
        value: function outputState() {}
    }, {
        key: 'resolveIndices',
        value: function resolveIndices() {}
    }]);

    return Job;
}();

var Villager = new Job('villager', 'images/Villager.png', {
    person: function person() {
        this.sinceBaby = 0;
    },
    update: function update(delta, game) {
        var _this3 = this;

        this.sinceBaby++;
        if (this.island.kingdom !== this.kingdom) return;
        this.island.buildings.filter(function (b) {
            return b.type === FallingTree && !b.finished && b.isInRadius(_this3, 10);
        }).forEach(function (b) {
            return b.progressBuild(1, game);
        });
    },
    doBaby: function doBaby(game) {
        if (this.kingdom.housed) return;
        if (Math.random() * 3000 < this.sinceBaby) {
            this.sinceBaby = 0;
            var baby = new Person(this.x, this.y, Villager, this.kingdom, this.island);
            game.addChild(baby, new SFX(this.x, this.y, Sparkle));
            this.island.people.add(baby);
            if (this.kingdom.isPlayer) game.god.event('baby', 1, this.position);
            return baby;
        }
    },
    outputState: function outputState() {
        return { sinceBaby: this.sinceBaby };
    },
    readState: function readState(state, game) {
        this.sinceBaby = state.sinceBaby;
    }
}),
    Builder = new Job('builder', 'images/Builder.png', {
    update: function update(delta, game) {
        var _this4 = this;

        if (this.building && this.building.finished) this.building = null;
        if (this.island.kingdom !== this.kingdom) return;
        this.island.buildings.filter(function (b) {
            return b.type !== FallingTree && b.type !== Tree && !b.finished && b.isInRadius(_this4, 10);
        }).forEach(function (b) {
            return b.progressBuild(3 + _this4.kingdom.workshopCount, game);
        });
    },
    findNextTarget: function findNextTarget(game) {
        if (this.building && !this.building.finished) {
            this.moveTo(game.islands, this.building.island.index);
            var x = (Math.random() * 2 - 1) * this.building.radius * 0.75;
            var y = (Math.random() * 2 - 1) * this.building.radius * 0.75;
            if (this.building.type === Bridge) {
                x /= 4;y /= 4;
                x -= 100;
            }
            // TODO; clamp movement inside island
            this.movements.push({
                x: this.building.x + x,
                y: this.building.y + y,
                island: this.building.island
            });
            return true;
        }
    },
    outputState: function outputState() {
        return this.building && {
            building: {
                index: this.building.island.buildings.indexOf(this.building),
                island: this.building.island.index
            }
        };
    },
    readState: function readState(state, game) {
        this.building = state.building;
    },
    resolveIndices: function resolveIndices(game) {
        if (this.building) this.building = game.islands[this.building.island].buildings[this.building.index];
    }
}),
    Warrior = new Job('warrior', 'images/Warrior.png', {
    update: function update(delta, game) {
        var target = this.findTarget(game, 32 * 32, function (p) {
            return p.sinceTookDamage <= 0;
        });
        if (!target) return;
        target.takeDamage(3 + this.kingdom.barracksCount, game);
        sounds.hit.play();
        if (this.kingdom.isPlayer) {
            game.god.event('fight', 1, this.position);
            if (target.health <= 0) game.god.event('kill', 1, target.position);
        }
    }
}),
    Priest = new Job('priest', 'images/Priest.png', {
    person: function person() {
        this.sinceSummon = 0;
    },
    update: function update(delta, game) {
        this.sinceSummon++;
        var target = this.findTarget(game, 48 * 48);
        if (!target) return;
        if (this.kingdom.isPlayer) game.god.event('converting', 1, this.position);
        if (Math.random() * 1500 < 3 + this.kingdom.templeCount) {
            target.changeKingdom(this.kingdom);
            game.addChild(new SFX(target.x, target.y, Summon));
            sounds.convert.play();
            if (this.kingdom.isPlayer) game.god.event('convert', 1, this.position);
        }
    },
    doSummon: function doSummon(game) {
        if (this.kingdom.templed) return;
        if (Math.random() * 5000 < this.sinceSummon) {
            this.sinceSummon = 0;
            var summon = new Person(this.x, this.y, Villager, this.kingdom, this.island, true);
            game.addChild(summon, new SFX(this.x, this.y, Summon));
            this.island.people.add(summon);
            if (this.kingdom.isPlayer) game.god.event('summon', 1, this.position);
            return summon;
        }
    },
    outputState: function outputState() {
        return { sinceSummon: this.sinceSummon };
    }
}),
    Minotaur = new Job('minotaur', 'images/Minotaur.png', {
    person: function person() {
        this.decal.x = 6;
        this.decal.y = 14;
    },
    init: function init(texture) {
        this.texture = new PIXI.TiledTexture(texture, 12, 16);
    },
    update: function update(delta, game) {
        if (this.health < 200) this.health += 0.025;

        var target = this.findTarget(game, 32 * 32, function (p) {
            return p.sinceTookDamage <= 0;
        });
        if (!target) return;
        target.takeDamage(6 + this.kingdom.barracksCount * 2, game);
        sounds.hit.play();
        if (this.kingdom.isPlayer) {
            game.god.event('fight', 2, this.position);
            if (target.health <= 0) game.god.event('kill', 1, target.position);
        }
    }
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bird = function (_PIXI$AnimatedSprite) {
    _inherits(Bird, _PIXI$AnimatedSprite);

    function Bird(x, y, tint) {
        _classCallCheck(this, Bird);

        var _this = _possibleConstructorReturn(this, (Bird.__proto__ || Object.getPrototypeOf(Bird)).call(this, Bird.texture, 4, true));

        _this.x = _this.targetX = x;
        _this.y = _this.targetY = y;
        _this.tint = tint;
        _this.movX = _this.movY = 0;
        _this.anchor.x = _this.anchor.y = 0.5;
        _this.z = 300;
        return _this;
    }

    _createClass(Bird, [{
        key: 'update',
        value: function update(delta, game) {
            _get(Bird.prototype.__proto__ || Object.getPrototypeOf(Bird.prototype), 'update', this).call(this, delta);

            if (Math.dst2(this.x, this.y, this.targetX, this.targetY) < 64) {
                var bounds = game.getLocalBounds();
                this.targetX = 1.25 * Math.randRange(bounds.left, bounds.right);
                this.targetY = 1.25 * Math.randRange(bounds.top, bounds.bottom);
            }
            this.movX += Math.sign(this.targetX - this.x) * 0.01;
            this.movY += Math.sign(this.targetY - this.y) < 0 ? -0.005 : 0.02;
            this.x += this.movX *= 0.99;
            this.y += this.movY *= 0.99;
            this.scale.x = this.movX < 0 ? -1 : 1;
        }
    }, {
        key: 'die',
        value: function die(game) {
            this.shouldRemove = true;
            game.addChild(new SFX(this.x, this.y, Blood, this.z));
        }
    }]);

    return Bird;
}(PIXI.AnimatedSprite);

PIXI.loader.add('bird', 'images/Bird.png', null, function (res) {
    return Bird.texture = new PIXI.TiledTexture(res.texture, 8, 8);
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Overlay = function (_PIXI$Sprite) {
    _inherits(Overlay, _PIXI$Sprite);

    function Overlay() {
        var texture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PIXI.whitePixel;

        _classCallCheck(this, Overlay);

        var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, texture));

        _this.nonCullable = true;
        _this.flashes = [];
        return _this;
    }

    _createClass(Overlay, [{
        key: "render",
        value: function render(delta, game, renderer) {
            this.x = -game.x;
            this.y = -game.y;
            this.width = renderer.width;
            this.height = renderer.height;

            var alpha = 0;
            for (var i = this.flashes.length; i--;) {
                var flash = this.flashes[i];
                alpha = Math.max(flash.time / flash.duration, alpha);
                flash.time--;
                if (!flash.time) this.flashes.splice(i, 1);
            }
            this.alpha = alpha;
        }
    }, {
        key: "flash",
        value: function flash(duration) {
            this.flashes.push({ time: duration, duration: duration });
        }
    }, {
        key: "outputState",
        value: function outputState() {
            return {
                alpha: this.alpha,
                flashes: this.flashes.slice()
            };
        }
    }, {
        key: "z",
        get: function get() {
            return 1000;
        }
    }]);

    return Overlay;
}(PIXI.Sprite);

Overlay.fromState = function (state, game) {
    var overlay = new Overlay();
    overlay.alpha = state.alpha;
    overlay.flashes = state.flashes;
    return overlay;
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var darkSkyColor = 0x28162f,
    skyColor = 0xb2b8c0,
    goodSkyColor = 0x40c0ff,
    darkCloudColor = 0xa81c50,
    cloudColor = 0x9ca8af,
    goodCloudColor = 0xe6f2ff,
    darkGlobalColor = 0xff99cc,
    globalColor = 0xdddddd,
    goodGlobalColor = 0xfff0dd,
    cloudBackCycle = 8000,
    cloudFrontCycle = 6100;

var Game = function (_PIXI$Container) {
    _inherits(Game, _PIXI$Container);

    function Game(onFinished) {
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { x: 0, y: 0, goal: settings.goal };

        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this.eventListeners = {};
        _this.x = state.x;
        _this.y = state.y;
        _this.goal = state.goal;
        _this.onFinished = function (win) {
            Music.stop();
            onFinished(win);
        };

        _this.bg = new PIXI.Sprite(PIXI.gradient);
        _this.bg.alpha = 0.25;
        _this.bg.anchor.y = 1;
        _this.bg.z = -200;
        _this.addChild(_this.bg);

        // God
        _this.god = new God();
        if (state.god) _this.god.readState(state.god, _this);
        _this.addChild(_this.god);

        // Kingdoms
        _this.player = new Kingdom('player', 0x113996, true);
        _this.ai = new Kingdom('ai', 0xab1705, false);
        _this.gaia = new Kingdom('gaia', 0x888888, false);
        _this.kingdoms = [_this.player, _this.ai, _this.gaia];

        // Clouds a
        _this.cloudStartBack = new PIXI.OscillatingSprite(Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        _this.cloudStartBack.z = -101;
        _this.cloudStartFront = new PIXI.OscillatingSprite(Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        _this.cloudStartFront.z = -99;

        _this.cloudEndBack = new PIXI.OscillatingSprite(Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        _this.cloudEndBack.z = -101;
        _this.cloudEndFront = new PIXI.OscillatingSprite(Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        _this.cloudEndFront.z = -99;
        _this.cloudEndBack.scale.x = _this.cloudEndFront.scale.x = -1;

        // Islands
        _this.islands = [];
        if (state.islands) {
            state.islands.forEach(function (s) {
                return _this.addIsland(Island.fromState(s, _this));
            });
            _this.islands.forEach(function (island) {
                return island.resolveIndices(_this);
            });
        } else _this.generateInitial();

        // Clouds b
        _this.cloudStartBack.x = _this.cloudStartFront.x = _this.islBnds.left;
        _this.updateClouds();

        _this.cloudStartBack.anchor.x = _this.cloudStartFront.anchor.x = _this.cloudEndBack.anchor.x = _this.cloudEndFront.anchor.x = 1;
        _this.cloudStartBack.anchor.y = _this.cloudStartFront.anchor.y = _this.cloudEndBack.anchor.y = _this.cloudEndFront.anchor.y = 0.275;
        _this.addChild(_this.cloudStartBack, _this.cloudStartFront, _this.cloudEndBack, _this.cloudEndFront);

        _this.skiesMood = 0;
        _this.cloudCycle = 0;
        _this.cloudBackY = 4;
        _this.cloudFrontY = 4;

        // Overlay
        if (state.overlay) _this.overlay = Overlay.fromState(state.overlay, _this);else {
            _this.overlay = new Overlay();
            _this.overlay.flash(60);
        }
        _this.addChild(_this.overlay);
        return _this;
    }

    _createClass(Game, [{
        key: 'addChild',
        value: function addChild(child) {
            PIXI.Container.prototype.addChild.apply(this, arguments);
            if (arguments.length === 1 && child.onAdd) child.onAdd();
        }
    }, {
        key: 'update',
        value: function update(delta) {
            for (var i = this.children.length; i--;) {
                var child = this.children[i];
                if (child.update) child.update(delta, this);
                if (child.shouldRemove) {
                    this.removeChildAt(i);
                    if (child.onRemove) child.onRemove();
                }
            }

            if (this.player.linkedTo(this, this.ai)) Music.switchTo(musics.combat);else Music.switchTo(musics.regular);
        }
    }, {
        key: 'render',
        value: function render(delta, renderer) {
            var _this2 = this;

            // Positions & limits
            var width = renderer.width,
                height = renderer.height;
            if (this.down) this.updateDown(delta);
            if (this.events.keys[37]) this.x += 5 + this.islands.length;
            if (this.events.keys[39]) this.x -= 5 + this.islands.length;
            var totalWidth = this.islandsWidth;
            var target = void 0;
            if (this.islands.length === 1 || width > totalWidth) {
                target = (width - totalWidth + this.islBnds.width) / 2;
            } else target = Math.bounded(this.x, -(this.islBnds.left + totalWidth - width), -this.islBnds.left);
            this.x = target * 0.05 + this.x * 0.95;
            this.y = height - this.islBnds.bottom;
            this.god.x = -this.x + width / 2;
            this.god.y = -this.y;

            this.bg.x = -this.x;
            this.bg.y = this.islBnds.bottom;
            this.bg.width = width;
            this.bg.height = height;

            // Coloring
            var feeling = this.god.feeling(this.goal);
            this.skiesMood += (feeling - this.skiesMood) * 0.01;
            this.skiesMood = Math.bounded(this.skiesMood, -1, 1);

            this.backgroundColor = PIXI.Color.interpolate(skyColor, this.skiesMood > 0 ? goodSkyColor : darkSkyColor, Math.abs(this.skiesMood));
            this.cloudColor = PIXI.Color.interpolate(cloudColor, this.skiesMood > 0 ? goodCloudColor : darkCloudColor, Math.abs(this.skiesMood));
            this.globalColor = PIXI.Color.interpolate(globalColor, this.skiesMood > 0 ? goodGlobalColor : darkGlobalColor, Math.abs(this.skiesMood));

            this.cloudStartBack.tint = this.cloudStartFront.tint = this.cloudEndBack.tint = this.cloudEndFront.tint = this.cloudColor;
            renderer.backgroundColor = this.backgroundColor;

            // We could do smarter culling using the bounds, but it turns out that it's
            // more performant to just assume everything is 480 wide (this works
            // because our largest images are 480 wide).
            var min = 0 - this.x - this.islBnds.right,
                max = width - this.x - this.islBnds.left;
            var children = this.children;
            this.children = children.filter(function (c) {
                return (c.nonCullable || c.x >= min && c.x <= max) && (!c.render || c.render(delta, _this2, renderer) || true);
            }).sort(Game.zSort);

            renderer.render(this);
            this.children = children;
        }
    }, {
        key: 'checkForEnd',
        value: function checkForEnd() {
            if (!this.player.peopleCount && !this.player.summonCount) this.onFinished(false);else if (this.god.overallMood > this.goal) this.onFinished(true);
        }
    }, {
        key: 'addIsland',
        value: function addIsland(island) {
            if (!this.islBnds) {
                var bnds = island.getLocalBounds();
                this.islBnds = {
                    left: bnds.left,
                    top: bnds.top,
                    right: bnds.right,
                    bottom: bnds.bottom,
                    width: bnds.width,
                    height: bnds.height
                };
            }
            island.index = this.islands.length;
            island.cloudBack.time = (island.index ? this.islands[island.index - 1].cloudBack.time : this.cloudStartBack.time) + 50;
            island.cloudFront.time = (island.index ? this.islands[island.index - 1].cloudFront.time : this.cloudStartFront.time) + 50;
            this.cloudEndBack.time = island.cloudBack.time + 50;
            this.cloudEndFront.time = island.cloudFront.time + 50;

            this.islands.add(island);
            this.addChild(island);
            if (island.buildings.length) this.addChild.apply(this, island.buildings);
            if (island.people.length) this.addChild.apply(this, island.people);
            this.updateClouds();
        }
    }, {
        key: 'updateClouds',
        value: function updateClouds() {
            if (this.cloudEndBack) this.cloudEndBack.x = this.cloudEndFront.x = this.islBnds.width * (this.islands.length - 1) + this.islBnds.right;
        }
    }, {
        key: 'generateInitial',
        value: function generateInitial() {
            var kingdom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.player;

            var starting = new Island(this.islandsWidth, 0, kingdom);
            starting.generateBuilding(House, true);
            starting.generatePlain();
            starting.people.add(new Person(0, 0, Villager, kingdom, starting), new Person(0, 0, Villager, kingdom, starting), new Person(0, 0, Warrior, kingdom, starting), new Person(0, 0, Priest, kingdom, starting), new Person(0, 0, Builder, kingdom, starting));
            this.addIsland(starting);
        }
    }, {
        key: 'generateNewIsland',
        value: function generateNewIsland() {
            if (Math.random() < 2 / (3 + this.islands.length)) this.generateUninhabited();else this.generateInhabited();
        }
    }, {
        key: 'generateInhabited',
        value: function generateInhabited() {
            var kingdom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.ai;

            var count = Math.random() * this.islands.length;
            for (var i = 0; i < count; i++) {
                var island = new Island(this.islandsWidth, 0, kingdom);
                if (i === 0) island.generateOutpost();else {
                    var rnd = Math.random();
                    if (rnd < 0.33) {
                        island.generateOutpost();
                    } else if (rnd < 0.66) {
                        island.generateTemple();
                    } else {
                        island.generateCity();
                    }
                }
                if (i + 1 < count) island.generateBridge();
                this.addIsland(island);
            }
        }
    }, {
        key: 'generateUninhabited',
        value: function generateUninhabited() {
            var island = new Island(this.islandsWidth, 0, this.gaia);
            if (Math.random() < 0.5) island.generatePlain();else island.generateForest();
            this.addIsland(island);
        }
    }, {
        key: 'attachEvents',
        value: function attachEvents(container) {
            var _this3 = this;

            if (this.container) this.detachEvents();else {
                this.events = {};
                this.events.mousedown = function (ev) {
                    return _this3.beginDown(ev.pageX * scaling, ev.pageY * scaling);
                };
                this.events.touchstart = Misc.wrap(Misc.touchToMouseEv, this.events.mousedown);

                this.events.mousemove = function (ev) {
                    return _this3.onMove(ev.pageX * scaling, ev.pageY * scaling);
                };
                this.events.touchmove = Misc.wrap(Misc.touchToMouseEv, this.events.mousemove);

                this.events.mouseup = function (ev) {
                    return _this3.finishDown();
                };
                this.events.touchend = this.events.mouseup;
                this.events.mousewheel = function (ev) {
                    return _this3.x -= ev.deltaX;
                };
                this.events.keys = [];
                this.events.keydown = function (ev) {
                    return _this3.events.keys[ev.keyCode] = true;
                };
                this.events.keyup = function (ev) {
                    return _this3.events.keys[ev.keyCode] = false;
                };
            }
            this.container = container;

            container.addEventListener('mousedown', this.events.mousedown);
            container.addEventListener('touchstart', this.events.touchstart);
            document.addEventListener('mousemove', this.events.mousemove);
            container.addEventListener('touchmove', this.events.touchmove);
            window.addEventListener('touchend', this.events.touchend);
            window.addEventListener('mouseup', this.events.mouseup);
            container.addEventListener('mousewheel', this.events.mousewheel);
            document.addEventListener('keydown', this.events.keydown);
            window.addEventListener('keyup', this.events.keyup);
        }
    }, {
        key: 'detachEvents',
        value: function detachEvents() {
            this.container.removeEventListener('mousedown', this.events.mousedown);
            this.container.removeEventListener('touchstart', this.events.touchstart);
            document.removeEventListener('mousemove', this.events.mousemove);
            this.container.removeEventListener('touchmove', this.events.touchmove);
            window.removeEventListener('mouseup', this.events.mouseup);
            window.removeEventListener('touchend', this.events.touchend);
            this.container.removeEventListener('mousewheel', this.events.mousewheel);
            document.removeEventListener('keydown', this.events.keydown);
            window.removeEventListener('keyup', this.events.keyup);
            this.container = null;
        }
    }, {
        key: 'beginDown',
        value: function beginDown(x, y) {
            this.down = {
                start: x,
                last: x,
                current: x,

                originalPos: this.x,
                time: performance.now(),
                velocity: 0
            };
        }
    }, {
        key: 'finishDown',
        value: function finishDown() {
            if (this.down) this.down.finished = true;
        }
    }, {
        key: 'updateDown',
        value: function updateDown(delta) {
            if (!this.down.finished) {
                var diff = this.down.current - this.down.last;
                this.down.velocity = this.down.velocity * 0.5 + diff * 0.75;
                this.x += diff;
                this.down.last = this.down.current;
            } else {
                this.down.velocity *= 0.90;
                this.x += this.down.velocity;
            }

            if (this.down.finished && Math.abs(this.down.velocity) < 0.01) this.down = null;
        }
    }, {
        key: 'onMove',
        value: function onMove(x, y) {
            if (this.down && !this.down.finished) {
                this.down.current = x;
            }
        }
    }, {
        key: 'listeners',
        value: function listeners(name) {
            return this.eventListeners[name] || (this.eventListeners[name] = []);
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(name, listener) {
            this.listeners(name).add(listener);
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(name, listener) {
            this.listeners(name).remove(listener);
        }
    }, {
        key: 'onGodChangePersonality',
        value: function onGodChangePersonality() {
            this.listeners('godChangePersonality').forEach(function (listener) {
                return listener();
            });
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return {
                x: this.x,
                y: this.y,
                goal: this.goal,
                overlay: this.overlay.outputState(),
                god: this.god.outputState(),
                islands: this.islands.map(function (island) {
                    return island.outputState();
                })
            };
        }
    }, {
        key: 'islandsWidth',
        get: function get() {
            return this.islBnds ? this.islands.length * this.islBnds.width : 0;
        }
    }]);

    return Game;
}(PIXI.Container);

Game.zSort = function (a, b) {
    return (a.z || 0) - (b.z || 0);
};
Game.loadedHandlers = [];
Object.defineProperty(Game, 'loaded', {
    get: function get() {
        return this._loaded;
    },
    set: function set(val) {
        while (Game.loadedHandlers.length) {
            Game.loadedHandlers.shift()();
        }this._loaded = val;
    }
});
Game.onLoad = function (handler) {
    if (Game.loaded) handler();else Game.loadedHandlers.push(handler);
};
PIXI.loader.load(function () {
    return Game.loaded = true;
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FPSCounter = function () {
    function FPSCounter() {
        var _this = this;

        _classCallCheck(this, FPSCounter);

        this.tag = dom('div', { class: 'fps-counter' });
        this.fps = this.lastDelta = 0;
        settings.bind('fps', function (t) {
            return _this.tag.classList[t ? 'remove' : 'add']('hidden');
        });
    }

    _createClass(FPSCounter, [{
        key: 'update',
        value: function update(delta) {
            var fpsFromDelta = 1000 / delta;
            this.fps = this.fps * 0.9 + fpsFromDelta * 0.1;
            this.lastDelta = delta;
            this.tag.textContent = this.fps | 0;
        }
    }]);

    return FPSCounter;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = function () {
    function UI(gameContainer, onTitle) {
        var _this = this;

        _classCallCheck(this, UI);

        this.gameContainer = gameContainer;
        this.gameContainer.classList.add('hidden');
        this.onTitle = function () {
            _this.titleTag.removeEventListener('click', _this.onTitle);
            onTitle();
        };

        this.titleTag = dom('div', { class: 'hidden title', click: this.onTitle });

        this.btnsTag = dom('div', { class: 'hidden btns' }, this.groupSelectTag = dom('div', { class: 'group-select' }), this.groupsTag = dom('div', { class: 'groups' }));

        settings.bind('tooltips', function (t) {
            return _this.btnsTag.classList[t ? 'add' : 'remove']('tooltips');
        });

        this.trainGroup = this.createGroup('train');
        this.untrainGroup = this.createGroup('untrain');
        this.trainGroup.radio.onclick = this.untrainGroup.radio.onclick = function () {
            return _this.tip('jobs');
        };

        this.buildGroup = this.createGroup('build');
        this.buildGroup.radio.onclick = function () {
            return _this.tip('buildings');
        };

        this.doGroup = this.createGroup('do');
        this.moveGroup = this.createGroup('move');

        this.show(this.doGroup);

        this.btns = ['train', 'untrain'].reduce(function (btns, act) {
            return [Builder, Warrior, Priest].reduce(function (btns, job) {
                var v = function v() {
                    return _this.game.player.villagerCount;
                };
                var j = function j() {
                    return _this.game.player[job.name + 'Count'];
                };
                btns.add(_this.createBtn(_this[act + 'Group'].children, function () {
                    return _this.game.player[act](_this.game, job);
                }, act === 'train' ? function () {
                    return [v(), j()];
                } : function () {
                    return [j(), v()];
                }, job.name, act, job.name));
                return btns;
            }, btns);
        }, []).concat([House, Barracks, Workshop, Temple, GreenHouse].reduce(function (btns, type) {
            btns.add(_this.createBtn(_this.buildGroup.children, function () {
                return _this.game.player.build(_this.game, type);
            }, function () {
                return _this.game.player[type.name + 'Count'];
            }, type.name, 'build', type.name));
            return btns;
        }, [])).concat([this.createBtn(this.buildGroup.children, function () {
            return _this.game.player.buildBridge(_this.game);
        }, null, 'bridge', 'build', 'bridge'), this.createBtn(this.doGroup.children, function () {
            return _this.game.player.forestate(_this.game);
        }, function () {
            return _this.game.player.treeCount + _this.game.player.bigTreeCount;
        }, 'forestate', 'forestate'), this.createBtn(this.doGroup.children, function () {
            return _this.game.player.deforest(_this.game);
        }, null, 'deforest', 'deforest'), this.createBtn(this.doGroup.children, function () {
            return _this.game.god.doSacrifice(_this.game);
        }, null, 'sacrifice', 'sacrifice'), this.createBtn(this.doGroup.children, function () {
            return _this.game.player.doBaby(_this.game);
        }, function () {
            return _this.game.player.peopleCount + '/' + _this.game.player.maxPop;
        }, 'baby', 'baby'), this.createBtn(this.doGroup.children, function () {
            return _this.game.player.attemptSummon(_this.game);
        }, function () {
            return _this.game.player.summonCount + '/' + _this.game.player.maxSummon;
        }, 'summon', 'summon'), this.createBtn(this.doGroup.children, function () {
            return _this.game.player.pray(_this.game);
        }, null, 'pray', 'pray'), this.createBtn(this.moveGroup.children, function () {
            return _this.game.player.sendAttack(_this.game);
        }, null, 'attack', 'attack'), this.createBtn(this.moveGroup.children, function () {
            return _this.game.player.sendConvert(_this.game);
        }, null, 'convert', 'convert'), this.createBtn(this.moveGroup.children, function () {
            return _this.game.player.sendRetreat(_this.game);
        }, null, 'retreat', 'retreat')]);

        this.menuContainerTag = dom('div', { class: 'menu-container' }, this.menuBtn('pause-btn', function (ev) {
            return ev.target.checked ? pause() : resume();
        }), this.menuBtn('menu-btn'), this.menuTag = dom('div', { class: 'menu' }, settings.usr.map(function (n) {
            return dom('div', {}, dom('label', { textContent: n, htmlFor: n }), settings.inputFor(n));
        }), dom('div', {}, dom('a', { href: 'javascript:newGame()' }, 'new'), settings.inputFor('goal')), dom('div', {}, dom('a', { href: 'javascript:save()' }, 'save')), dom('div', {}, dom('a', { href: 'javascript:restore()' }, 'restore')), dom('div', {}, dom('a', {
            href: 'https://github.com/Dagothig/tiny_religion.js/',
            target: 'blank'
        }, 'source'))));

        this.tips = {};
        this.tipsQueue = [];
        this.tipTag = dom('div', { class: 'tip initial' }, this.tipTextTag = dom('div', { class: 'text' }), this.tipOkTag = dom('button', {
            click: function click() {
                return _this.dequeueTip();
            }
        }, 'gotcha'));
        this.gameContainer.appendChild(this.tipTag);

        settings.bind('tips', function (t) {
            if (t) return;
            _this.tips = {};
            _this.tipsQueue = [];
            _this.tipTag.classList.add('hidden');
        });

        this.notifyTag = dom('div', { class: 'notify' });
        this.gameContainer.appendChild(this.notifyTag);

        this.fpsCounter = new FPSCounter();
        this.gameContainer.appendChild(this.fpsCounter.tag);
    }

    _createClass(UI, [{
        key: 'createGroup',
        value: function createGroup(name) {
            var _this2 = this;

            var group = {};
            group.radio = dom('input', {
                id: name, name: 'group', type: 'radio', class: 'checked', value: name,
                change: function change() {
                    return _this2.show(group);
                }
            });
            group.nameTag = dom('label', { class: 'check', htmlFor: name }, group.nameContent = dom('span', {}, name));
            group.children = dom('div', { class: 'group' });

            this.groupSelectTag.appendChild(group.radio);
            this.groupSelectTag.appendChild(group.nameTag);
            this.groupsTag.appendChild(group.children);

            return group;
        }
    }, {
        key: 'createBtn',
        value: function createBtn(parent, onclick, onupdate, name) {
            var _this3 = this;

            var obj = { update: onupdate, textTags: [] };

            for (var _len = arguments.length, classes = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
                classes[_key - 4] = arguments[_key];
            }

            obj.tag = dom('div', {}, obj.btn = dom('button', {
                class: 'btn ' + classes.join(' '),
                click: function click() {
                    return _this3.notify(onclick());
                }
            }), obj.tooltip = dom('div', { class: 'tooltip' }, name));
            parent.appendChild(obj.tag);
            return obj;
        }
    }, {
        key: 'menuBtn',
        value: function menuBtn(name, change) {
            return [dom('input', {
                id: name,
                name: name,
                type: 'checkbox',
                class: 'checked ' + name,
                change: change
            }), dom('label', {
                class: 'check',
                htmlFor: name
            })];
        }
    }, {
        key: 'updateText',
        value: function updateText(btn, i, text) {
            var span = btn.textTags[i];
            if (!span) {
                btn.textTags[i] = span = document.createElement('span');
                btn.btn.appendChild(span);
            }
            if (span._text === text) return;
            span.textContent = span._text = text;
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            var _this4 = this;

            this.game = game;
            if (game) {
                this.btns.forEach(function (btn) {
                    var text = btn.update && btn.update();
                    if (text instanceof Array) text.forEach(function (t, i) {
                        return _this4.updateText(btn, i, text[i]);
                    });else _this4.updateText(btn, 0, text);
                });
            }

            this.fpsCounter.update(delta);
        }
    }, {
        key: 'show',
        value: function show(group) {
            for (var i = this.groupsTag.children.length; i--;) {
                this.groupsTag.children[i].classList.add('hidden');
            }group.radio.checked = true;
            group.children.classList.remove('hidden');
        }
    }, {
        key: 'showTitle',
        value: function showTitle() {
            var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.titleTag.classList.remove('hidden', 'win', 'lost');
            this.btnsTag.classList.add('hidden');
            this.gameContainer.classList.add('hidden');
            if (win !== null) {
                if (win) {
                    sounds.win.play();
                    this.titleTag.classList.add('win');
                } else {
                    sounds.loss.play();
                    this.titleTag.classList.add('lost');
                }
            } else sounds.titleScreen.play();
            if (window.android) android.updateStatusTint(0x193bcb);
            this.titleTag.addEventListener('click', this.onTitle);
            this.tipTag.classList.add('hidden');
        }
    }, {
        key: 'hideTitle',
        value: function hideTitle() {
            this.titleTag.classList.add('hidden');
            this.btnsTag.classList.remove('hidden');
            this.gameContainer.classList.remove('hidden');
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.btns.forEach(function (btn) {
                return btn.btn.disabled = true;
            });
        }
    }, {
        key: 'resume',
        value: function resume() {
            this.btns.forEach(function (btn) {
                return btn.btn.disabled = false;
            });
        }
    }, {
        key: 'tip',
        value: function tip(id) {
            var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : strs.tips[id];

            if (!settings.tips || this.tips[id]) return;
            this.tips[id] = true;
            this.tipsQueue.push({ id: id, text: text });
            if (this.tipTag.classList.contains('hidden')) this.dequeueTip();
        }
    }, {
        key: 'dequeueTip',
        value: function dequeueTip() {
            var tip = this.tipsQueue.shift();
            if (tip) {
                this.tipTag.classList.remove('hidden', 'initial');
                this.tipTextTag.textContent = tip.text;
            } else {
                this.tipTag.classList.add('hidden');
            }
        }
    }, {
        key: 'notify',
        value: function notify(msg) {
            var notif = dom('div', {
                animationend: function animationend() {
                    return notif.remove();
                },
                style: 'animation-duration: ' + (msg.extra && settings.tips ? 4 : 2) + 's;'
            }, msg.message || msg, settings.tips && msg.extra && dom('div', { class: 'extra' }, msg.extra));
            this.notifyTag.appendChild(notif);

            var height = notif.clientHeight;
            var children = Array.from(this.notifyTag.children).filter(function (c) {
                return c !== notif;
            });

            notif.style.top = [0].concat(children.map(function (c) {
                return c.offsetTop + c.clientHeight;
            })).filter(function (p) {
                return children.every(function (c) {
                    return p >= c.offsetTop + c.clientHeight || p + height <= c.offsetTop;
                });
            }).sort(function (a, b) {
                return a - b;
            })[0] + 'px';
        }
    }, {
        key: 'updateToGodColor',
        value: function updateToGodColor(game) {
            this.btnsTag.style.backgroundColor = '#' + game.god.offTint.toString('16').padStart(6, '0');
            if (window.android) android.updateStatusTint(game.god.offTint);
        }
    }, {
        key: 'onGodChangePersonality',
        value: function onGodChangePersonality(game) {
            this.updateToGodColor(game);
            this.tip('color');
        }
    }, {
        key: 'onNewGame',
        value: function onNewGame(game) {
            var _this5 = this;

            this.updateToGodColor(game);
            game.addEventListener('godChangePersonality', function () {
                return _this5.onGodChangePersonality(game);
            });
            this.tip('please');
        }
    }]);

    return UI;
}();
'use strict';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var scaling = 1;
var container = dom('div', { id: 'container' });
var ui = new UI(container, function () {
    return newGame();
});
var renderer = void 0,
    game = void 0;

var paused = false;
function resume() {
    paused = false;
    container.classList.remove('paused');
    Music.resume();
    ui.resume();
}
function pause() {
    paused = true;
    container.classList.add('paused');
    Music.pause();
    ui.pause();
}

function newGame() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    Game.onLoad(function () {
        if (game) game.detachEvents();
        ui.hideTitle();
        game = new Game(function (win) {
            ui.showTitle(win);
            game.detachEvents();
            game = null;
        }, state);
        game.attachEvents(container);
        ui.onNewGame(game);
    });
}

var state = JSON.parse(localStorage.getItem('save'));
function save() {
    if (!game) return;
    localStorage.setItem('save', JSON.stringify(state = game.outputState()));
    ui.notify('saved');
}
function restore() {
    state && newGame(state);
    ui.notify('restored');
}

function saveTemp() {
    if (!game) return;
    localStorage.setItem('saveTemp', JSON.stringify(game.outputState()));
}
function restoreTemp() {
    var tempState = JSON.parse(localStorage.getItem('saveTemp'));
    localStorage.removeItem('saveTemp');
    tempState && newGame(tempState);
}

function setupGame() {
    // Setup container
    document.body.appendChild(container);

    // Setup ui
    document.body.appendChild(ui.titleTag);
    document.body.appendChild(ui.btnsTag);
    document.body.appendChild(ui.menuContainerTag);
    ui.showTitle();

    // Setup renderer
    renderer = PIXI.autoDetectRenderer();
    renderer.roundPixels = true;
    container.appendChild(renderer.view);

    // Setup resize hook
    var resize = function resize() {
        var w = container.clientWidth,
            h = container.clientHeight;
        if (!h) return;
        scaling = 1;
        var minDst = 420;
        if (h < minDst) {
            scaling = minDst / h;
            w *= minDst / h;
            h = minDst;
        }
        while (h > minDst * 2) {
            scaling /= 2;
            w /= 2;
            h /= 2;
        }
        renderer.resize(w, h);
    };
    window.addEventListener('resize', resize);
    resize();

    Game.onLoad(function () {
        // Setup event loop
        var last = performance.now();
        var upd = function upd() {
            var time = performance.now();
            var delta = time - last || 1;

            if (game) {
                if (!paused) game.update(delta, renderer.width, renderer.height);
                game.render(delta, renderer);
                if (!paused) game.checkForEnd();
            }
            ui.update(delta, game);

            last = time;
            requestAnimationFrame(upd);
        };
        upd();
        resize();
    });
}
window.addEventListener("DOMContentLoaded", function () {
    var splash = document.querySelector('.splash');
    if (!splash) return setupGame();
    var handler = function handler() {
        return splash && (splash.remove(), splash = null, setupGame());
    };
    splash.onclick = handler;
    setTimeout(handler, 2000);
});