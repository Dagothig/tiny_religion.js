'use strict';

import Misc from '../misc';
import settings from '../settings';

import Overlay from './overlay';
import { Music, musics, sounds } from '../sounds';

import {
    darkSkyColor, skyColor, goodSkyColor,
    darkCloudColor, cloudColor, goodCloudColor,
    darkGlobalColor, globalColor, goodGlobalColor
} from './consts'; 

import Kingdom from './kingdom';
import God from './entities/god';
import Island from './entities/island';
import Islands from './islands';
import Tree from './entities/building/tree';
import FallingTree from './entities/building/falling-tree';

class Game extends PIXI.Container {
    constructor(ui, onFinished, state = { x: 0, y: 0, goal: settings.goal }) {
        super();
        this.eventListeners = {};
        this.x = state.x;
        this.y = state.y;
        this.goal = state.goal;
        this.onFinished = win => {
            Music.stop();
            onFinished(win);
        };

        this.bg = new PIXI.Sprite(PIXI.gradient);
        this.bg.alpha = 0.25;
        this.bg.anchor.y = 1;
        this.bg.z = -200;
        this.addChild(this.bg);

        // God
        this.god = new God();
        if (state.god) this.god.readState(state.god, this);
        this.addChild(this.god);

        // Kingdoms
        this.player = new Kingdom('player', 0x113996);
        this.player.events
            .on('build', e => {
                this.god.event(e.type.name, 0.5, e.building.position);
                sounds.build.play();
            })
            .on('complete', e => {
                this.god.event(e.type.name, 0.5, e.building.position);
                sounds.done.play();
                if (e.type === Tree) ui.notify('tree grown');
                else if (e.type === FallingTree) ui.notify('stump removed');
                else ui.notify(e.type.name + ' built');
            })
            .on('train', e => {
                this.god.event(e.job.name, 1, e.person.position);
                sounds[e.job.name + 'Train'].play();
            })
            .on('untrain', e => {
                this.god.event(e.job.name, -1, e.person.position);
                sounds.untrain.play();
            })
            .on('pray', e => {
                let prop = e.count / (this.player.peopleCount + this.player.summonCount);
                this.god.event('pray', prop * (1 + this.player.statueCount), e.position);
                sounds.pray.play(null, prop);
            })
            .on('baby', e => {
                this.god.event('baby', 1, e.parent.position);
                sounds.baby.play();
            })
            .on('summon', e => {
                this.god.event('summon', 1, e.priest.position);
                sounds.summon.play();
            })
            .on('fight', e => {
                this.god.event('fight', e.warrior.type.fightModifier, e.warrior.position);
                if (e.target.health <= 0) this.god.event('kill', 1, e.target.position);
            })
            .on('converting', e => {
                this.god.event('converting', 1, this.position);
            })
            .on('convert', e => {
                this.god.event('convert', 1, e.priest.position);
                sounds.convert.play();
            })
            .on('island', e => {
                if (e.newKingdom === this.player) sounds.islandWin.play();
                else if (e.oldKingdom === this.player) sounds.islandLose.play();
            });
        
        let playerPersonTint = document.querySelector('#player-person-tint feColorMatrix');
        PIXI.Color.setSVGFilterColorMatrixFromColor(playerPersonTint, this.player.personTint);
        let playerBuildingTint = document.querySelector('#player-building-tint feColorMatrix');
        PIXI.Color.setSVGFilterColorMatrixFromColor(playerBuildingTint, this.player.buildingTint);

        this.ai = new Kingdom('ai', 0xab1705);
        this.gaia = new Kingdom('gaia', 0x888888);
        this.kingdoms = [this.player, this.ai, this.gaia];

        // Islands
        this.islands = new Islands(this);
        if (state.islands) {
            state.islands.forEach(s => this.islands.add(Island.fromState(s, this)));
            this.islands.forEach(island => island.resolveIndices(this));
        } else this.islands.generateInitial(this.player);

        this.skiesMood = 0;

        // Overlay
        if (state.overlay) this.overlay = Overlay.fromState(state.overlay, this);
        else {
            this.overlay = new Overlay();
            this.overlay.flash(60);
        }
        this.addChild(this.overlay);
    }

