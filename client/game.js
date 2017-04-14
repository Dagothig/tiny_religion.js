'use strict';

class Overlay extends PIXI.Sprite {
    constructor(texture = PIXI.whitePixel) {
        super(texture);
        this.flashes = [];
    }
    render(delta, game, renderer) {
        this.x = -game.x;
        this.y = -game.y;
        this.width = renderer.width;
        this.height = renderer.height;

        let alpha = 0;
        for (let i = this.flashes.length; i--;) {
            let flash = this.flashes[i];
            alpha = Math.max(flash.time / flash.duration, alpha);
            flash.time--;
            if (!flash.time) this.flashes.splice(i, 1);
        }
        this.alpha = alpha;
    }
    flash(duration) {
        this.flashes.push({time: duration, duration: duration});
    }
    get z() { return 1000; }
    outputState() {
        return {
            alpha: this.alpha,
            flashes: this.flashes.slice()
        };
    }
}
Overlay.fromState = function(state, game) {
    let overlay = new Overlay();
    overlay.alpha = state.alpha;
    overlay.flashes = state.flashes;
    return overlay;
};

let darkSkyColor = 0x28162f,
    skyColor = 0xb2b8c0,
    goodSkyColor = 0x40c0ff,

    darkCloudColor = 0xa81c50,
    cloudColor = 0x8ca0a4,
    goodCloudColor = 0xd6f0ff,

    darkGlobalColor = 0xff99cc,
    globalColor = 0xdddddd,
    goodGlobalColor = 0xfff0dd,

    cloudBackCycle = 8000,
    cloudFrontCycle = 6100;

