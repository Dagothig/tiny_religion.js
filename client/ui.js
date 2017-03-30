'use strict';

class UI {
    constructor(onnewGame) {
        this.onnewGame = onnewGame;

        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('title', 'hidden');
        PIXI.loader.load(() => this.titleTag.onclick = () => {
            onnewGame(new Game(win => this.showTitle(win)));
            this.titleTag.classList.add('hidden');
            this.statsTag.classList.remove('hidden');
            this.btnsTag.classList.remove('hidden');
        });

        this.statsTag = document.createElement('div');
        this.statsTag.classList.add('stats', 'hidden');
        this.stats = [
            this.createStat('PEOPLE', (delta, game) =>
                game.player.peopleCount + '/' + game.player.maxPop),
            this.createStat('SUMMONS', (delta, game) =>
                game.player.summonCount + '/' + game.player.maxSummon),
            this.createStat('PROJECTS', (delta, game) =>
                game.player.unfinished + '/' + game.player.maxUnfinished),
            this.createStat('BARRACKS', (delta, game) =>
                game.player.barracksCount),
            this.createStat('TEMPLES', (delta, game) =>
                game.player.templeCount),
            this.createStat('WORKSHOPS', (delta, game) =>
                game.player.workshopCount),
            this.createStat('GREENHOUSES', (delta, game) =>
                game.player.greenHouseCount)
        ];

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('btns', 'hidden');
        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            Person.jobs.reduce((btns, job) => {
                if (job === Villager) return btns;
                btns.add(this.createBtn(
                    () => this.game && this.game.player[act](this.game, job),
                    'btn', act, job.name)
                );
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
        .reduce((btns, type) => {
            btns.add(this.createBtn(
                () => this.game && this.game.player.build(this.game, type),
                'btn', 'build', type.name
            ));
            return btns;
        }, [])).concat([
            this.createBtn(
                () => this.game && this.game.player.buildBridge(this.game),
                'btn', 'build', 'bridge'),
            this.createBtn(
                () => this.game && this.game.player.forestate(this.game),
                'btn', 'forestate'),
            this.createBtn(
                () => this.game && this.game.player.deforest(this.game),
                'btn', 'deforest'),
            this.createBtn(
                () => this.game && this.game.god.doSacrifice(this.game),
                'btn', 'sacrifice'),
            this.createBtn(
                () => this.game && this.game.player.doBaby(this.game),
                'btn', 'baby'),
            this.createBtn(
                () => this.game && this.game.player.attemptSummon(this.game),
                'btn', 'summon'),
            this.createBtn(
                () => this.game && this.game.player.pray(this.game),
                'btn', 'pray'),
            this.createBtn(
                () => this.game && this.game.player.sendAttack(this.game),
                'btn', 'attack'),
            this.createBtn(
                () => this.game && this.game.player.sendConvert(this.game),
                'btn', 'convert'),
            this.createBtn(
                () => this.game && this.game.player.sendRetreat(this.game),
                'btn', 'retreat')
        ]);

        this.settingsTag = document.createElement('div');
        this.settingsTag.classList.add('settings');
        this.settings = [
            this.createSettings('MUSIC', ev => ev.target.checked ?
                music.play() : music.pause()),
            this.createSettings('SOUND', ev => Sound.mute = ev.target.checked),
        ];

        document.body.appendChild(this.titleTag);
        document.body.appendChild(this.btnsTag);
        document.body.appendChild(this.statsTag);
        document.body.appendChild(this.settingsTag);
    }
    createBtn(onclick, ...classes) {
        let btn = document.createElement('a');
        btn.href = '#';
        btn.classList.add.apply(btn.classList, classes);
        btn.onclick = onclick;
        this.btnsTag.appendChild(btn);
        return btn;
    }
    createStat(name, onupdate, ...classes) {
        let stat = document.createElement('div');
        stat.classList.add.apply(stat.classList, classes);
        let lbl = document.createElement('label');
        lbl.innerHTML = name;
        stat.appendChild(lbl);
        let txt = document.createElement('span');
        stat.appendChild(txt);
        this.statsTag.appendChild(stat);
        return {
            tag: stat,
            label: lbl,
            span: txt,
            update: onupdate
        };
    }
    createSettings(name, onchange, ...classes) {
        let setting = document.createElement('div');
        setting.classList.add.apply(setting.classList, classes);

        let lbl = document.createElement('label');
        lbl.innerHTML = name;

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = name;
        input.onchange = onchange;

        setting.appendChild(lbl);
        lbl.appendChild(input);
        this.settingsTag.appendChild(setting);

        return setting;
    }
    update(delta, game) {
        this.game = game;
        if (game)
            this.stats.forEach(stat =>
                stat.span.innerHTML = stat.update(delta, game));
    }
    showTitle(win = null) {
        game = null;
        this.titleTag.classList.remove('hidden');
        this.titleTag.classList.remove('win', 'lost');
        if (win !== null) this.titleTag.classList.add(win ? 'win' : 'lost');
        else sounds.titleScreen.play();
        this.btnsTag.classList.add('hidden');
        this.statsTag.classList.add('hidden');
    }
}