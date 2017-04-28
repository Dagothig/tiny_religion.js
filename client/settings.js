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
    settings.all.push(key);

    var conf = confs[key];

    var _key = '_' + key;
    var _keyConf = _key + 'Conf';
    var _keyCBs = _key + 'CBs';

    settings[_key] = strat.read(key, conf);
    settings[_keyConf] = conf;
    settings[_keyCBs] = [];

    Object.defineProperty(settings, key, {
        get: function() {
            return this[_key];
        },
        set: function(val) {
            this[_key] = strat.write(key, conf, val);
            this[_keyCBs].forEach(cb => cb(val));
        }
    });

    return settings;
}, {
    all: [],
    bind: function(key, cb) {
        this['_' + key + 'CBs'].push(cb);
        cb(this[key]);
    },
    _clear: function(key) { this[key] = this['_' + key + 'Conf'][0]; },
    clear: function() {
        if (arguments.length)
            Array.from(arguments).forEach(key => this._clear(key));
        else this.all.forEach(key => this._clear(key))
    },
    inputFor: function(name) {
        let conf = this['_' + name + 'Conf'];
        let input;
        let onchange = () => this[name] = input.value;
        switch(conf[1]) {
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
                onchange = () => this[name] = input.checked;
                break;
            case 'choice':
                input = document.createElement('select');
                input.selectedIndex =
                Object.entries(conf[3]).map(opt => {
                    let entry = document.createElement('option');
                    entry.innerHTML = opt[0];
                    entry.value = opt[1];
                    input.appendChild(entry);
                    return entry;
                }) // Fuzzy equality
                .findIndex(e => e.value == this[name]);
                break;
        }
        input.id = input.name = name;
        input.onchange = onchange;
        return input;
    }
}))({
    str: {
        toStr: str => (str + ''),
        fromStr: str => str
    },
    num: {
        toStr: num => (num + ''),
        fromStr: str => new Number(str).valueOf()
    },
    bool: {
        toStr: val => val ? 'true' : 'false',
        fromStr: str => str === 'true',
    },
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
    music: [true, 'bool', 'usr'],
    sound: [true, 'bool', 'usr'],
    goal: [12000, 'choice', 'usr', {
        tiny: 3000,
        short: 6000,
        medium: 12000,
        long: 24000
    }],
});