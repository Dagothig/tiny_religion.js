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
    _labelFor: {
        num(name, conf) {
            return dom("label",
            {
                htmlFor: name,
                click: () => document.querySelector("#" + name).dispatchEvent(new CustomEvent("step"))
            },
            () => strs.menu[name]);
        }
    },
    _inputFor: {
        str: name => dom('input', { type: 'text', value: settings[name] }),
        num: (name, conf) => {
            const c = conf[3];
            let input;
            const node = [
                dom('input', {
                    type: 'range',
                    min: c.min,
                    max: c.max,
                    step: c.step,
                    value: settings[name],
                    step() {
                        settings[name] = (settings[name] + c.step) % (c.max + c.step);
                    }
                }),
                input = dom('span', { class: 'range__indicator' })];
            settings.bind(name, value => {
                const partial = ((value - c.min) % c.step);
                const roundedValue = value - partial + (partial < c.step / 2 ? 0 : c.step);
                if (roundedValue !== value) {
                    settings[name] = roundedValue;
                    return;
                }
                input.style.setProperty("--range_percent", (value - c.min) / (c.max - c.min));
                input.classList[value ? "remove" : "add"]("range__indicator--zero");
            });
            return node;
        },
        bool: name => [
            dom('input', { type: 'checkbox', checked: settings[name] }),
            dom('span', { class: 'checkbox__indicator' })],
        choice: (name, conf) => dom('select',
            { selectedIndex: settings._index(name, conf) },
            Object.entries(conf[3]).map(x => dom('option', { value: x[1] },
                () => strs.choices[name] && strs.choices[name][x[0]] || x[0])))
    },
    labelFor(name) {
        const conf = this['_' + name + 'Conf'];
        const labelFor = this._labelFor[conf[1]];
        const label = labelFor ?
            labelFor(name, conf) :
            dom('label', { htmlFor: name }, () => strs.menu[name]);
        return label;
    },
    inputFor: function(name) {
        const conf = this['_' + name + 'Conf'];
        const node = this._inputFor[conf[1]](name, conf);
        const input = node.$one("input,select")
        input.id = input.name = name;
        input.onchange = conf[1] === 'bool' ?
            () => this[name] = input.checked :
            () => this[name] = input.value;
        this.bind(name, t => input.value = input.checked = t);
        return node;
    }
}))(/* local storage strat */{
    str: { toStr: str => (str + ''), fromStr: str => str },
    num: {
        toStr: num => (num + ''),
        fromStr: (str, conf) => {
            const value = Math.bounded(new Number(str).valueOf(), conf[3].min, conf[3].max);
            return isNaN(value) ? conf[3].default : value;
        }
    },
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
    notifications: [true, 'bool', 'usr'],
    pauseOnFocusLoss: [true, 'bool', 'usr'],
    music: [true, 'num', 'usr', { min: 0, max: 100, default: 100, step: 20 }],
    sound: [true, 'num', 'usr', { min: 0, max: 100, default: 100, step: 20 }],
    goal: [12000, 'choice', 'sys', {
        tiny: 3000,
        short: 6000,
        medium: 12000,
        long: 24000
    }],
    fps: [false, 'bool', 'usr'],
    fullscreen: window.app.setFullscreen && [true, 'bool', 'usr'],
    lang: [defaultLanguage, "choice", "usr", languages.toObject(lang => [translatedStrs[lang].language, lang])],
});

if (window.app.setFullscreen) {
    settings.bind("fullscreen", fs => window.app.setFullscreen(fs));
}

settings.bind("lang", lang => {
    strs = (translatedStrs[lang] || translatedStrs.en);
    for (const entry of translatedNodes) {
        const el = entry[0];
        const children = entry[1];
        el.replaceChildren.apply(el, children.flatMap(getChildren));
    }
});