class Game extends PIXI.Container {
    constructor(onFinished, state = { x: 0, y: 0, goal: settings.goal }) {
        super();
        this.x = state.x;
        this.y = state.y;
        this.goal = state.goal;
        this.onFinished = win => {
            Music.stop();
            onFinished(win);
        };

        // God
        this.god = new God();
        if (state.god) this.god.readState(state.god, this);
        this.addChild(this.god);

        // Kingdoms
        this.player = new Kingdom('player', 0x113996, true);
        this.ai = new Kingdom('ai', 0xab1705, false);
        this.gaia = new Kingdom('gaia', 0x888888, false);

        // Clouds a
        this.cloudStartBack = new PIXI.OscillatingSprite(
            Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        this.cloudStartBack.z = -101;
        this.cloudStartFront = new PIXI.OscillatingSprite(
            Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        this.cloudStartFront.z = -99;

        this.cloudEndBack = new PIXI.OscillatingSprite(
            Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        this.cloudEndBack.z = -101;
        this.cloudEndFront = new PIXI.OscillatingSprite(
            Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        this.cloudEndFront.z = -99;
        this.cloudEndBack.scale.x = this.cloudEndFront.scale.x = -1;

        // Islands
        this.islands = [];
        if (state.islands) {
            state.islands.forEach(s => this.addIsland(Island.fromState(s, this)));
            this.islands.forEach(island => island.resolveIndices(this));
        } else this.generateInitial();
        this.updateCounts();

        // Clouds b
        this.cloudStartBack.x = this.cloudStartFront.x = this.islBnds.left;
        this.cloudEndBack.x = this.cloudEndFront.x =
            this.islBnds.left + this.islandsWidth;

        this.cloudStartBack.anchor.x = this.cloudStartFront.anchor.x =
        this.cloudEndBack.anchor.x = this.cloudEndFront.anchor.x = 1;
        this.cloudStartBack.anchor.y = this.cloudStartFront.anchor.y =
        this.cloudEndBack.anchor.y = this.cloudEndFront.anchor.y = 0.3;
        this.addChild(
            this.cloudStartBack, this.cloudStartFront,
            this.cloudEndBack, this.cloudEndFront
        );

        this.skiesMood = 0;
        this.cloudCycle = 0;
        this.cloudBackY = 4;
        this.cloudFrontY = 4;

        // Overlay
        if (state.overlay) this.overlay = Overlay.fromState(state.overlay, this);
        else {
            this.overlay = new Overlay();
            this.overlay.flash(60);
        }
        this.addChild(this.overlay);
    }

    get islandsWidth() {
        return this.islBnds ? this.islands.length * this.islBnds.width : 0;
    }

    update(delta) {
        this.updateCounts();

        this.children.forEach(child =>
            child.update && child.update(delta, this));
        this.children = this.children.filter(child => !child.shouldRemove);

        if (this.player.linkedTo(this, this.ai)) Music.switchTo(musics.combat);
        else Music.switchTo(musics.regular);
    }
    render(delta, renderer) {
        // Positions & limits
        let width = renderer.width, height = renderer.height;
        if (this.down) this.updateDown(delta);
        let totalWidth = this.islandsWidth;
        let target;
        if (this.islands.length === 1 || width > totalWidth) {
            target = (width - totalWidth + this.islBnds.width) / 2;
        } else
            target = Math.bounded(this.x,
                -(this.islBnds.left + totalWidth - width),
                -this.islBnds.left);
        this.x = target * 0.05 + this.x * 0.95;
        this.y = height - this.islBnds.bottom;
        this.god.x = -this.x + width / 2;
        this.god.y = -this.y;

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

        this.cloudStartBack.tint = this.cloudStartFront.tint =
        this.cloudEndBack.tint = this.cloudEndFront.tint = this.cloudColor;
        renderer.backgroundColor = this.backgroundColor;

        this.children.forEach(child =>
            child.render && child.render(delta, this, renderer));

        this.children.sort((a, b) => (a.z || 0) - (b.z || 0));
        renderer.render(this);
    }
    updateCounts() {
        this.player.count(this);
        this.ai.count(this);
        this.gaia.count(this);
    }
    checkForEnd() {
        if (!this.player.peopleCount && !this.player.summonCount)
            this.onFinished(false);
        else if (this.god.overallMood > this.goal)
            this.onFinished(true);
    }

    addIsland(island) {
        if (!this.islBnds) {
            let bnds = island.getLocalBounds();
            this.islBnds = {
                left: bnds.left,
                top: bnds.top,
                right: bnds.right,
                bottom: bnds.bottom,
                width: bnds.width,
                height: bnds.height
            };
        }
        island.index = this.islands.length;
        island.cloudBack.time = (island.index ?
            this.islands[island.index - 1].cloudBack.time:
            this.cloudStartBack.time) + 50;
        island.cloudFront.time = (island.index ?
            this.islands[island.index - 1].cloudFront.time:
            this.cloudStartFront.time) + 50;
        this.cloudEndBack.time = island.cloudBack.time + 50;
        this.cloudEndFront.time = island.cloudFront.time + 50;

        this.islands.add(island);
        this.addChild(island);
        if (island.buildings.length)
            this.addChild.apply(this, island.buildings);
        if (island.people.length)
            this.addChild.apply(this, island.people);
        if (this.cloudEndBack) this.cloudEndBack.x = this.cloudEndFront.x =
            this.islBnds.width * (this.islands.length - 1) + this.islBnds.right;
    }
    generateInitial() {
        let starting = new Island(this.islandsWidth, 0, this.player);
        starting.generateBuilding(House, true);
        starting.generatePlain();
        starting.people.add(
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Warrior, this.player, starting),
            new Person(0, 0, Priest, this.player, starting),
            new Person(0, 0, Builder, this.player, starting)
        );
        this.addIsland(starting);
    }
    generateNewIsland() {
        if (Math.random() < 1/(3+this.islands.length)) this.generateInhabited();
        else this.generateUninhabited();
    }
    generateInhabited() {
        let count = Math.random() * this.islands.length;
        for (let i = 0; i < count; i++) {
            let island = new Island(this.islandsWidth, 0, this.ai);
            if (i === 0) island.generateOutpost();
            else {
                let rnd = Math.random();
                if (rnd < 0.33) {
                    island.generateOutpost();
                } else if (rnd < 0.66) {
                    island.generateTemple();
                } else {
                    island.generateCity();
                }
            }
            if (i + 1 < count)
                island.buildings.add(island.bridge = new Building(
                    island.x + island.getLocalBounds().right, island.y,
                    Bridge, this.ai, island, true
                ));
            this.addIsland(island);
        }
    }
    generateUninhabited() {
        let island = new Island(this.islandsWidth, 0, this.gaia);
        if (Math.random() < 0.5) island.generatePlain();
        else island.generateForest();
        this.addIsland(island);
    }

    attachEvents(container) {
        if (this.container) this.detachEvents();
        else {
            this.events = {};
            this.events.mousedown = ev => this.beginDown(ev.pageX, ev.pageY);
            this.events.touchstart =
                Misc.wrap(Misc.touchToMouseEv, this.events.mousedown);
            this.events.mousemove = ev => this.onMove(ev.pageX, ev.pageY);
            this.events.touchmove =
                Misc.wrap(Misc.touchToMouseEv, this.events.mousemove);
            this.events.mouseup = ev => this.finishDown();
            this.events.touchend = this.events.mouseup;
            this.events.mousewheel = ev => this.x -= ev.deltaX;
        }
        this.container = container;

        container.addEventListener('mousedown', this.events.mousedown);
        container.addEventListener('touchstart', this.events.touchstart);
        document.addEventListener('mousemove', this.events.mousemove);
        container.addEventListener('touchmove', this.events.touchmove);
        container.addEventListener('touchend', this.events.touchend);
        document.addEventListener('mouseup', this.events.mouseup);
        container.addEventListener('mousewheel', this.events.mousewheel);
    }
    detachEvents() {
        this.container.removeEventListener('mousedown', this.events.mousedown);
        this.container.removeEventListener('touchstart', this.events.touchstart);
        document.removeEventListener('mousemove', this.events.mousemove);
        this.container.removeEventListener('touchmove', this.events.touchmove);
        document.removeEventListener('mouseup', this.events.mouseup);
        this.container.removeEventListener('touchend', this.events.touchend);
        this.container.removeEventListener('mousewheel', this.events.mousewheel);
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

    outputState() {
        return {
            x: this.x,
            y: this.y,
            goal: this.goal,
            overlay: this.overlay.outputState(),
            god: this.god.outputState(),
            islands: this.islands.map(island => island.outputState())
        };
    }
}
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