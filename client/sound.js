'use strict';

let fetchSound = (src) => {
    let el = document.createElement('audio');
    el.src = src;
    el.volume = 1;
    return el;
}

class Sound {
    constructor(paths, maxCount = 5, baseVolume = 1) {
        paths = !Array.isArray(paths) ? [paths] : paths;
        this.maxCount = maxCount;
        this.paths = paths;
        this.sounds = paths.map((p, i) => {
            let snd = fetchSound(p);
            let self = this;
            snd.onended = function() { self.available[i].add(this); };
            return snd;
        });
        this.available = this.sounds.map(s => Object.merge([s], { total: 1 }));
        this.baseVolume = baseVolume;
    }
    play(onended, volume = 1) {
        volume *= this.baseVolume * Sound.volume;
        if (!Sound.volume) return;
        let i = this.sounds.rand_i();
        let sound = this.available[i].pop();
        if (!sound && this.available[i].total < this.maxCount) {
            let base = this.sounds[i];
            sound = base.cloneNode();
            sound.onended = base.onended;
            this.available[i].total++;
        }
        if (!sound) return;
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
settings.bind('sound', v => Sound.volume = v / 100);
let sounds = {
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

    hit: new Sound(['sounds/Hit1.mp3', 'sounds/Hit2.mp3', 'sounds/Hit3.mp3']),
    convert: new Sound('sounds/Convert.mp3'),
    death: new Sound('sounds/Death.mp3'),
    lightning: new Sound('sounds/Lightning.mp3'),

    islandLose: new Sound('sounds/IslandLose.mp3'),
    islandWin: new Sound('sounds/IslandWin.mp3'),

    end: new Sound(('sounds/End.mp3')),
    angry: new Sound('sounds/Angry.mp3'),
    happy: new Sound('sounds/Happy.mp3'),

    new: new Sound('sounds/New.mp3'),
    loss: new Sound('sounds/Loss.mp3'),
    win: new Sound('sounds/Win.mp3'),

    beep1: new Sound("sounds/Beep1.mp3"),
    beep2: new Sound("sounds/Beep2.mp3", 10),
    beep3: new Sound("sounds/Beep3.mp3"),
    beep4: new Sound("sounds/Beep4.mp3", 10, 0.5),
};

let Music = {
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
        if (this.music && !this.paused) {
            if (this.play) this.music.play();
            else this.music.pause();
        }
    },
    setVolume(volume) {
        volume /= 100;
        this.music && (this.music.volume = volume);
        this.toggle(!!volume);
    },
    stop() {
        if (!this.music) return;
        this.music.pause();
        this.music = null;
    },
    resume() {
        this.paused = false;
        if (!this.music || !this.play) return;
        this.music.play();
    },
    pause() {
        this.paused = true;
        if (!this.music) return;
        this.music.pause();
    }
}
settings.bind('music', v => Music.setVolume(v));
let musics = {
    regular: fetchSound('sounds/Music1.ogg'),
    combat: fetchSound('sounds/Music2.ogg')
};
Object.keys(musics)
    .map(k => musics[k])
    .forEach(m => { m.volume = 0.5; m.loop = true; });
