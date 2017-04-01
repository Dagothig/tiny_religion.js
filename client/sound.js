'use strict';

let fetchSound = (src) => {
    let el = document.createElement('audio');
    el.src = src;
    el.volume = 1;
    return el;
}

class Sound {
    constructor(...paths) {
        this.paths = paths;
        this.sounds = paths.map(p => {
            let snd = fetchSound(p);
            let self = this;
            snd.onended = function() { self.available.add(this); };
            return snd;
        });
        this.available = this.sounds.map(s => [s]);
    }
    play(onended, volume = 1) {
        if (Sound.mute) return;
        let i = this.sounds.rand_i();
        let sound = this.available[i].pop();
        if (!sound) {
            let base = this.sounds[i];
            sound = base.cloneNode();
            sound.onended = base.onended;
        }
        if (onended) {
            let handler = () => {
                onended();
                sound.removeEventListener('ended', handler);
            }
            sound.addEventListener('ended', handler);
        }
        sound.volume = volume;
        sound.play();
    }
}
Sound.mute = false;
let sounds = {
    titleScreen: new Sound('sounds/TitleScreen.wav'),

    build: new Sound('sounds/Build.wav'),
    done: new Sound('sounds/Done.wav'),

    builderTrain: new Sound('sounds/BuilderTrain.wav'),
    warriorTrain: new Sound('sounds/WarriorTrain.wav'),
    priestTrain: new Sound('sounds/PriestTrain.wav'),
    untrain: new Sound('sounds/VillagerTrain.wav'),

    baby: new Sound('sounds/DoBabies.wav'),
    summon: new Sound('sounds/Summon.wav'),
    pray: new Sound('sounds/Pray.wav'),

    hit: new Sound('sounds/Hit1.wav', 'sounds/Hit2.wav', 'sounds/Hit3.wav'),
    convert: new Sound('sounds/Convert.wav'),
    death: new Sound('sounds/Death.wav'),
    lightning: new Sound('sounds/Lightning.wav'),

    islandLose: new Sound('sounds/IslandLose.wav'),
    islandWin: new Sound('sounds/IslandWin.wav'),

    angry: new Sound('sounds/Angry.wav'),
    happy: new Sound('sounds/Happy.wav'),

    new: new Sound('sounds/New.wav'),
    loss: new Sound('sounds/Loss.wav'),
    win: new Sound('sounds/Win.wav')
};

let Music = {
    play: true,
    music: null,
    switchTo(music) {
        if (music === this.music) return;
        if (this.music) this.music.pause();
        this.music = music;
        this.music.currentTime = 0;
        if (this.play) music.play();
    },
    toggle(play) {
        this.play = play;
        if (this.play) this.music.play();
        else this.music.pause();
    },
    stop() {
        if (!this.music) return;
        this.music.pause();
        this.music = null;
    }
}