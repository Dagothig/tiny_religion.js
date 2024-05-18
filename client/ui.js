'use strict';

class UI {
    constructor(gameContainer, onTitle) {
        this.gameContainer = gameContainer;
        this.gameContainer.classList.add('hidden');
        this.onTitle = onTitle;

        this.titleTag = dom('div', { class: 'hidden title', click: this.onTitle });

        this.btnsTag = dom('div', { class: 'hidden btns' },
            this.groupSelectTag = dom('div', { class: 'group-select' }),
            this.groupsTag = dom('div', { class: 'groups' }));

        this.groups = [];
        this.menus = [];

        this.trainGroup = this.createGroup('train');
        //this.untrainGroup = this.createGroup('untrain');
        this.trainGroup.radio.onclick = //this.untrainGroup.radio.onclick =
            () => this.tip('jobs');

        this.buildGroup = this.createGroup('build');
        this.buildGroup.radio.onclick = () => this.tip('buildings');

        this.doGroup = this.createGroup('do');
        this.moveGroup = this.createGroup('move');

        this.show(this.doGroup);

        this.btns =
        ['train'/*, 'untrain'*/]
        .flatMap(act => [Builder, Warrior, Priest].map(job =>
            this.createBtn(this[act + 'Group'],
                () => this.game.player[act](this.game, job),
                () => act === 'train' ?
                    [this.game.player.villagerCount, this.game.player[job.name + 'Count']] :
                    [this.game.player[job.name + 'Count'], this.game.player.villagerCount],
                () => strs.jobs[job.name],
                act, job.name)))
        .concat([House, Barracks, Workshop, Temple, GreenHouse].map(type =>
            this.createBtn(this.buildGroup,
                () => this.game.player.build(this.game, type),
                () => this.game.player[type.name + 'Count'],
                () => strs.buildings[type.name],
                'build', type.name)))
        .concat([
            this.createBtn(this.buildGroup,
                () => this.game.player.buildBridge(this.game),
                null,
                () => strs.buildings.bridge,
                'build', 'bridge'),
            this.createBtn(this.doGroup,
                () => this.game.player.forestate(this.game),
                () => this.game.player.treeCount + this.game.player.bigTreeCount,
                () => strs.do.forestate,
                'forestate'),
            this.createBtn(this.doGroup,
                () => this.game.player.deforest(this.game),
                null,
                () => strs.do.deforest,
                'deforest'),
            this.createBtn(this.doGroup,
                () => this.game.god.doSacrifice(this.game),
                null,
                () => strs.do.sacrifice,
                'sacrifice'),
            this.createBtn(this.doGroup,
                () => this.game.player.doBaby(this.game),
                () => this.game.player.peopleCount + '/'
                    + this.game.player.maxPop,
                () => strs.do.baby,
                'baby'),
            this.createBtn(this.doGroup,
                () => this.game.player.attemptSummon(this.game),
                () => this.game.player.summonCount + '/'
                    + this.game.player.maxSummon,
                () => strs.do.summon,
                'summon'),
            this.createBtn(this.doGroup,
                () => this.game.player.pray(this.game),
                null,
                () => strs.do.pray,
                'pray'),
            this.createBtn(this.moveGroup,
                () => this.game.player.sendAttack(this.game),
                null,
                () => strs.send.attack,
                'attack'),
            this.createBtn(this.moveGroup,
                () => this.game.player.sendConvert(this.game),
                null,
                () => strs.send.convert,
                'convert'),
            this.createBtn(this.moveGroup,
                () => this.game.player.sendRetreat(this.game),
                null,
                () => strs.send.retreat,
                'retreat')
        ]);

        this.menuContainerTag = dom('div', { class: 'menu-container' },
            this.menu = this.menuBtn('menu', ev => ev.target.checked ?
                (pause("menu"), this.menuTag.querySelector(selectableSelector).focus()) :
                (resume("menu"), document.body.focus())),
            this.menuTag = dom('div', { class: 'menu', tabIndex: 0 },
                dom('div', { class: "resume-btn" },
                    dom('a', { href: 'javascript:ui.closeMenu()' }, () => strs.menu.resume)),
                dom('div', {},
                    dom('a', { href: 'javascript:save()' }, () => strs.menu.save)),
                dom('div', {},
                    dom('a', { href: 'javascript:restore()' }, () => strs.menu.restore)),
                dom('div', {},
                    dom('a', { href: 'javascript:newGame()'}, () => strs.menu.new),
                    settings.inputFor('goal')),
                settings.usr.map(n =>
                    dom('div', {},
                        dom('label', { htmlFor: n }, () => strs.menu[n]),
                        settings.inputFor(n))),
                dom('div', {},
                    dom('a', {
                        href: 'https://github.com/Dagothig/tiny_religion.js/',
                        target: 'blank'
                    }, strs.menu.source)),
                window.exit && dom('div', {},
                    dom('a', { href: 'javascript:exit()' }, () => strs.menu.exit))));

        this.tips = JSON.parse(localStorage.getItem("tipsShown") || "{}");
        this.tipsQueue = [];
        this.tipTag = dom('div', { class: 'tip initial' },
            this.tipTextTag = dom('div', { class: 'text' }),
            this.tipOkTag = dom('button',
                {
                    click: () => {
                        this.dequeueTip();
                        sounds.beep1.play();
                    }
                },
                () => strs.tipsOk,
                this.tipOkBindingTag = dom('span', { class: 'binding' })));
        this.gameContainer.appendChild(this.tipTag);

        settings.bind('tips', t => {
            if (t) {
                this.game && this.tip('please');
                return;
            }
            this.tips = {};
            localStorage.removeItem("tipsShown");
            this.tipsQueue = [];
            this.tipTag.classList.add('hidden');
        });

        this.notifyTag = dom('div', { class: 'notify' });
        this.gameContainer.appendChild(this.notifyTag);

        this.fpsCounter = new FPSCounter();
        this.gameContainer.appendChild(this.fpsCounter.tag);
    }
    createGroup(name) {
        let group = {};
        group.radio = dom('input', {
            id: name, name: 'group', type: 'radio', class: 'checked', value: name,
            change: () => this.show(group)
        });
        group.nameTag = dom('label', { class: 'check', htmlFor: name },
            group.nameContent = dom('span', { class: 'group-name' }, () => strs.groups[name],
                group.binding = dom('span', { class: 'binding' })));
        group.children = dom('div', { class: 'group' });
        group.btns = [];
        group.action = "group:" + name;
        group.trigger = () => group.radio.click();

        this.groupSelectTag.appendChild(group.radio);
        this.groupSelectTag.appendChild(group.nameTag);
        this.groupsTag.appendChild(group.children);
        this.groups.add(group);

        return group;
    }
    createBtn(group, onclick, onupdate, name, ...classes) {
        var obj = { update: onupdate, textTags: [] };
        obj.tag = dom('div', {},
            obj.btn = dom('button', {
                class: 'btn ' + classes.join(' '),
                click: () => this.notify(onclick()),
            }),
            obj.tooltip = dom('div', { class: 'tooltip' }, name,
                obj.binding = dom('span', { class: 'binding' })));
        group.children.appendChild(obj.tag);
        group.btns.add(obj);

        obj.action = "action:" + group.btns.length;

        obj.trigger = () => {
            obj.btn.click();
            obj.btn.animate([
                { filter: "brightness(1) grayscale(0)" },
                { filter: "brightness(1) grayscale(0)" },
                { }
            ], { duration: 200 });
        };

        return obj;
    }
    menuBtn(name, change) {
        let binding;
        const nodes = [
            dom('input', {
                id: name,
                name: name,
                type: 'checkbox',
                class: `checked ${name}-btn`,
                change: change
            }),
            dom('label', {
                class: 'check',
                htmlFor: name
            }, binding = dom('span', { class: 'binding' }))
        ];

        nodes.input = nodes[0];
        nodes.label = nodes[1];
        nodes.binding = binding;
        nodes.action = name;
        nodes.trigger = () => {
            nodes.input.checked ? sounds.beep3.play() : sounds.beep1.play();
            nodes.input.click();
        };
        this.menus.add(nodes);

        return nodes;
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
        if (window.app) app.updateStatusTint(0x193bcb);
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
        localStorage.setItem("tipsShown", JSON.stringify(this.tips));
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
    menuOffset(offset) {
        sounds.beep2.play();
        const selectable = this.menuTag.querySelectorAll(selectableSelector);
        const activeSelectable = document.activeElement.closest(selectableSelector);
        const activeIdx = Array.prototype.indexOf.call(selectable, activeSelectable);
        const newIdx = (activeIdx !== -1 ? (activeIdx + offset + selectable.length) : 0) % selectable.length;
        selectable[newIdx].focus();
    }
    menuOK() {
        sounds.beep1.play();
        const activeSelectable = document.activeElement.closest(selectableSelector);
        if (activeSelectable) {
            if (activeSelectable.nodeName.toLowerCase() === "select") {
                activeSelectable.value = activeSelectable.options[(activeSelectable.selectedIndex + 1) % activeSelectable.options.length].value;
                activeSelectable.dispatchEvent(new Event("change"));
            } else {
                activeSelectable.click();
            }
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
        if (window.app) app.updateStatusTint(game.god.offTint);
    }
    contentForAction(bindings, faces, action) {
        const result = [];
        for (const key in bindings)
            for (const bindingAction of bindings[key])
                if (bindingAction === action) {
                    const face = faces && faces[key] || { text: key };
                    result.push(dom("span",
                        { class: "binding__key binding__key--face-" + (face.color || "default") },
                        face.text))
                }
        return result;
    }
    updateToBindings(bindings, knownInfo) {
        if (this._shownBindings === bindings && this._shownKnownInfo === knownInfo) {
            return;
        }
        if (this._shownKnownInfo) {
            document.body.classList.remove(this._shownKnownInfo.class);
        }
        this._shownBindings = bindings;
        this._shownKnownInfo = knownInfo;

        knownInfo && knownInfo.class && document.body.classList.add(knownInfo.class);
        const faces = knownInfo && knownInfo.buttonFaces;

        this.tipOkBindingTag.replaceChildren(...this.contentForAction(bindings, faces, "ok"));

        for (const group of this.groups) {
            group.binding.replaceChildren(...this.contentForAction(bindings, faces, group.action));
            for (let i = 0; i < group.btns.length; i++) {
                const btn = group.btns[i];
                btn.binding.replaceChildren(...this.contentForAction(bindings, faces, btn.action));
            }
        }

        this.menu.binding.replaceChildren(...this.contentForAction(bindings, faces, this.menu.action));
    }
    onGodChangePersonality(game) {
        this.updateToGodColor(game);
        this.tip('color');
    }
    closeMenu() {
        this.menu[0].checked && this.menu[0].click();
    }
    onNewGame(game) {
        this.updateToGodColor(game);
        game.addEventListener('godChangePersonality', () =>
            this.onGodChangePersonality(game));
        this.tip('please');
        this.closeMenu();
    }
}
