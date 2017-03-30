'use strict';

let twelthRootOf2 = Math.pow(2, 1/12);
let tonalShiftTable = [];
let tonalShiftRate = shift =>
    (tonalShiftTable[shift] !== undefined && tonalShiftTable[shift]) ||
    (tonalShiftTable[shift] = Math.pow(twelthRootOf2, shift));

let NOTE = { DO: 0, RE: 2, MI: 4, FA: 5, SOL: 7, LA: 9, SI: 11 };
let MOD = { FLAT: -1, NORMAL: 0, SHARP: 1 };
function MusicSound(octavePaths) {
    this._paths = octavePaths;
    this._octaves = new Array(octavePaths.length).fill().map(() => []);
    this._bases = octavePaths.map(path => fetchSound(path));
    this._onPlayed = this._octaves.map(arr => function() { arr.push(this); });
}
MusicSound.prototype = {
    constructor: MusicSound,
    play: function(octave = 0, note = NOTE.DO, noteMod = MOD.NORMAL) {
        let snd = this._octaves[octave].pop() || this._bases[octave].cloneNode();
        snd.mozPreservesPitch =
        snd.webkitPreservesPitched =
        snd.preservesPitch = false;
        snd.playbackRate = tonalShiftRate(note + noteMod);
        snd.onended = this._onPlayed[octave];
        snd.play();
    }
}
let snd1 = new MusicSound(new Array(5).fill().map((_, i) =>
    './sounds/NoteType1_' + i + '.wav'));

//[snd1, NOTE.DO, MOD, 2]

function MusicSheet(timeUnit, notes) {
    this.timeUnit = timeUnit;
    this.notes = Object.entries(notes).reduce((n, entry) =>
        (n[entry[0]] = entry[1]) && n, []);
}
Array._empty = [];
function Music(sheet, bpm) {
    this.sheet = sheet;
    this.bpm = bpm;
    this.time = 0;
    this.toBurn = 0;
    this.duration = sheet.length;
    this.playing = false;
}
Music.prototype = {
    constructor: Music,

    get bpm() { return this._bpm; },
    set bpm(val) {
        this._bpm = val;
        this.subdivisionLength = (60 * 1000) * this.sheet.timeUnit / val;
    },

    get time() { return this._time; },
    set time(val) { this._time = val % this.sheet.notes.length; },

    start: function() {
        this.time = this.toBurn = 0;
        this.playing = true;
        let last = performance.now(), upd;
        (upd = () => {
            if (!this.playing) return;
            let time = performance.now();
            this.update(time - last);
            last = time;
            requestAnimationFrame(upd);
        })();
    },
    stop: function() {
        this.playing = false;
    },
    update: function update(delta) {
        let toBurn = this.toBurn + delta;
        while (toBurn > this.subdivisionLength) {
            toBurn -= this.subdivisionLength;
            (this.sheet.notes[this.time|0] || Array._empty).forEach(note =>
                note[0].play(note[1], note[2], note[3]));
            this.time++;
        }
        this.toBurn = toBurn;
    }
}