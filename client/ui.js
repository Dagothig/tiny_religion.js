'use strict';

class UI {
    constructor() {
        this.tag = document.createElement('div');
        this.tag.classList.add('ui');
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
                'btn', 'summon')
        ]);
        this.btns.forEach(btn => this.tag.appendChild(btn));
    }
    createBtn(onclick, ...classes) {
        let btn = document.createElement('a');
        btn.href = '#';
        btn.classList.add.apply(btn.classList, classes);
        btn.onclick = onclick;
        return btn;
    }
}