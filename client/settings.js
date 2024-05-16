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
let settings = ((strat, confs) => Object.keys(confs).reduce((settings, key) => {
    var conf = confs[key];
    if (!conf) {
        return settings;
    }

    settings.all.push(key);
    settings[conf[2]].push(key);

    var _key = '_' + key;
    var _keyConf = _key + 'Conf';
    var _keyCBs = _key + 'CBs';

    settings[_key] = strat.read(key, conf);
    settings[_keyConf] = conf;
    settings[_keyCBs] = [];

    Object.defineProperty(settings, key, {
        get() { return this[_key]; },
        set(val) {
            this[_key] = strat.write(key, conf, val);
            this[_keyCBs].forEach(cb => cb(val));
        }
    });

    return settings;
}, {
    all: [],
    usr: [],
    sys: [],
    bind: function(key, cb) {
        this['_' + key + 'CBs'].push(cb);
        cb(this[key]);
    },
    _clear: function(key) {
        this[key] = this['_' + key + 'Conf'][0];
        this[`_${key}CBs`].forEach(cb => cb(this[key]));
    },
    clear: function() {
        if (arguments.length)
            Array.from(arguments).forEach(key => this._clear(key));
        else this.all.forEach(key => this._clear(key))
    },
    _index: function(name, conf) { // Fuzzy search
        return Object.values(conf[3]).findIndex(e => e.value == settings[name]);
    },
    _inputFor: {
        str: name => dom('input', { type: 'text', value: settings[name] }),
        num: name => dom('input', { type: 'numeric', value: settings[name] }),
        bool: name => dom('input', { type: 'checkbox', checked: settings[name] }),
        choice: (name, conf) => dom('select',
            { selectedIndex: settings._index(name, conf) },
            Object.entries(conf[3]).map(x => dom('option', { value: x[1] },
                () => strs.choices[name] && strs.choices[name][x[0]] || x[0])))
    },
    inputFor: function(name) {
        let conf = this['_' + name + 'Conf'];
        let input = this._inputFor[conf[1]](name, conf);
        input.id = input.name = name;
        input.onchange = conf[1] === 'bool' ?
            () => this[name] = input.checked :
            () => this[name] = input.value;
        this.bind(name, t => input.value = input.checked = t);
        return input;
    }
}))(/* local storage strat */{
    str: { toStr: str => (str + ''), fromStr: str => str },
    num: { toStr: num => (num + ''), fromStr: str => new Number(str).valueOf() },
    bool: { toStr: val => val ? 'true' : 'false', fromStr: str => str === 'true' },
    choice: {
        toStr: (val, conf) => // Fuzzy equality
            Object.entries(conf[3]).find(entry => entry[1] == val)[0],
        fromStr: (str, conf) =>
            Object.entries(conf[3]).find(entry => entry[0] === str)[1]
    },

    read: function(key, conf) {
        var stored = localStorage.getItem(key);
        return stored !== null ?
            this[conf[1] || 'str'].fromStr(stored, conf) :
            conf[0];
    },
    write: function(key, conf, value) {
        localStorage.setItem(key, this[conf[1] || 'str'].toStr(value, conf));
        return value;
    }
}, {
    tips: [true, 'bool', 'usr'],
    tooltips: [true, 'bool', 'usr'],
    pauseOnFocusLoss: [true, 'bool', 'usr'],
    music: [true, 'bool', 'usr'],
    sound: [true, 'bool', 'usr'],
    goal: [12000, 'choice', 'sys', {
        tiny: 3000,
        short: 6000,
        medium: 12000,
        long: 24000
    }],
    fps: [false, 'bool', 'usr'],
    fullscreen: window.app && window.app.setFullscreen && [true, 'bool', 'usr'],
    lang: (!window.app || !window.app.language) && ["en", "choice", "usr", Object
        .keys(translatedStrs)
        .toObject(lang => [translatedStrs[lang].language, lang])],
});

if (window.app && window.app.setFullscreen) {
    settings.bind("fullscreen", fs => window.app.setFullscreen(fs));
}

if (!window.app || !window.app.language) {
    settings.bind("lang", lang => {
        strs = (translatedStrs[lang] || translatedStrs.en);
        for (const entry of translatedNodes) {
            const el = entry[0];
            const children = entry[1];
            el.replaceChildren.apply(el, children.flatMap(getChildren));
        }
    });
}