    addChild(child) {
        PIXI.Container.prototype.addChild.apply(this, arguments);
        if (arguments.length === 1 && child.onAdd) child.onAdd();
    }
    update(delta) {
        for (let i = this.children.length; i--;) {
            let child = this.children[i];
            if (child.update) child.update(delta, this);
            if (child.shouldRemove) {
                this.removeChildAt(i);
                if (child.onRemove) child.onRemove();
            }
        }

        if (this.player.linkedTo(this, this.ai)) Music.switchTo(musics.combat);
        else Music.switchTo(musics.regular);
    }
    render(delta, renderer) {
        // Positions & limits
        let width = renderer.width, height = renderer.height;
        if (this.down) this.updateDown(delta);
        if (this.events.keys[37]) this.x += 5 + this.islands.count;
        if (this.events.keys[39]) this.x -= 5 + this.islands.count;
        let totalWidth = this.islands.width;
        let target = Math.bounded(this.x,
            width -(this.islands.islBnds.right + totalWidth),
            -this.islands.islBnds.left);
        target = Math.bounded(this.x, width / 2, width / 2 + this.islands.width);
        this.x = target * 0.05 + this.x * 0.95;
        this.y = height - this.islands.islBnds.bottom;
        this.god.x = -this.x + width / 2;
        this.god.y = -this.y;

        this.bg.x = -this.x;
        this.bg.y = this.islands.islBnds.bottom;
        this.bg.width = width;
        this.bg.height = height;

        // Coloring
        let feeling = this.god.feeling(this.goal);
        this.skiesMood += (feeling - this.skiesMood) * 0.01;
        this.skiesMood = Math.bounded(this.skiesMood, -1, 1);

        this.backgroundColor = PIXI.Color.interpolate(skyColor,
            this.skiesMood > 0 ? goodSkyColor : darkSkyColor,
            Math.abs(this.skiesMood));
        this.cloudColor = PIXI.Color.interpolate(cloudColor,
            this.skiesMood > 0 ? goodCloudColor : darkCloudColor,
            Math.abs(this.skiesMood));
        this.globalColor = PIXI.Color.interpolate(globalColor,
            this.skiesMood > 0 ? goodGlobalColor : darkGlobalColor,
            Math.abs(this.skiesMood));

        renderer.backgroundColor = this.backgroundColor;
        this.islands.render(renderer);

        // We could do smarter culling using the bounds, but it turns out that it's
        // more performant to just assume everything is 480 wide (this works
        // because our largest images are 480 wide).
        let min = 0 - this.x - this.islands.islBnds.right,
            max = width - this.x - this.islands.islBnds.left;
        let children = this.children;
        this.children = children
            .filter(c =>
                (c.nonCullable || c.x >= min && c.x <= max) &&
                (!c.render || c.render(delta, this, renderer) || true))
            .sort(Game.zSort);

        renderer.render(this);
        this.children = children;
    }
    checkForEnd() {
        return;
        if (!this.player.peopleCount && !this.player.summonCount)
            this.onFinished(false);
        else if (this.god.overallMood > this.goal)
            this.onFinished(true);
    }

    attachEvents(container, renderer) {
        if (this.container) this.detachEvents();
        else {
            this.events = {};
            this.events.mousedown = ev =>
                this.beginDown(ev.pageX * renderer.scaling, ev.pageY * renderer.scaling);
            this.events.touchstart =
                Misc.wrap(Misc.touchToMouseEv, this.events.mousedown);

            this.events.mousemove = ev =>
                this.onMove(ev.pageX * renderer.scaling, ev.pageY * renderer.scaling);
            this.events.touchmove =
                Misc.wrap(Misc.touchToMouseEv, this.events.mousemove);

            this.events.mouseup = ev => this.finishDown();
            this.events.touchend = this.events.mouseup;
            this.events.mousewheel = ev => this.x -= ev.deltaX;
            this.events.keys = [];
            this.events.keydown = ev => this.events.keys[ev.keyCode] = true;
            this.events.keyup = ev => this.events.keys[ev.keyCode] = false;
        }
        this.container = container;

        container.addEventListener('mousedown', this.events.mousedown);
        container.addEventListener('touchstart', this.events.touchstart);
        document.addEventListener('mousemove', this.events.mousemove);
        container.addEventListener('touchmove', this.events.touchmove);
        window.addEventListener('touchend', this.events.touchend);
        window.addEventListener('mouseup', this.events.mouseup);
        container.addEventListener('mousewheel', this.events.mousewheel);
        document.addEventListener('keydown', this.events.keydown);
        window.addEventListener('keyup', this.events.keyup);
    }
    detachEvents() {
        this.container.removeEventListener('mousedown', this.events.mousedown);
        this.container.removeEventListener('touchstart', this.events.touchstart);
        document.removeEventListener('mousemove', this.events.mousemove);
        this.container.removeEventListener('touchmove', this.events.touchmove);
        window.removeEventListener('mouseup', this.events.mouseup);
        window.removeEventListener('touchend', this.events.touchend);
        this.container.removeEventListener('mousewheel', this.events.mousewheel);
        document.removeEventListener('keydown', this.events.keydown);
        window.removeEventListener('keyup', this.events.keyup);
        this.container = null;
    }

    beginDown(x, y) {
        this.down = {
            start: x,
            last: x,
            current: x,

            originalPos: this.x,
            time: performance.now(),
            velocity: 0
        };
    }
    finishDown() { if (this.down) this.down.finished = true; }
    updateDown(delta) {
        if (!this.down.finished) {
            let diff = this.down.current - this.down.last;
            this.down.velocity = this.down.velocity * 0.5 + diff * 0.75;
            this.x += diff;
            this.down.last = this.down.current;
        } else {
            this.down.velocity *= 0.90;
            this.x += this.down.velocity;
        }

        if (this.down.finished && Math.abs(this.down.velocity) < 0.01)
            this.down = null;
    }
    onMove(x, y) {
        if (this.down && !this.down.finished) {
            this.down.current = x;
        }
    }

    listeners(name) {
        return this.eventListeners[name] || (this.eventListeners[name] = []);
    }
    addEventListener(name, listener) {
        this.listeners(name).add(listener);
    }
    removeEventListener(name, listener) {
        this.listeners(name).remove(listener);
    }
    onGodChangePersonality() {
        this.listeners('godChangePersonality').forEach(listener => listener());
    }

    outputState() {
        return {
            x: this.x,
            y: this.y,
            goal: this.goal,
            overlay: this.overlay.outputState(),
            god: this.god.outputState(),
            islands: this.islands.outputState()
        };
    }
}
Game.zSort = (a, b) => (a.z || 0) - (b.z || 0);
Game.loadedHandlers = [];
Object.defineProperty(Game, 'loaded', {
    get() { return this._loaded; },
    set(val) {
        while (Game.loadedHandlers.length)
            Game.loadedHandlers.shift()();
        this._loaded = val;
    }
})
Game.onLoad = function(handler) {
    if (Game.loaded) handler();
    else Game.loadedHandlers.push(handler);
}
PIXI.loader.load(() => Game.loaded = true);

export default Game;