'use strict';

class UI {
    constructor(gameContainer, onTitle) {
        this.gameContainer = gameContainer;
        this.gameContainer.classList.add('hidden');
        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('hidden', 'title');
        this.titleTag.onclick = onTitle;

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('hidden', 'btns');
        settings.bind('tooltips', t =>
            this.btnsTag.classList[t ? 'add' : 'remove']('tooltips'));

        this.trainTag = this.createGroup(this.btnsTag, 'train');
        this.untrainTag = this.createGroup(this.btnsTag, 'untrain');
        this.buildTag = this.createGroup(this.btnsTag, 'build');
        this.doTag = this.createGroup(this.btnsTag, 'do');
        this.moveTag = this.createGroup(this.btnsTag, 'move');

        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            [Builder, Warrior, Priest].reduce((btns, job) => {
                let v = () => this.game.player.villagerCount;
                let j = () => this.game.player[job.name + 'Count'];
                btns.add(this.createBtn(this[act + 'Tag'].children,
                    () => this.game.player[act](this.game, job),
                    act === 'train' ?
                        () => v() + '   ' + j() :
                        () => j() + '   ' + v(),
                    job.name, act, job.name));
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
            .reduce((btns, type) => {
                btns.add(this.createBtn(this.buildTag.children,
                    () => this.game.player.build(this.game, type),
                    () => this.game.player[type.name + 'Count'],
                    type.name, 'build', type.name));
                return btns;
            }, []))
        .concat([
            this.createBtn(this.buildTag.children,
                () => this.game.player.buildBridge(this.game),
                null,
                'bridge', 'build', 'bridge'),
            this.createBtn(this.doTag.children,
                () => this.game.player.forestate(this.game),
                () => this.game.player.treeCount,
                'forestate', 'forestate'),
            this.createBtn(this.doTag.children,
                () => this.game.player.deforest(this.game),
                null,
                'deforest', 'deforest'),
            this.createBtn(this.doTag.children,
                () => this.game.god.doSacrifice(this.game),
                null,
                'sacrifice', 'sacrifice'),
            this.createBtn(this.doTag.children,
                () => this.game.player.doBaby(this.game),
                () => this.game.player.peopleCount + '/'
                    + this.game.player.maxPop,
                'baby', 'baby'),
            this.createBtn(this.doTag.children,
                () => this.game.player.attemptSummon(this.game),
                () => this.game.player.summonCount + '/'
                    + this.game.player.maxSummon,
                'summon', 'summon'),
            this.createBtn(this.doTag.children,
                () => this.game.player.pray(this.game),
                null,
                'pray', 'pray'),
            this.createBtn(this.moveTag.children,
                () => this.game.player.sendAttack(this.game),
                null,
                'attack', 'attack'),
            this.createBtn(this.moveTag.children,
                () => this.game.player.sendConvert(this.game),
                null,
                'convert', 'convert'),
            this.createBtn(this.moveTag.children,
                () => this.game.player.sendRetreat(this.game),
                null,
                'retreat', 'retreat')
        ]);

        this.menuContainerTag = document.createElement('div');
        this.menuContainerTag.classList.add('menu-container');

        this.createMenuBtn('pause-btn')
            .btn.onchange = ev => ev.target.checked ? pause(): resume();
        this.createMenuBtn('menu-btn');

        this.menuTag = document.createElement('div');
        this.menuTag.classList.add('menu');

        settings.all.map(n => this.createSettings(n));
        this.createLink('New', 'javascript:newGame()');
        this.createLink('Save', 'javascript:save()');
        this.createLink('Restore', 'javascript:restore()');
        this.createLink('Source', 'https://github.com/Dagothig/tiny_religion.js/')
            .link.target = 'blank';

        this.menuContainerTag.appendChild(this.menuTag);
    }
    createGroup(parent, name) {
        let tag = document.createElement('div');
        tag.classList.add('group');

        let nameTag = document.createElement('div');
        nameTag.classList.add('name');
        nameTag.innerHTML = name;
        tag.appendChild(nameTag);

        let children = document.createElement('div');
        children.classList.add('children');
        tag.appendChild(children);

        parent.appendChild(tag);

        return {
            tag: tag,
            nameTag: nameTag,
            children: children
        };
    }
    createBtn(parent, onclick, onupdate, name, ...classes) {
        let tag = document.createElement('div');

        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add.apply(btn.classList, classes);
        btn.onclick = onclick;
        tag.appendChild(btn);

        let textTag = document.createElement('span');
        btn.appendChild(textTag);

        let tooltip = document.createElement('div');
        tooltip.innerHTML = name;
        tooltip.classList.add('tooltip');
        tag.appendChild(tooltip);

        parent.appendChild(tag);

        return {
            tag: tag,
            btn: btn,
            textTag: textTag,
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
        let container = document.createElement('div');

        let lbl = document.createElement('label');
        lbl.innerHTML = name;
        lbl.htmlFor = name;

        let input = settings.inputFor(name);

        container.appendChild(lbl);
        container.appendChild(input);
        this.menuTag.appendChild(container);

        return container;
    }
    createMenuBtn(name) {
        let btn = document.createElement('input');
        btn.name = btn.id = name;
        btn.type = 'checkbox';
        btn.classList.add('checked', name);
        this.menuContainerTag.appendChild(btn);

        let check = document.createElement('label');
        check.classList.add('check');
        check.htmlFor = name;
        this.menuContainerTag.appendChild(check);

        return { btn: btn, check: check };
    }
    update(delta, game) {
        this.game = game;
        if (game) {
            this.btns.forEach(btn => {
                let text = btn.update && btn.update();
                if (btn.text !== text) btn.text = btn.textTag.innerHTML = text;
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
    pause() { this.btns.forEach(btn => btn.btn.disabled = true); }
    resume() { this.btns.forEach(btn => btn.btn.disabled = false); }
}