'use strict';

class UI {
    constructor(gameContainer, onTitle) {
        this.gameContainer = gameContainer;
        this.gameContainer.classList.add('hidden');
        this.onTitle = () => {
            this.titleTag.removeEventListener('click', this.onTitle);
            onTitle();
        };
        this.titleTag = document.createElement('div');
        this.titleTag.classList.add('hidden', 'title');
        this.titleTag.addEventListener('click', this.onTitle)

        this.btnsTag = document.createElement('div');
        this.btnsTag.classList.add('hidden', 'btns');
        settings.bind('tooltips', t =>
            this.btnsTag.classList[t ? 'add' : 'remove']('tooltips'));

        this.groupSelectTag = document.createElement('div');
        this.groupSelectTag.classList.add('group-select');
        this.btnsTag.appendChild(this.groupSelectTag);

        this.groupsTag = document.createElement('div');
        this.groupsTag.classList.add('groups');
        this.btnsTag.appendChild(this.groupsTag);


        this.trainGroup = this.createGroup('train');
        this.untrainGroup = this.createGroup('untrain');
        this.trainGroup.radio.onclick = this.untrainGroup.radio.onclick = () =>
            this.tip('jobs',
                'villagers make babies and cut trees' +
                '\npriests make summons and convert' +
                '\nwarriors fight, builders build');
        this.buildGroup = this.createGroup('build');
        this.buildGroup.radio.onclick = () =>
            this.tip('buildings',
                'houses raise the pop limit' +
                '\nbarracks make warriors stronger' +
                '\ntemples raise the summon limit' +
                '\nand make priests better' +
                '\ngreenhouses raise the sapling limit' +
                '\nbridges discover new islands');
        this.doGroup = this.createGroup('do');
        this.moveGroup = this.createGroup('move');
        this.show(this.doGroup);

        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            [Builder, Warrior, Priest].reduce((btns, job) => {
                let v = () => this.game.player.villagerCount;
                let j = () => this.game.player[job.name + 'Count'];
                btns.add(this.createBtn(this[act + 'Group'].children,
                    () => this.game.player[act](this.game, job),
                    act === 'train' ?
                        () => v() + '   ' + j() :
                        () => j() + '   ' + v(),
                    job.name, act, job.name));
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
            .reduce((btns, type) => {
                btns.add(this.createBtn(this.buildGroup.children,
                    () => this.game.player.build(this.game, type),
                    () => this.game.player[type.name + 'Count'],
                    type.name, 'build', type.name));
                return btns;
            }, []))
        .concat([
            this.createBtn(this.buildGroup.children,
                () => this.game.player.buildBridge(this.game),
                null,
                'bridge', 'build', 'bridge'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.forestate(this.game),
                () => this.game.player.treeCount,
                'forestate', 'forestate'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.deforest(this.game),
                null,
                'deforest', 'deforest'),
            this.createBtn(this.doGroup.children,
                () => this.game.god.doSacrifice(this.game),
                null,
                'sacrifice', 'sacrifice'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.doBaby(this.game),
                () => this.game.player.peopleCount + '/'
                    + this.game.player.maxPop,
                'baby', 'baby'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.attemptSummon(this.game),
                () => this.game.player.summonCount + '/'
                    + this.game.player.maxSummon,
                'summon', 'summon'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.pray(this.game),
                null,
                'pray', 'pray'),
            this.createBtn(this.moveGroup.children,
                () => this.game.player.sendAttack(this.game),
                null,
                'attack', 'attack'),
            this.createBtn(this.moveGroup.children,
                () => this.game.player.sendConvert(this.game),
                null,
                'convert', 'convert'),
            this.createBtn(this.moveGroup.children,
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

        this.tips = {};
        this.tipsQueue = [];
        this.tipTag = document.createElement('div');
        this.tipTag.classList.add('tip', 'initial');

        this.tipTextTag = document.createElement('div');
        this.tipTextTag.classList.add('text');
        this.tipTag.appendChild(this.tipTextTag);

        this.tipOkTag = document.createElement('button');
        this.tipOkTag.innerHTML = 'gotcha';
        this.tipOkTag.onclick = () => this.dequeueTip();
        this.tipTag.appendChild(this.tipOkTag);

        settings.bind('tips', t => {
            if (t) return;
            this.tips = {};
            this.tipsQueue = [];
            this.tipTag.classList.add('hidden')
        });

        this.notifyTag = document.createElement('div');
        this.notifyTag.classList.add('notify');
    }
    createGroup(name) {
        let group = {};

        let radio = document.createElement('input');
        radio.id = name;
        radio.type = 'radio';
        radio.name = 'group';
        radio.classList.add('checked');
        radio.value = name;
        radio.onchange = ev => this.show(group);

        this.groupSelectTag.appendChild(radio);

        let nameTag = document.createElement('label');
        nameTag.classList.add('check');
        nameTag.htmlFor = name;

        let nameContent = document.createElement('span');
        nameContent.innerHTML = name;
        nameTag.appendChild(nameContent);

        this.groupSelectTag.appendChild(nameTag);

        let children = document.createElement('div');
        children.classList.add('group');
        this.groupsTag.appendChild(children);

        group.radio = radio;
        group.nameTag = nameTag;
        group.nameContent = nameContent;
        group.children = children;
        return group;
    }
    createBtn(parent, onclick, onupdate, name, ...classes) {
        let tag = document.createElement('div');

        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add.apply(btn.classList, classes);
        btn.onclick = () => this.notify(onclick());
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
        }
    }
    show(group) {
        for (let i = this.groupsTag.children.length; i--;)
            this.groupsTag.children[i].classList.add('hidden');
        group.radio.checked = true;
        group.children.classList.remove('hidden');
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
        if (window.android)
            requestAnimationFrame(() => android.updateStatusTint(0x193bcb));
        setTimeout(() =>
            this.titleTag.addEventListener('click', this.onTitle), 1000);
        this.tipTag.classList.add('hidden');
    }
    hideTitle() {
        this.titleTag.classList.add('hidden');
        this.btnsTag.classList.remove('hidden');
        this.gameContainer.classList.remove('hidden');
    }
    pause() { this.btns.forEach(btn => btn.btn.disabled = true); }
    resume() { this.btns.forEach(btn => btn.btn.disabled = false); }
    tip(id, text) {
        if (!settings.tips) return;
        if (this.tips[id]) return;
        this.tips[id] = true;
        this.tipsQueue.push({ id: id, text: text });
        if (this.tipTag.classList.contains('hidden')) this.dequeueTip();
    }
    dequeueTip() {
        let tip = this.tipsQueue.shift();
        if (tip) {
            this.tipTag.classList.remove('hidden', 'initial');
            this.tipTextTag.innerHTML = tip.text;
        } else {
            this.tipTag.classList.add('hidden');
        }
    }
    notify(str) {
        let notif = document.createElement('div');
        notif.innerHTML = str;
        notif.addEventListener('animationend', () => notif.remove());
        notif.style.animation = 'notification 2s linear';
        this.notifyTag.appendChild(notif);

        let height = notif.clientHeight;
        let children = Array.from(this.notifyTag.children).filter(c => c !== notif);

        notif.style.top =
            [0].concat(children.map(c => c.offsetTop + c.clientHeight))
            .filter(p => children.every(c => p >= c.offsetTop + c.clientHeight || p + height <= c.offsetTop))
            .sort((a, b) => a - b)[0] + 'px';
    }
    updateToGodColor(game) {
        this.btnsTag.style.backgroundColor =
            '#' + game.god.offTint.toString('16').padStart(6, '0');
        if (window.android)
            requestAnimationFrame(() => android.updateStatusTint(game.god.offTint));
    }
    onGodChangePersonality(game) {
        this.updateToGodColor(game);
        this.tip('color', "God has changed color!\nIs God the same?");
    }
    onNewGame(game) {
        this.updateToGodColor(game);
        game.addEventListener('godChangePersonality', () =>
            this.onGodChangePersonality(game));
        this.tip('please', "God demands pleasing!\nFind out what pleases God!");
    }
}