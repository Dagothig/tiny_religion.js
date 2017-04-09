'use strict';

class UI {
    constructor(gameContainer, onTitle) {
        this.gameContainer = gameContainer;
        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('title');
        this.titleTag.onclick = onTitle;

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('btns');
        settings.bind('tooltips', t =>
            this.btnsTag.classList[t ? 'add' : 'remove']('tooltips'));
        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            [Builder, Warrior, Priest].reduce((btns, job) => {
                let v = () => this.game.player.villagerCount;
                let j = () => this.game.player[job.name + 'Count'];
                btns.add(this.createBtn(
                    () => this.game.player[act](this.game, job),
                    act === 'train' ?
                        () => v() + '   ' + j() :
                        () => j() + '   ' + v(),
                    act[0] + '.' + job.name, act, job.name));
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
            .reduce((btns, type) => {
                btns.add(this.createBtn(
                    () => this.game.player.build(this.game, type),
                    () => this.game.player[type.name + 'Count'],
                    type.name, 'build', type.name));
                return btns;
            }, []))
        .concat([
            this.createBtn(
                () => this.game.player.buildBridge(this.game),
                null,
                'bridge', 'build', 'bridge'),
            this.createBtn(
                () => this.game.player.forestate(this.game),
                () => this.game.player.treeCount,
                'forestate', 'forestate'),
            this.createBtn(
                () => this.game.player.deforest(this.game),
                null,
                'deforest', 'deforest'),
            this.createBtn(
                () => this.game.god.doSacrifice(this.game),
                null,
                'sacrifice', 'sacrifice'),
            this.createBtn(
                () => this.game.player.doBaby(this.game),
                () => this.game.player.peopleCount + '/'
                    + this.game.player.maxPop,
                'baby', 'baby'),
            this.createBtn(
                () => this.game.player.attemptSummon(this.game),
                () => this.game.player.summonCount + '/'
                    + this.game.player.maxSummon,
                'summon', 'summon'),
            this.createBtn(
                () => this.game.player.pray(this.game),
                null,
                'pray', 'pray'),
            this.createBtn(
                () => this.game.player.sendAttack(this.game),
                null,
                'attack', 'attack'),
            this.createBtn(
                () => this.game.player.sendConvert(this.game),
                null,
                'convert', 'convert'),
            this.createBtn(
                () => this.game.player.sendRetreat(this.game),
                null,
                'retreat', 'retreat')
        ]);

        this.menuContainerTag = document.createElement('div');
        this.menuContainerTag.classList.add('menu-container');

        this.menuBtn = document.createElement('input');
        this.menuBtn.name = this.menuBtn.id = 'menu-btn';
        this.menuBtn.type = 'checkbox';
        this.menuBtn.classList.add('menu-btn');
        this.menuContainerTag.appendChild(this.menuBtn);

        this.menuBtnCheck = document.createElement('label');
        this.menuBtnCheck.classList.add('check');
        this.menuBtnCheck.htmlFor = 'menu-btn';
        this.menuContainerTag.appendChild(this.menuBtnCheck);

        this.menuTag = document.createElement('div');
        this.menuTag.classList.add('menu');

        this.settings = settings.all.map(n => this.createSettings(n));

        this.createLink('Save', 'javascript:save()');
        this.createLink('Restore', 'javascript:restore()');
        this.createLink('Source', 'https://github.com/Dagothig/tiny_religion.js/')
            .link.target = 'blank';

        this.menuContainerTag.appendChild(this.menuTag);

        document.body.appendChild(this.titleTag);
        document.body.appendChild(this.btnsTag);
        document.body.appendChild(this.menuContainerTag);
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
    createLink(name, href) {
        let linkContainer = document.createElement('div');
        let link = document.createElement('a');
        link.href = href;
        link.innerHTML = name;
        linkContainer.appendChild(link);
        this.menuTag.appendChild(linkContainer);
        return {
            container: linkContainer,
            link: link
        };
    }
    createSettings(name) {
        let setting = document.createElement('div');

        let lbl = document.createElement('label');
        lbl.innerHTML = name;
        lbl.htmlFor = name;

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.id = name;
        input.name = name;
        input.checked = settings[name];
        input.onchange = ev => ev.target.checked !== settings[name] &&
            (settings[name] = ev.target.checked);

        setting.appendChild(lbl);
        setting.appendChild(input);
        this.menuTag.appendChild(setting);

        return setting;
    }
    update(delta, game) {
        this.game = game;
        if (game) {
            this.btns.forEach(btn => {
                let text = btn.update && btn.update();
                if (btn.text !== text) btn.text = btn.btn.innerHTML = text;
            });
            this.btnsTag.style.backgroundColor =
                '#' + game.god.offTint.toString('16').padStart(6, '0');
        }
    }
    showTitle(win = null) {
        this.titleTag.classList.remove('hidden', 'win', 'lost');
        this.btnsTag.classList.add('hidden');
        this.gameContainer.classList.add('hidden');
        if (win !== null) {
            if (win) {
                sounds.win.play();
                this.titleTag.classList.add('win');
            } else {
                sounds.loss.play();
                this.titleTag.classList.add('lost');
            }
        } else sounds.titleScreen.play();
    }
    hideTitle() {
        this.titleTag.classList.add('hidden');
        this.btnsTag.classList.remove('hidden');
        this.gameContainer.classList.remove('hidden');
    }
}