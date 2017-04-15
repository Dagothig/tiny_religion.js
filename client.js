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
Array.prototype.add = Array.prototype.push;
Array.prototype.remove = function () {
    for (var i = 0; i < arguments.length; i++) {
        var index = this.indexOf(arguments[i]);
        if (index === -1) continue;
        this.splice(index, 1);
    }
};
Array.prototype.rand_i = function () {
    return Math.random() * this.length | 0;
};
Array.prototype.rand = function () {
    return this[this.rand_i()];
};

var Misc = {
    touchToMouseEv: function touchToMouseEv(ev) {
        var newEv = Array.from(ev.touches).reduce(function (obj, touch) {
            obj.pageX += touch.pageX;
            obj.pageY += touch.pageY;
            return obj;
        }, { pageX: 0, pageY: 0 });
        newEv.pageX /= ev.touches.length;
        newEv.pageY /= ev.touches.length;
        newEv.pageX *= scaling;
        newEv.pageY *= scaling;
        return newEv;
    },
    wrap: function wrap(f1, f2) {
        var _this = this;

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return f2(f1.apply(_this, args));
        };
    }
};
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
        if (!!(this.tilesX % 1 || this.tilesY % 1)) throw "The texture size is not a multiple of the tile size:", this.tilesX, this.tilesY;

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
            key: "update",
            value: function update(delta) {
                this.time += this.mult * delta;
                var moment = (Math.sin(this.time) + 1) / 2;
                _set(OscillatingSprite.prototype.__proto__ || Object.getPrototypeOf(OscillatingSprite.prototype), "x", this.displayX + moment * this.rangeX + this.minX, this);
                _set(OscillatingSprite.prototype.__proto__ || Object.getPrototypeOf(OscillatingSprite.prototype), "y", this.displayY + moment * this.rangeY + this.minY, this);
            }
        }, {
            key: "x",
            get: function get() {
                return this.displayX;
            },
            set: function set(val) {
                this.displayX = val;
            }
        }, {
            key: "y",
            get: function get() {
                return this.displayY;
            },
            set: function set(val) {
                this.displayY = val;
            }
        }]);

        return OscillatingSprite;
    }(Sprite);

    requestAnimationFrame(function () {
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
        settings.all.push(key);

        var conf = confs[key];

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
        bind: function bind(key, cb) {
            this['_' + key + 'CBs'].push(cb);
            cb(this[key]);
        },
        _clear: function _clear(key) {
            this[key] = this['_' + key + 'Conf'][0];
        },
        clear: function clear() {
            var _this = this;

            if (arguments.length) Array.from(arguments).forEach(function (key) {
                return _this._clear(key);
            });else this.all.forEach(function (key) {
                return _this._clear(key);
            });
        },
        inputFor: function inputFor(name) {
            var _this2 = this;

            var conf = this['_' + name + 'Conf'];
            var input = void 0;
            var onchange = function onchange() {
                return _this2[name] = input.value;
            };
            switch (conf[1]) {
                case 'str':
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = this[name];
                    break;
                case 'num':
                    input = document.createElement('input');
                    input.type = 'numeric';
                    input.value = this[name];
                    break;
                case 'bool':
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = this[name];
                    onchange = function onchange() {
                        return _this2[name] = input.checked;
                    };
                    break;
                case 'choice':
                    input = document.createElement('select');
                    input.selectedIndex = Object.entries(conf[3]).map(function (opt) {
                        var entry = document.createElement('option');
                        entry.innerHTML = opt[0];
                        entry.value = opt[1];
                        input.appendChild(entry);
                        return entry;
                    }) // Fuzzy equality
                    .findIndex(function (e) {
                        return e.value == _this2[name];
                    });
                    break;
            }
            input.id = input.name = name;
            input.onchange = onchange;
            return input;
        }
    });
}({
    str: {
        toStr: function toStr(str) {
            return str + '';
        },
        fromStr: function fromStr(str) {
            return str;
        }
    },
    num: {
        toStr: function toStr(num) {
            return num + '';
        },
        fromStr: function fromStr(str) {
            return new Number(str).valueOf();
        }
    },
    bool: {
        toStr: function toStr(val) {
            return val ? 'true' : 'false';
        },
        fromStr: function fromStr(str) {
            return str === 'true';
        }
    },
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
    tooltips: [true, 'bool', 'usr'],
    music: [true, 'bool', 'usr'],
    sound: [true, 'bool', 'usr'],
    goal: [12000, 'choice', 'usr', {
        tiny: 3000,
        short: 6000,
        medium: 12000,
        long: 24000
    }]
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
        this.sounds = paths.map(function (p) {
            var snd = fetchSound(p);
            var self = _this;
            snd.onended = function () {
                self.available.add(this);
            };
            return snd;
        });
        this.available = this.sounds.map(function (s) {
            return [s];
        });
    }

    _createClass(Sound, [{
        key: 'play',
        value: function play(onended) {
            var volume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            if (Sound.mute) return;
            var i = this.sounds.rand_i();
            var sound = this.available[i].pop();
            if (!sound) {
                var base = this.sounds[i];
                sound = base.cloneNode();
                sound.onended = base.onended;
            }
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SFXType = function SFXType(decalX, decalY, decalZ, frameDuration) {
    _classCallCheck(this, SFXType);

    this.decalX = decalX;
    this.decalY = decalY;
    this.decalZ = decalZ;
    this.frameDuration = frameDuration;
};

var Blood = new SFXType(4, 10, 0, 8),
    Summon = new SFXType(4, 10, 0, 8),
    Sparkle = new SFXType(4, 10, 0, 8),
    Lightning = new SFXType(16, 128, 0, 8);

var SFX = function (_PIXI$TiledSprite) {
    _inherits(SFX, _PIXI$TiledSprite);

    function SFX(x, y, type) {
        _classCallCheck(this, SFX);

        var _this = _possibleConstructorReturn(this, (SFX.__proto__ || Object.getPrototypeOf(SFX)).call(this, type.texture));

        _this.currentFrame = type.frameDuration;
        _this.decal = { x: type.decalX, y: type.decalY };
        _this.x = x;
        _this.y = y;
        if (Math.random() < 0.5) _this.scale.x = -1;
        _this.tileY = type.tileY;
        _this.type = type;
        return _this;
    }

    _createClass(SFX, [{
        key: 'update',
        value: function update() {
            this.currentFrame--;
            while (this.currentFrame < 0) {
                this.currentFrame += this.type.frameDuration;
                if (this.tileX + 1 === this.tilesX) this.shouldRemove = true;else this.tileX++;
            }
        }
    }, {
        key: 'z',
        get: function get() {
            return this.y + this.type.decalZ;
        }
    }]);

    return SFX;
}(PIXI.TiledSprite);

PIXI.loader.add('lightning', 'images/Lightning.png', null, function (res) {
    SFX.lightning = new PIXI.TiledTexture(res.texture, 32, 128);
    Lightning.texture = SFX.lightning;
    Lightning.tileY = 0;
}).add('miscSFX', 'images/SpecialEffects.png', null, function (res) {
    SFX.misc = new PIXI.TiledTexture(res.texture, 8, 12);
    Blood.texture = Summon.texture = Sparkle.texture = SFX.misc;
    Blood.tileY = 0;
    Summon.tileY = 1;
    Sparkle.tileY = 2;
});
'use strict';

// personalityColors[life][manMade]

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var personalityColors = [[, 0x00ff00], [, 0xffffff], [, 0xff0088]];

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
            }
        };

        _this.changePersonality(true);
        return _this;
    }

    _createClass(God, [{
        key: 'update',
        value: function update(delta, game) {
            this.overallMood += this.mood;
            this.mood -= 0.01 * Math.sign(this.mood);
            if (Math.abs(this.mood) < 0.01) this.mood = 0;

            if (Math.random() < -this.feeling(game.goal) / 400) this.doSacrifice(game);

            if (this.mood > 0) {
                this.satisfaction += this.mood;
                if (this.satisfaction > game.goal / 10) this.changePersonality(false, game);
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
        key: 'doSacrifice',
        value: function doSacrifice(game) {
            var islands = game.islands.filter(function (i) {
                return i.people.find(function (p) {
                    return p.kingdom === game.player;
                });
            });
            var island = islands.rand();
            if (!island) return;
            var dude = void 0;
            do {
                dude = island.people.rand();
            } while (!dude.kingdom === game.player);
            this.event('sacrifice', 1, dude.position);
            game.addChild(new SFX(dude.x, dude.y, Lightning));
            sounds.lightning.play();
            game.overlay.flash(8);
            dude.die(game);
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
            var range = max - min;
            if (base) {
                this.likesLife = max;
                this.likesAttention = max / 4;
                this.likesManMade = min / 4;
                this.sincePersonality = God.personalityLength * 4 / 5;
            } else {
                this.likesLife = min + Math.random() * range;
                this.likesAttention = min + Math.random() * range;
                this.likesManMade = min + Math.random() * range;
            }
            this.updateColor();
        }
    }, {
        key: 'updateColor',
        value: function updateColor() {
            var life = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.likesLife / God.preferenceModifier;
            var man = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.likesManMade / God.preferenceModifier;
            var attention = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.likesAttention / God.preferenceModifier;

            // Get the angle into the range [0, 4[
            var angle = 2 * Math.atan2(man, life) / Math.PI;
            if (angle < 0) angle = 4 + angle;

            var hue = Math.shift(
            // From 0 to 1; +life+man; from teal-ish blue to purple
            angle <= 1 ? 11 / 16 + angle * 3 / 16 :
            // From 1 to 2; -life+man; from purple to orange-ish
            angle <= 2 ? 14 / 16 + (angle - 1) * 3 / 16 :
            // From 2 to 3; -life-man; from orange-ish to green
            angle <= 3 ? 1 / 16 + (angle - 2) * 3 / 16 :
            // From 3 to 5; -life+man; from green to teal-ish blue
            4 / 16 + (angle - 3) * 7 / 16, 0, 1);
            var saturation = Math.max(Math.abs(life), Math.abs(man));
            var lightness = attention / (attention < 0 ? 6 : 4) + 0.5;
            this.tint = PIXI.Color.fromHSL(hue, saturation, lightness);
            this.offTint = PIXI.Color.fromHSL(hue, saturation * 0.5, lightness * 0.5);
            if (window.android) android.updateStatusTint(this.offTint);
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
    }]);

    return God;
}(PIXI.Container);

God.preferenceModifier = 1;
God.personalityLength = 5000;
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
        this.resetCount = function (x) {
            return _this[x.name + 'Count'] = 0;
        };
        this.addToPersonCount = function (x) {
            if (x.kingdom !== _this) return;
            if (x.isSummon) _this.summonCount++;else _this.peopleCount++;
            _this[x.job.name + 'Count']++;
        };
        this.addToBuildingCount = function (x) {
            return x.finished ? _this[x.type.name + 'Count']++ : x.type === Tree ? _this.growing++ : x.type !== FallingTree ? _this.unfinished++ : null;
        };
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
            if (this.builded) return false;
            for (var i = 0; i < game.islands.length * 4; i++) {
                var island = game.islands.rand();
                if (island.kingdom !== this) continue;
                var building = island.generateBuilding(type, false);
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
                if (this.isPlayer) sounds.build.play();
                return true;
            }
            return false;
        }
    }, {
        key: 'buildBridge',
        value: function buildBridge(game) {
            var _this3 = this;

            if (this.builded) return false;
            var index = game.islands.findIndex(function (i) {
                return !i.bridge && i.kingdom === _this3;
            });
            var island = game.islands[index];
            if (!island) return false;
            var bridge = new Building(island.x + island.getLocalBounds().right, island.y, Bridge, this, island);
            game.addChild(bridge);
            island.buildings.add(bridge);
            island.bridge = bridge;
            if (index === game.islands.length - 1) game.generateNewIsland();
            for (var j = 0; j < 3; j++) {
                var person = this.findOfJob(game, Builder, function (p) {
                    return !p.building;
                });
                if (!person) break;
                person.building = bridge;
                person.movements.length = 0;
            }
            if (this.isPlayer) sounds.build.play();
            return true;
        }
    }, {
        key: 'forestate',
        value: function forestate(game) {
            if (this.growing) return false;
            for (var i = 0; i < game.islands.length * 3; i++) {
                var island = game.islands.rand();
                if (island.kingdom !== this) continue;
                var tree = island.generateBuilding(Tree, false);
                if (!tree) continue;
                game.addChild(tree);
                if (this.isPlayer) sounds.build.play();
                return true;
            }
            return false;
        }
    }, {
        key: 'deforest',
        value: function deforest(game) {
            var _this4 = this;

            var islands = game.islands.filter(function (island) {
                return island.kingdom === _this4;
            });
            if (!this.treeCount) return false;
            var trees = null,
                island = null,
                maxTries = 10000;
            while (!trees || !trees.length) {
                island = islands[Math.random() * islands.length | 0];
                trees = island.buildings.filter(function (b) {
                    return b.type === Tree && b.finished;
                });
                if (!maxTries--) return false;
            }
            if (!trees || !trees.length) return false;
            var tree = trees[Math.random() * trees.length | 0];
            tree.shouldRemove = true;
            var felled = new Building(tree.x, tree.y, FallingTree, this, island);
            game.addChild(felled);
            island.buildings.add(felled);
            if (this.isPlayer) {
                game.god.event('tree', -1, felled.position);
                sounds.build.play();
            }
            return true;
        }
    }, {
        key: 'train',
        value: function train(game, job) {
            var person = this.findOfJob(game, Villager);
            if (person) {
                game.addChild(new SFX(person.x, person.y, Summon));
                person.job = job;
                if (this.isPlayer) {
                    game.god.event(job.name, 1, person.position);
                    sounds[job.name + 'Train'].play();
                }
            }
        }
    }, {
        key: 'untrain',
        value: function untrain(game, job) {
            var person = this.findOfJob(game, job);
            if (person) {
                game.addChild(new SFX(person.x, person.y, Summon));
                person.job = Villager;
                if (this.isPlayer) {
                    game.god.event(job.name, -1, person.position);
                    sounds.untrain.play();
                }
            }
        }
    }, {
        key: 'doBaby',
        value: function doBaby(game) {
            var _this5 = this;

            if (game.islands.find(function (island) {
                return island.people.find(function (person) {
                    return person.kingdom === _this5 && person.job === Villager && Villager.doBaby.call(person, game);
                });
            }) && this.isPlayer) sounds.baby.play();
        }
    }, {
        key: 'attemptSummon',
        value: function attemptSummon(game) {
            var _this6 = this;

            if (game.islands.find(function (island) {
                return island.people.find(function (person) {
                    return person.kingdom === _this6 && person.job === Priest && Priest.doSummon.call(person, game);
                });
            }) && this.isPlayer) sounds.summon.play();
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
                game.god.event('pray', prop, p.position);
            }
        }
    }, {
        key: 'sendAttack',
        value: function sendAttack(game) {
            var _this8 = this;

            var mean = game.islands.filter(function (isl) {
                return isl.kingdom !== _this8;
            }).rand();
            if (!mean) return false;
            game.islands.forEach(function (island) {
                return island.kingdom === _this8 && island.people.forEach(function (person) {
                    return person.kingdom === _this8 && person.job === Warrior && person.moveTo(game.islands, mean.index);
                });
            });
            return true;
        }
    }, {
        key: 'sendConvert',
        value: function sendConvert(game) {
            var _this9 = this;

            var mean = game.islands.filter(function (isl) {
                return isl.kingdom !== _this9;
            }).rand();
            if (!mean) return false;
            game.islands.forEach(function (island) {
                return island.kingdom === _this9 && island.people.forEach(function (person) {
                    return person.kingdom === _this9 && person.job === Priest && person.moveTo(game.islands, mean.index);
                });
            });
            return true;
        }
    }, {
        key: 'sendRetreat',
        value: function sendRetreat(game) {
            var _this10 = this;

            var ally = game.islands.filter(function (isl) {
                return isl.kingdom === _this10;
            }).rand();
            if (!ally) return false;
            game.islands.forEach(function (island) {
                return island.kingdom !== _this10 && island.people.forEach(function (person) {
                    return person.kingdom === _this10 && person.moveTo(game.islands, ally.index);
                });
            });
            return true;
        }
    }, {
        key: 'maxPop',
        get: function get() {
            return Math.floor(this.islandCount * 5 + this.houseCount * 5 + this.treeCount / 4);
        }
    }, {
        key: 'housed',
        get: function get() {
            return this.peopleCount >= this.maxPop;
        }
    }, {
        key: 'maxSummon',
        get: function get() {
            return this.templeCount * 10;
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
        _this.ground.anchor.y = _this.cloudBack.anchor.y = _this.cloudFront.anchor.y = 0.3;
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
                    return b.isInRadius(pos, radius);
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

            var buildingCount = 0,
                treeCount = 0;
            this.buildings = this.buildings.filter(function (b) {
                if (b.type === Tree) treeCount++;else if (b.type === FallingTree) {} else if (b.type !== Bridge) buildingCount++;
                return !b.shouldRemove;
            });
            this.ground.tileX = Math.bounded(buildingCount / 3 - treeCount / 6, 0, 3) | 0;

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
            this.kingdom = newKingdom;
            if (this.kingdom.isPlayer) sounds.islandWin.play();else sounds.islandLose.play();
            this.buildings.forEach(function (b) {
                b.kingdom = newKingdom;
                b.updateTextureState();
            });
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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BuildingType = function () {
    function BuildingType(name, path, decalX, decalY, decalZ, playerColored, radius, buildTime, ext) {
        var _this = this;

        _classCallCheck(this, BuildingType);

        this.name = name;
        Building.types.add(this);
        PIXI.loader.add(name, path, null, function (res) {
            return _this.init(res.texture);
        });
        this.decalX = decalX;
        this.decalY = decalY;
        this.decalZ = decalZ;
        this.playerColored = playerColored;
        this.radius = radius;this.radius2 = radius * radius;
        this.buildTime = buildTime;
        if (ext) Object.merge(this, ext);
    }

    _createClass(BuildingType, [{
        key: 'init',
        value: function init(texture) {
            this.texture = new PIXI.TiledTexture(texture, this.playerColored ? texture.width / 2 : texture.width, texture.height / 2);
        }
    }]);

    return BuildingType;
}();

var Building = function (_PIXI$TiledSprite) {
    _inherits(Building, _PIXI$TiledSprite);

    function Building(x, y, type, kingdom, island) {
        var finished = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Building);

        var _this2 = _possibleConstructorReturn(this, (Building.__proto__ || Object.getPrototypeOf(Building)).call(this, type.texture));

        _this2.x = x;
        _this2.y = y;
        if (Math.random() < 0.5) _this2.scale.x = -1;
        _this2.decal.x = _this2.texture.width / 2 + type.decalX;
        _this2.decal.y = _this2.texture.height / 2 + type.decalY;
        _this2.type = type;
        _this2.buildTime = finished ? 0 : type.buildTime;
        _this2.kingdom = kingdom;
        _this2.island = island;
        _this2.finished = finished;
        if (_this2.type.building) _this2.type.building.apply(_this2, arguments);
        _this2.updateTextureState();
        return _this2;
    }

    _createClass(Building, [{
        key: 'isInRadius',
        value: function isInRadius(o, radius) {
            radius = radius || o.radius;
            return radius ? Math.dst(this.x, this.y, o.x, o.y) < this.radius + radius : Math.dst2(this.x, this.y, o.x, o.y) < this.radius2;
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
                this.finished = true;
                this.updateTextureState();
                if (this.kingdom.isPlayer) {
                    game.god.event(this.type.name, 1, this.position);
                    sounds.done.play();
                }
                if (this.type.onFinished) this.type.onFinished.call(this);
            }
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            if (this.type.update) this.type.update.apply(this, arguments);
        }
    }, {
        key: 'render',
        value: function render(delta, game, renderer) {
            this.tint = game.globalColor;
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
        key: 'z',
        get: function get() {
            return this.y + this.type.decalZ;
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
var Bridge = new BuildingType('bridge', 'images/Bridge.png', -10, -47, -30, false, 200, 10000, {
    building: function building() {
        this.island.bridge = this;
        this.scale.x = 1;
    }
}),
    House = new BuildingType('house', 'images/House.png', 0, 0, 16, true, 20, 2000),
    Barracks = new BuildingType('barracks', 'images/Barracks.png', 0, 0, 16, true, 35, 10000),
    Workshop = new BuildingType('workshop', 'images/Workshop.png', 0, 0, 16, true, 35, 10000),
    Temple = new BuildingType('temple', 'images/Temple.png', 0, 0, 16, true, 35, 10000),
    GreenHouse = new BuildingType('greenHouse', 'images/GreenHouse.png', 0, 0, 16, true, 35, 10000),
    Tree = new BuildingType('tree', 'images/Tree.png', 0, 4, 0, false, 15, 1000, {
    building: function building() {
        this.rotation = (Math.random() - 0.5) * Math.PI / 16;
    },
    update: function update(delta, game) {
        if (!this.finished) this.progressBuild(2 + this.kingdom.greenHouseCount, game);
    }
}),
    FallingTree = new BuildingType('fallingTree', 'images/FallingTree.png', 0, 4, 0, false, 15, 250, {
    onFinished: function onFinished() {
        this.shouldRemove = true;
    }
});
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Job = function () {
    function Job(name, path, ext) {
        var _this = this;

        _classCallCheck(this, Job);

        this.name = name;
        Person.jobs.add(this);
        PIXI.loader.add(name, path, null, function (res) {
            return _this.init(res.texture);
        });
        Object.merge(this, ext);
    }

    _createClass(Job, [{
        key: 'init',
        value: function init(texture) {
            this.texture = new PIXI.TiledTexture(texture, 8, 12);
        }
    }]);

    return Job;
}();

var Person = function (_PIXI$AnimatedSprite) {
    _inherits(Person, _PIXI$AnimatedSprite);

    function Person(x, y, job, kingdom, island) {
        var isSummon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Person);

        var _this2 = _possibleConstructorReturn(this, (Person.__proto__ || Object.getPrototypeOf(Person)).call(this, job.texture, 10, true));

        _this2.decal = { x: 4, y: 10 };
        _this2.x = x;
        _this2.y = y;
        _this2.job = job;

        _this2.health = 100;
        _this2.sinceTookDamage = 0;
        _this2.praying = 0;
        _this2.speed = 0.25;
        _this2.target = null;
        _this2.movements = [];

        _this2.island = island;
        _this2.kingdom = kingdom;
        _this2.isSummon = isSummon;
        return _this2;
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
        key: 'update',
        value: function update(delta, game) {
            if (this.health < 100) this.health += 0.025;
            if (this.sinceTookDamage > 0) this.sinceTookDamage--;
            if (this.praying > 0) {
                this.praying--;
                this.tileX = 0;
                return;
            }

            if (this.job.update && this.job.update.apply(this, arguments)) return;

            // Movement
            var dstToTarget = 0;
            if (!this.target || this.x === this.target.x && this.y === this.target.y) {
                if (this.target) {
                    this.island.people.remove(this);
                    this.island = this.target.island;
                    this.island.people.add(this);
                }
                if (!this.movements.length) this.findNextTarget(game);
                this.speed = (Math.random() + 1) / 4 + this.kingdom.islandCount / 10;
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
            this.tint = this.sinceTookDamage > 4 ? 0xFFFFFF : this.kingdom.tint;
        }
    }, {
        key: 'findNextTarget',
        value: function findNextTarget(game) {
            if (this.job.findNextTarget && this.job.findNextTarget.call(this, game)) return;
            this.movements.push(this.island.getRandomPoint());
            var wantsToLeave = Math.random() * (game.islands.length + 10) | 0;
            if (wantsToLeave < game.islands.length) this.moveTo(game.islands, wantsToLeave);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(islands, index) {
            var dir = Math.sign(index - this.island.index);
            for (var i = this.island.index; i !== index; i += dir) {
                var prev = islands[i],
                    next = islands[i + dir];
                var bridge = dir > 0 ? prev.bridge : next.bridge;
                if (!bridge || !bridge.finished) return;
                this.movements.push({
                    x: bridge.x - dir * 90,
                    y: bridge.y + Math.random() * 20 - 15,
                    island: prev
                }, {
                    x: bridge.x + dir * 90,
                    y: bridge.y + Math.random() * 20 - 15,
                    island: next
                });
            }
        }
    }, {
        key: '_trgtIsl',
        value: function _trgtIsl(dst2, filter, island) {
            for (var i = island.people.length; i--;) {
                var p = island.people[i];
                if (p.kingdom !== this.kingdom && filter(p) && Math.dst2(this.x, this.y, p.x, p.y) < dst2) return p;
            }
            return null;
        }
    }, {
        key: 'findTarget',
        value: function findTarget(game, dst2) {
            var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
                return true;
            };

            var target = this._trgtIsl(dst2, filter, this.island);
            if (target) return target;

            var toIsland = this.x - this.island.x;
            if (toIsland > 150 && this.island.index + 1 < game.islands.length) return this._trgtIsl(dst2, filter, game.islands[this.island.index + 1]);else if (toIsland < -150 && this.island.index - 1 >= 0) return this._trgtIsl(dst2, filter, game.islands[this.island.index - 1]);
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
                    x: this.target.x, y: this.target.y,
                    island: this.target.island.index
                },
                movements: this.movements.map(function (m) {
                    return {
                        x: m.x, y: m.y,
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
        set: function set(val) {
            this._job = val;
            if (val.person) val.person.apply(this, arguments);
            this.setTiledTexture(val.texture);
        }
    }]);

    return Person;
}(PIXI.AnimatedSprite);

Person.fromState = function (s, island, game) {
    var job = Person.jobs.find(function (j) {
        return j.name === s.job;
    });
    var kingdom = game[s.kingdom];
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
var Villager = new Job('villager', 'images/Villager.png', {
    person: function person() {
        this.sinceBaby = 0;
    },
    update: function update(delta, game) {
        var _this3 = this;

        this.sinceBaby++;
        if (this.island.kingdom !== this.kingdom) return;
        this.island.buildings.filter(function (b) {
            return b.type === FallingTree && !b.finished && b.isInRadius(_this3);
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
            return b.type !== FallingTree && b.type !== Tree && !b.finished && b.isInRadius(_this4);
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
            target.kingdom = this.kingdom;
            game.addChild(new SFX(target.x, target.y, Summon));
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
});
'use strict';

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

        _this.flashes = [];
        return _this;
    }

    _createClass(Overlay, [{
        key: 'render',
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
        key: 'flash',
        value: function flash(duration) {
            this.flashes.push({ time: duration, duration: duration });
        }
    }, {
        key: 'outputState',
        value: function outputState() {
            return {
                alpha: this.alpha,
                flashes: this.flashes.slice()
            };
        }
    }, {
        key: 'z',
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

var darkSkyColor = 0x28162f,
    skyColor = 0xb2b8c0,
    goodSkyColor = 0x40c0ff,
    darkCloudColor = 0xa81c50,
    cloudColor = 0x8ca0a4,
    goodCloudColor = 0xd6f0ff,
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

        var _this2 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this2.x = state.x;
        _this2.y = state.y;
        _this2.goal = state.goal;
        _this2.onFinished = function (win) {
            Music.stop();
            onFinished(win);
        };

        _this2.bg = new PIXI.Sprite(PIXI.gradient);
        _this2.bg.alpha = 0.25;
        _this2.bg.anchor.y = 1;
        _this2.bg.z = -200;
        _this2.addChild(_this2.bg);

        // God
        _this2.god = new God();
        if (state.god) _this2.god.readState(state.god, _this2);
        _this2.addChild(_this2.god);

        // Kingdoms
        _this2.player = new Kingdom('player', 0x113996, true);
        _this2.ai = new Kingdom('ai', 0xab1705, false);
        _this2.gaia = new Kingdom('gaia', 0x888888, false);

        // Clouds a
        _this2.cloudStartBack = new PIXI.OscillatingSprite(Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        _this2.cloudStartBack.z = -101;
        _this2.cloudStartFront = new PIXI.OscillatingSprite(Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        _this2.cloudStartFront.z = -99;

        _this2.cloudEndBack = new PIXI.OscillatingSprite(Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        _this2.cloudEndBack.z = -101;
        _this2.cloudEndFront = new PIXI.OscillatingSprite(Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        _this2.cloudEndFront.z = -99;
        _this2.cloudEndBack.scale.x = _this2.cloudEndFront.scale.x = -1;

        // Islands
        _this2.islands = [];
        if (state.islands) {
            state.islands.forEach(function (s) {
                return _this2.addIsland(Island.fromState(s, _this2));
            });
            _this2.islands.forEach(function (island) {
                return island.resolveIndices(_this2);
            });
        } else _this2.generateInitial();
        _this2.updateCounts();

        // Clouds b
        _this2.cloudStartBack.x = _this2.cloudStartFront.x = _this2.islBnds.left;
        _this2.cloudEndBack.x = _this2.cloudEndFront.x = _this2.islBnds.left + _this2.islandsWidth;

        _this2.cloudStartBack.anchor.x = _this2.cloudStartFront.anchor.x = _this2.cloudEndBack.anchor.x = _this2.cloudEndFront.anchor.x = 1;
        _this2.cloudStartBack.anchor.y = _this2.cloudStartFront.anchor.y = _this2.cloudEndBack.anchor.y = _this2.cloudEndFront.anchor.y = 0.3;
        _this2.addChild(_this2.cloudStartBack, _this2.cloudStartFront, _this2.cloudEndBack, _this2.cloudEndFront);

        _this2.skiesMood = 0;
        _this2.cloudCycle = 0;
        _this2.cloudBackY = 4;
        _this2.cloudFrontY = 4;

        // Overlay
        if (state.overlay) _this2.overlay = Overlay.fromState(state.overlay, _this2);else {
            _this2.overlay = new Overlay();
            _this2.overlay.flash(60);
        }
        _this2.addChild(_this2.overlay);
        return _this2;
    }

    _createClass(Game, [{
        key: 'update',
        value: function update(delta) {
            this.updateCounts();

            for (var i = this.children.length; i--;) {
                var child = this.children[i];
                if (child.update) child.update(delta, this);
                if (child.shouldRemove) this.children.splice(i, 1);
            }
            /*this.children.forEach(child =>
                child.update && child.update(delta, this));
            this.children = this.children.filter(child => !child.shouldRemove);*/

            if (this.player.linkedTo(this, this.ai)) Music.switchTo(musics.combat);else Music.switchTo(musics.regular);
        }
    }, {
        key: 'render',
        value: function render(delta, renderer) {
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

            var min = -480;
            var max = width + 480;
            for (var i = this.children.length; i--;) {
                var child = this.children[i];
                var diff = child.x + this.x;
                child.visible = diff > min && diff < max;
                if (child.render) child.render(delta, this, renderer);
            }

            this.children.sort(Game.zSort);
            renderer.render(this);
        }
    }, {
        key: 'updateCounts',
        value: function updateCounts() {
            this.player.count(this);
            this.ai.count(this);
            this.gaia.count(this);
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
            if (this.cloudEndBack) this.cloudEndBack.x = this.cloudEndFront.x = this.islBnds.width * (this.islands.length - 1) + this.islBnds.right;
        }
    }, {
        key: 'generateInitial',
        value: function generateInitial() {
            var starting = new Island(this.islandsWidth, 0, this.player);
            starting.generateBuilding(House, true);
            starting.generatePlain();
            starting.people.add(new Person(0, 0, Villager, this.player, starting), new Person(0, 0, Villager, this.player, starting), new Person(0, 0, Warrior, this.player, starting), new Person(0, 0, Priest, this.player, starting), new Person(0, 0, Builder, this.player, starting));
            this.addIsland(starting);
        }
    }, {
        key: 'generateNewIsland',
        value: function generateNewIsland() {
            if (Math.random() < 1 / (3 + this.islands.length)) this.generateInhabited();else this.generateUninhabited();
        }
    }, {
        key: 'generateInhabited',
        value: function generateInhabited() {
            var count = Math.random() * this.islands.length;
            for (var i = 0; i < count; i++) {
                var island = new Island(this.islandsWidth, 0, this.ai);
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
                if (i + 1 < count) island.buildings.add(island.bridge = new Building(island.x + island.getLocalBounds().right, island.y, Bridge, this.ai, island, true));
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
                    return _this3.beginDown(ev.pageX, ev.pageY);
                };
                this.events.touchstart = Misc.wrap(Misc.touchToMouseEv, this.events.mousedown);

                this.events.mousemove = function (ev) {
                    return _this3.onMove(ev.pageX, ev.pageY);
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
            container.addEventListener('touchend', this.events.touchend);
            document.addEventListener('mouseup', this.events.mouseup);
            container.addEventListener('mousewheel', this.events.mousewheel);
            document.addEventListener('keydown', this.events.keydown);
            document.addEventListener('keyup', this.events.keyup);
        }
    }, {
        key: 'detachEvents',
        value: function detachEvents() {
            this.container.removeEventListener('mousedown', this.events.mousedown);
            this.container.removeEventListener('touchstart', this.events.touchstart);
            document.removeEventListener('mousemove', this.events.mousemove);
            this.container.removeEventListener('touchmove', this.events.touchmove);
            document.removeEventListener('mouseup', this.events.mouseup);
            this.container.removeEventListener('touchend', this.events.touchend);
            this.container.removeEventListener('mousewheel', this.events.mousewheel);
            document.removeEventListener('keydown', this.events.keydown);
            document.removeEventListener('keyup', this.events.keyup);
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
        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('hidden', 'title');
        this.titleTag.addEventListener('click', this.onTitle);

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('hidden', 'btns');
        settings.bind('tooltips', function (t) {
            return _this.btnsTag.classList[t ? 'add' : 'remove']('tooltips');
        });

        this.groupSelectTag = document.createElement('div');
        this.groupSelectTag.classList.add('group-select');
        this.btnsTag.appendChild(this.groupSelectTag);

        this.groupsTag = document.createElement('div');
        this.groupsTag.classList.add('groups');
        this.btnsTag.appendChild(this.groupsTag);

        this.trainGroup = this.createGroup('train');
        this.show(this.trainGroup);
        this.untrainGroup = this.createGroup('untrain');
        this.buildGroup = this.createGroup('build');
        this.doGroup = this.createGroup('do');
        this.moveGroup = this.createGroup('move');

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
                    return v() + '   ' + j();
                } : function () {
                    return j() + '   ' + v();
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
            return _this.game.player.treeCount;
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

        this.menuContainerTag = document.createElement('div');
        this.menuContainerTag.classList.add('menu-container');

        this.createMenuBtn('pause-btn').btn.onchange = function (ev) {
            return ev.target.checked ? pause() : resume();
        };
        this.createMenuBtn('menu-btn');

        this.menuTag = document.createElement('div');
        this.menuTag.classList.add('menu');

        settings.all.map(function (n) {
            return _this.createSettings(n);
        });
        this.createLink('New', 'javascript:newGame()');
        this.createLink('Save', 'javascript:save()');
        this.createLink('Restore', 'javascript:restore()');
        this.createLink('Source', 'https://github.com/Dagothig/tiny_religion.js/').link.target = 'blank';

        this.menuContainerTag.appendChild(this.menuTag);
    }

    _createClass(UI, [{
        key: 'createGroup',
        value: function createGroup(name) {
            var _this2 = this;

            var group = {};

            var radio = document.createElement('input');
            radio.id = name;
            radio.type = 'radio';
            radio.name = 'group';
            radio.classList.add('checked');
            radio.value = name;
            radio.onchange = function (ev) {
                return _this2.show(group);
            };

            this.groupSelectTag.appendChild(radio);

            var nameTag = document.createElement('label');
            nameTag.classList.add('check');
            nameTag.htmlFor = name;

            var nameContent = document.createElement('span');
            nameContent.innerHTML = name;
            nameTag.appendChild(nameContent);

            this.groupSelectTag.appendChild(nameTag);

            var children = document.createElement('div');
            children.classList.add('group', 'hidden');
            this.groupsTag.appendChild(children);

            group.radio = radio;
            group.nameTag = nameTag;
            group.nameContent = nameContent;
            group.children = children;
            return group;
        }
    }, {
        key: 'createBtn',
        value: function createBtn(parent, onclick, onupdate, name) {
            var tag = document.createElement('div');

            var btn = document.createElement('button');
            btn.classList.add('btn');

            for (var _len = arguments.length, classes = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
                classes[_key - 4] = arguments[_key];
            }

            btn.classList.add.apply(btn.classList, classes);
            btn.onclick = onclick;
            tag.appendChild(btn);

            var textTag = document.createElement('span');
            btn.appendChild(textTag);

            var tooltip = document.createElement('div');
            tooltip.innerHTML = name;
            tooltip.classList.add('tooltip');
            tag.appendChild(tooltip);

            parent.appendChild(tag);

            return {
                tag: tag,
                btn: btn,
                textTag: textTag,
                tooltip: tooltip,
                text: '',
                update: onupdate
            };
        }
    }, {
        key: 'createLink',
        value: function createLink(name, href) {
            var linkContainer = document.createElement('div');
            var link = document.createElement('a');
            link.href = href;
            link.innerHTML = name;
            linkContainer.appendChild(link);
            this.menuTag.appendChild(linkContainer);
            return {
                container: linkContainer,
                link: link
            };
        }
    }, {
        key: 'createSettings',
        value: function createSettings(name) {
            var container = document.createElement('div');

            var lbl = document.createElement('label');
            lbl.innerHTML = name;
            lbl.htmlFor = name;

            var input = settings.inputFor(name);

            container.appendChild(lbl);
            container.appendChild(input);
            this.menuTag.appendChild(container);

            return container;
        }
    }, {
        key: 'createMenuBtn',
        value: function createMenuBtn(name) {
            var btn = document.createElement('input');
            btn.name = btn.id = name;
            btn.type = 'checkbox';
            btn.classList.add('checked', name);
            this.menuContainerTag.appendChild(btn);

            var check = document.createElement('label');
            check.classList.add('check');
            check.htmlFor = name;
            this.menuContainerTag.appendChild(check);

            return { btn: btn, check: check };
        }
    }, {
        key: 'update',
        value: function update(delta, game) {
            this.game = game;
            if (game) {
                this.btns.forEach(function (btn) {
                    var text = btn.update && btn.update();
                    if (btn.text !== text) btn.text = btn.textTag.innerHTML = text;
                });
                this.btnsTag.style.backgroundColor = '#' + game.god.offTint.toString('16').padStart(6, '0');
            }
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
            var _this3 = this;

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
            setTimeout(function () {
                return _this3.titleTag.addEventListener('click', _this3.onTitle);
            }, 1000);
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
    }]);

    return UI;
}();
'use strict';

var scaling = 1;
var container = document.createElement('div');
container.id = 'container';
var ui = new UI(container, function () {
    return newGame();
});
var game = void 0;

var paused = false;
function resume() {
    paused = false;
    Music.resume();
    ui.resume();
}
function pause() {
    paused = true;
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
    });
}

var state = JSON.parse(localStorage.getItem('save'));
function save() {
    if (!game) return;
    localStorage.setItem('save', JSON.stringify(state = game.outputState()));
}
function restore() {
    state && newGame(state);
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

window.addEventListener("DOMContentLoaded", function () {
    PIXI.loader.load(function () {
        return Game.loaded = true;
    });
    // Remove the preload class from the body
    setTimeout(function () {
        return document.body.classList.remove('preload');
    }, 1000);

    // Setup container & ui
    document.body.appendChild(container);
    document.body.appendChild(ui.titleTag);
    document.body.appendChild(ui.btnsTag);
    document.body.appendChild(ui.menuContainerTag);
    ui.showTitle();

    // Setup renderer
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    var renderer = PIXI.autoDetectRenderer();
    renderer.roundPixels = true;
    container.appendChild(renderer.view);

    // Setup resize hook
    var resize = function resize() {
        var w = container.clientWidth,
            h = container.clientHeight;
        if (!h) return;
        scaling = 1;
        if (h < 420) {
            w *= 420 / h;
            h = 420;
            scaling++;
        }
        renderer.resize(w, h);
    };
    window.addEventListener('resize', resize);
    resize();
    settings.bind('tooltips', resize);

    Game.onLoad(function () {
        // Setup event loop
        var last = performance.now();
        var upd = function upd() {
            var time = performance.now();
            var delta = time - last;

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
});