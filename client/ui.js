'use strict';

class UI {
    constructor(gameContainer, onTitle) {
        this.gameContainer = gameContainer;
        this.gameContainer.classList.add('hidden');

        this.keybindings = [];
        document.addEventListener('keydown', e =>
            this.keybindings
            .filter(keybinding => keybinding.key === e.key)
            .forEach(keybinding => keybinding.act()));

        this.onTitle = () => {
            this.titleTag.removeEventListener('click', this.onTitle);
            onTitle();
        };

        this.titleTag = dom('div', { class: 'hidden title', click: this.onTitle });
        this.keybindings.push({ key: 'Escape', act: () => this.titleTag.click() });

        this.btnsTag = dom('div', { class: 'hidden btns' },
            this.groupSelectTag = dom('div', { class: 'group-select' }),
            this.groupsTag = dom('div', { class: 'groups' }));

        settings.bind('tooltips', t =>
            this.btnsTag.classList[t ? 'add' : 'remove']('tooltips'));

        this.groups = [
            this.trainGroup = this.createGroup('train', 't'),
            this.untrainGroup = this.createGroup('untrain', 'u'),
            this.buildGroup = this.createGroup('build', 'b'),
            this.doGroup = this.createGroup('do', 'd'),
            this.moveGroup = this.createGroup('move', 'm')
        ];
        let groupKeybinds = this.groups.map(group => group.keybind);

        this.trainGroup.radio.onclick = this.untrainGroup.radio.onclick =
            () => this.tip('jobs');
        this.buildGroup.radio.onclick =
            () => this.tip('buildings');

        this.show(this.doGroup);

        this.btns =
        ['train', 'untrain'].reduce((btns, act) =>
            [Builder, Warrior, Priest].reduce((btns, job) => {
                let v = () => this.game.player.villagerCount;
                let j = () => this.game.player[job.name + 'Count'];
                btns.add(this.createBtn(this[act + 'Group'].children,
                    () => this.game.player[act](this.game, job),
                    act === 'train' ?
                        () => [v(), j()] :
                        () => [j(), v()],
                    job.name,
                    Array.from(job.name).find(c => groupKeybinds.indexOf(c) === -1),
                    act,
                    job.name));
                return btns;
            }, btns), [])
        .concat([House, Barracks, Workshop, Temple, GreenHouse]
            .reduce((btns, type) => {
                btns.add(this.createBtn(this.buildGroup.children,
                    () => this.game.player.build(this.game, type),
                    () => this.game.player[type.name + 'Count'],
                    type.name,
                    Array.from(type.name).find(c => groupKeybinds.indexOf(c) === -1),
                    'build',
                    type.name));
                return btns;
            }, []))
        .concat([
            this.createBtn(this.buildGroup.children,
                () => this.game.player.buildBridge(this.game),
                null,
                'bridge', 'r', 'build', 'bridge'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.forestate(this.game),
                () => this.game.player.treeCount + this.game.player.bigTreeCount,
                'forestate', 'f', 'forestate'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.deforest(this.game),
                null,
                'deforest', 'e', 'deforest'),
            this.createBtn(this.doGroup.children,
                () => this.game.god.doSacrifice(this.game),
                null,
                'sacrifice', 's', 'sacrifice'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.doBaby(this.game),
                () => this.game.player.peopleCount + '/'
                    + this.game.player.maxPop,
                'baby', 'a', 'baby'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.attemptSummon(this.game),
                () => this.game.player.summonCount + '/'
                    + this.game.player.maxSummon,
                'summon', 'u', 'summon'),
            this.createBtn(this.doGroup.children,
                () => this.game.player.pray(this.game),
                null,
                'pray', 'p', 'pray'),
            this.createBtn(this.moveGroup.children,
                () => this.game.player.sendAttack(this.game),
                null,
                'attack', 'a', 'attack'),
            this.createBtn(this.moveGroup.children,
                () => this.game.player.sendConvert(this.game),
                null,
                'convert', 'c', 'convert'),
            this.createBtn(this.moveGroup.children,
                () => this.game.player.sendRetreat(this.game),
                null,
                'retreat', 'r', 'retreat')
        ]);

        this.menuContainerTag = dom('div', { class: 'menu-container' },
            this.menuBtn('pause-btn', ev => ev.target.checked ? pause() : resume()),
            this.menuBtn('menu-btn'),
            this.menuTag = dom('div', { class: 'menu' },
                settings.usr.map(n =>
                    dom('div', {},
                        dom('label', { textContent: n, htmlFor: n }),
                        settings.inputFor(n))),
                dom('div', {},
                    dom('a', { href: 'javascript:newGame()'}, 'new'),
                    settings.inputFor('goal')),
                dom('div', {},
                    dom('a', { href: 'javascript:save()' }, 'save')),
                dom('div', {},
                    dom('a', { href: 'javascript:restore()' }, 'restore')),
                dom('div', {},
                    dom('a', {
                        href: 'https://github.com/Dagothig/tiny_religion.js/',
                        target: 'blank'
                    }, 'source'))));

        this.tips = {};
        this.tipsQueue = [];
        this.tipTag = dom('div', { class: 'tip initial' },
            this.tipTextTag = dom('div', { class: 'text' }),
            this.tipOkTag = dom('button', {
                click: () => this.dequeueTip()
            }, 'g', dom('span', { class: 'keybind' }, 'o'), 'tcha'));
        this.keybindings.push({
            key: 'o',
            act: () => this.tipOkTag.offsetWidth && this.tipOkTag.click()
        });
        this.gameContainer.appendChild(this.tipTag);

        settings.bind('tips', t => {
            if (t) return;
            this.tips = {};
            this.tipsQueue = [];
            this.tipTag.classList.add('hidden');
        });

        this.notifyTag = dom('div', { class: 'notify' });
        this.gameContainer.appendChild(this.notifyTag);

        this.fpsCounter = new FPSCounter();
        this.gameContainer.appendChild(this.fpsCounter.tag);
    }
    createGroup(name, keybind) {
        let group = { keybind: keybind };
        let i = name.indexOf(keybind);
        let formattedName = i >= 0 ? [
            name.substring(0, i),
            dom('span', { class: 'keybind' }, keybind),
            name.substring(i + 1)
        ] : [
            name + ' ',
            dom('span', { class: 'keybind' }, keybind)
        ];
        group.radio = dom('input', {
            id: name, name: 'group', type: 'radio', class: 'checked', value: name,
            change: () => this.show(group)
        });
        group.nameTag = dom('label', { class: 'check', htmlFor: name },
            group.nameContent = dom('span', { class: 'name' }, formattedName));
        group.children = dom('div', { class: 'group' })

        this.groupSelectTag.appendChild(group.radio);
        this.groupSelectTag.appendChild(group.nameTag);
        this.groupsTag.appendChild(group.children);

        this.keybindings.push({
            key: keybind,
            act: () => group.radio.offsetWidth && group.radio.click()
        });
        return group;
    }
    createBtn(parent, onclick, onupdate, name, keybind, ...classes) {
        let obj = { update: onupdate, textTags: [], keybind: keybind };
        let i = name.indexOf(keybind);
        let formattedName = i >= 0 ? [
            name.substring(0, i),
            dom('span', { class: 'keybind' }, keybind),
            name.substring(i + 1)
        ] : [
            name + ' ',
            dom('span', { class: 'keybind' }, keybind)
        ];
        obj.tag = dom('div', {},
            obj.btn = dom('button', {
                class: 'btn ' + classes.join(' '),
                click: () => this.notify(onclick())
            }),
            obj.tooltip = dom('div', { class: 'tooltip', tabIndex: -1 }, formattedName));
        parent.appendChild(obj.tag);
        this.keybindings.push({
            key: keybind,
            act: () => obj.tag.offsetWidth && obj.btn.click()
        });
        return obj;
    }
    menuBtn(name, change) {
        return [
            dom('input', {
                id: name,
                name: name,
                type: 'checkbox',
                class: `checked ${name}`,
                change: change
            }),
            dom('label', {
                class: 'check',
                htmlFor: name
            })
        ];
    }

