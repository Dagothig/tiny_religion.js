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
    strEx: ['', 'str', 'usr']
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

    read: function(key, conf) {
        var stored = localStorage.getItem(key);
        return stored !== null ?
            this[conf[1] || 'str'].fromStr(stored) :
            conf[0];
    },
    write: function(key, conf, value) {
        localStorage.setItem(key, this[conf[1] || 'str'].toStr(value));
        return value;
    }
}, {
   tooltips: [true, 'bool', 'usr'],
   music: [true, 'bool', 'usr'],
   sound: [true, 'bool', 'usr'],
});