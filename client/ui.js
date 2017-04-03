'use strict';

class UI {
    constructor(onnewGame) {
        this.onnewGame = onnewGame;

        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('title', 'hidden');
        PIXI.loader.load(() => this.titleTag.onclick = () => this.startGame());

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('btns', 'hidden');
        if (settings.tooltips) ;
        settings.bind('tooltips', t =>
            this.btnsTag.classList[t ? 'add' : 'remove']('tooltips'))
        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            Person.jobs.reduce((btns, job) => {
                if (job === Villager) return btns;
                let v = () => this.game.player.villagerCount;
                let j = () => this.game.player[job.name + 'Count'];
                btns.add(this.createBtn(
                    () => this.game && this.game.player[act](this.game, job),
                    act === 'train' ?
                        () => this.game && (v() + '   ' + j()) :
                        () => this.game && (j() + '   ' + v()),
                    act[0] + '.' + job.name, act, job.name)
                );
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
            .reduce((btns, type) => {
                btns.add(this.createBtn(
                    () => this.game && this.game.player.build(this.game, type),
                    () => this.game && this.game.player[type.name + 'Count'],
                    type.name, 'build', type.name
                ));
                return btns;
            }, []))
        .concat([
            this.createBtn(
                () => this.game && this.game.player.buildBridge(this.game),
                null, 'bridge', 'build', 'bridge'),
            this.createBtn(
                () => this.game && this.game.player.forestate(this.game),
                () => this.game && this.game.player.treeCount,
                'forestate', 'forestate'),
            this.createBtn(
                () => this.game && this.game.player.deforest(this.game),
                null, 'deforest', 'deforest'),
            this.createBtn(
                () => this.game && this.game.god.doSacrifice(this.game),
                null, 'sacrifice', 'sacrifice'),
            this.createBtn(
                () => this.game && this.game.player.doBaby(this.game),
                () => (game.player.peopleCount + '/' + game.player.maxPop),
                'baby', 'baby'),
            this.createBtn(
                () => this.game && this.game.player.attemptSummon(this.game),
                () => (game.player.summonCount + '/' + game.player.maxSummon),
                'summon', 'summon'),
            this.createBtn(
                () => this.game && this.game.player.pray(this.game),
                null, 'pray', 'pray'),
            this.createBtn(
                () => this.game && this.game.player.sendAttack(this.game),
                null, 'attack', 'attack'),
            this.createBtn(
                () => this.game && this.game.player.sendConvert(this.game),
                null, 'convert', 'convert'),
            this.createBtn(
                () => this.game && this.game.player.sendRetreat(this.game),
                null, 'retreat', 'retreat')
        ]);

        this.settingsTag = document.createElement('div');
        this.settingsTag.classList.add('settings');
        let sourceLink = document.createElement('a');
        sourceLink.href = 'https://github.com/Dagothig/tiny_religion.js/';
        sourceLink.target = 'blank';
        sourceLink.innerHTML = 'SOURCE';
        this.settingsTag.appendChild(sourceLink);
        this.settings = settings.all.map(n => this.createSettings(n));

        document.body.appendChild(this.titleTag);
        document.body.appendChild(this.btnsTag);
        document.body.appendChild(this.settingsTag);
    }
    createBtn(onclick, onupdate, name, ...classes) {
        let tag = document.createElement('div');

        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add.apply(btn.classList, classes);
        btn.onclick = onclick;
        tag.appendChild(btn);

        let tooltip = document.createElement('div');
        tooltip.innerHTML = name;
        tooltip.classList.add('tooltip');
        tag.appendChild(tooltip);

        this.btnsTag.appendChild(tag);

        return {
            tag: tag,
            btn: btn,
            tooltip: tooltip,
            text: '',
            update: onupdate
        };
    }
    createSettings(name) {
        let setting = document.createElement('div');

        let lbl = document.createElement('label');
        lbl.innerHTML = name;

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = name;
        input.checked = settings[name];
        input.onchange = ev => ev.target.checked !== settings[name] &&
            (settings[name] = ev.target.checked);

        setting.appendChild(lbl);
        lbl.appendChild(input);
        this.settingsTag.appendChild(setting);

        return setting;
    }
    update(delta, game) {
        this.game = game;
        if (game) this.btns.forEach(btn => {
            let text = btn.update && btn.update(delta, game);
            if (btn.text !== text) btn.text = btn.btn.innerHTML = text;
        });
    }
    showTitle(win = null) {
        game = null;
        this.titleTag.classList.remove('hidden');
        this.titleTag.classList.remove('win', 'lost');
        Music.stop();
        if (win !== null) {
            if (win) {
                sounds.win.play();
                this.titleTag.classList.add('win');
            } else {
                sounds.loss.play();
                this.titleTag.classList.add('lost');
            }
        } else sounds.titleScreen.play();
        this.btnsTag.classList.add('hidden');
    }
    startGame() {
        this.onnewGame(new Game(win => this.showTitle(win)));
        this.titleTag.classList.add('hidden');
        this.btnsTag.classList.remove('hidden');
    }
}