    updateText(btn, i, text) {
        let span = btn.textTags[i];
        if (!span) {
            btn.textTags[i] = span = document.createElement('span');
            btn.btn.appendChild(span);
        }
        if (span._text === text) return;
        span.textContent = span._text = text;
    }
    update(delta, game) {
        this.game = game;
        if (game) {
            this.btns.forEach(btn => {
                let text = btn.update && btn.update();
                if (text instanceof Array) text.forEach((t, i) =>
                    this.updateText(btn, i, text[i]));
                else this.updateText(btn, 0, text);
            });
        }

        this.fpsCounter.update(delta);
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
        if (window.android) android.updateStatusTint(0x193bcb);
        this.titleTag.addEventListener('click', this.onTitle);
        this.tipTag.classList.add('hidden');
    }
    hideTitle() {
        this.titleTag.classList.add('hidden');
        this.btnsTag.classList.remove('hidden');
        this.gameContainer.classList.remove('hidden');
    }
    pause() { this.btns.forEach(btn => btn.btn.disabled = true); }
    resume() { this.btns.forEach(btn => btn.btn.disabled = false); }
    tip(id, text = strs.tips[id]) {
        if (!settings.tips || this.tips[id]) return;
        this.tips[id] = true;
        this.tipsQueue.push({ id: id, text: text });
        if (this.tipTag.classList.contains('hidden')) this.dequeueTip();
    }
    dequeueTip() {
        let tip = this.tipsQueue.shift();
        if (tip) {
            this.tipTag.classList.remove('hidden', 'initial');
            this.tipTextTag.textContent = tip.text;
        } else {
            this.tipTag.classList.add('hidden');
        }
    }
    notify(msg) {
        let notif = dom('div', {
            animationend: () => notif.remove(),
            style: `animation-duration: ${msg.extra && settings.tips ? 4 : 2}s;`
        },
            msg.message || msg,
            settings.tips && msg.extra && dom('div', { class: 'extra' }, msg.extra)
        );
        this.notifyTag.appendChild(notif);

        let height = notif.clientHeight;
        let children = Array.from(this.notifyTag.children).filter(c => c !== notif);

        notif.style.top = [0]
            .concat(children.map(c => c.offsetTop + c.clientHeight))
            .filter(p =>
                children.every(c =>
                    p >= c.offsetTop + c.clientHeight || p + height <= c.offsetTop))
            .sort((a, b) => a - b)[0] + 'px';
    }
    updateToGodColor(game) {
        this.btnsTag.style.backgroundColor =
            '#' + game.god.offTint.toString('16').padStart(6, '0');
        if (window.android) android.updateStatusTint(game.god.offTint);
    }
    onGodChangePersonality(game) {
        this.updateToGodColor(game);
        this.tip('color');
    }
    onNewGame(game) {
        this.updateToGodColor(game);
        game.addEventListener('godChangePersonality', () =>
            this.onGodChangePersonality(game));
        this.tip('please');
    }
}
