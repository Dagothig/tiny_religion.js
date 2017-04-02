'use strict';

class Overlay extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
        this.flashes = [];
    }
    update(delta, game, width, height) {
        this.x = -game.x;
        this.y = -game.y;
        this.width = width;
        this.height = height;
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
}

let darkSkyColor = 0x28162f,
    skyColor = 0xb2b8c0,
    goodSkyColor = 0x40c0ff,

    darkCloudColor = 0xa81c50,
    cloudColor = 0x8ca0a4,
    goodCloudColor = 0xd6f0ff,

    darkGlobalColor = 0xff99cc,
    globalColor = 0xcccccc,
    goodGlobalColor = 0xfff0cc;

class Game extends PIXI.Container {
    constructor(onFinished, goal = Game.shortGoal) {
        super();
        this.goal = goal;
        this.onFinished = onFinished;

        this.god = new God();
        this.addChild(this.god);

        this.player = new Kingdom(0x113996, true);
        this.ai = new Kingdom(0xab1705, false);
        this.gaia = new Kingdom(0x888888, false);
        this.islands = [];

        let starting = new Island(0, 0, this.player);
        starting.generateBuilding(House, true);
        starting.generatePlain();
        this.islandBounds = starting.getLocalBounds();
        starting.people.push(
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Warrior, this.player, starting),
            new Person(0, 0, Priest, this.player, starting),
            new Person(0, 0, Builder, this.player, starting)
        );
        this.addIsland(starting);

        this.cloudStart = new PIXI.Sprite(Island.cloudStart);
        this.cloudStart.x = this.islandBounds.left;

        this.cloudEnd = new PIXI.Sprite(Island.cloudStart);
        this.cloudEnd.scale.x = -1;
        this.cloudEnd.x = this.islandBounds.right;

        this.cloudStart.anchor.x = this.cloudEnd.anchor.x = 1;
        this.cloudStart.anchor.y = this.cloudEnd.anchor.y = 0.3;
        this.addChild(this.cloudStart, this.cloudEnd);

        this.skiesMood = 0;

        this.overlay = new Overlay(PIXI.whitePixel);
        this.overlay.flash(60);
        this.addChild(this.overlay);
    }

    update(delta, width, height) {
        if (window.isKeyPressed(37)) this.x += 5 + this.islands.length;
        if (window.isKeyPressed(39)) this.x -= 5 + this.islands.length;
        if (this.down) this.updateDown(delta);
        let totalWidth = this.islands.length * this.islandBounds.width;
        if (width > totalWidth) {
            this.x = (width - totalWidth + this.islandBounds.width) / 2;
        } else
            this.x = Math.bounded(this.x,
                -(this.islandBounds.left + totalWidth - width),
                -this.islandBounds.left);
        this.y = height - this.islandBounds.bottom;
        this.god.x = -this.x + width / 2;
        this.god.y = -this.y;

        this.updateColor();
        this.player.count(this);
        this.ai.count(this);

        this.children.forEach(child =>
            child.update && child.update(delta, this, width, height));
        this.children = this.children.filter(child => !child.shouldRemove);
        this.children.forEach((child, i) => child.__i__ = i);
        this.children.sort((a, b) => (a.z || 0) - (b.z || 0));

        if (this.player.linkedTo(this, this.ai)) Music.switchTo(music2);
        else Music.switchTo(music1);
    }
    updateColor() {
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

        this.cloudStart.tint = this.cloudEnd.tint = this.cloudColor;
    }
    checkForEnd() {
        if (!this.player.peopleCount && !this.player.summonCount)
            this.onFinished(false);
        else if (this.god.overallMood > this.goal)
            this.onFinished(true);
    }

    addIsland(island) {
        island.index = this.islands.length;
        this.islands.add(island);
        this.addChild(island);
        if (island.buildings.length)
            this.addChild.apply(this, island.buildings);
        if (island.people.length)
            this.addChild.apply(this, island.people);
        if (this.cloudEnd)
            this.cloudEnd.x = this.islandBounds.width * (this.islands.length - 1) +
                this.islandBounds.right;
    }
    generateNewIsland() {
        if (Math.random() < 0.25) this.generateInhabited();
        else this.generateUninhabited();
    }
    generateInhabited() {
        let count = Math.random() * this.islands.length;
        for (let i = 0; i < count; i++) {
            let island = new Island(this.islands.length * 480, 0, this.ai);
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
        let island = new Island(this.islands.length * 480, 0, this.gaia);
        if (Math.random() < 0.5) island.generatePlain();
        else island.generateForest();
        this.addIsland(island);
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
        let diff = this.down.current - this.down.last;
        if (!this.down.finished) {
            this.down.velocity = this.down.velocity * 0.5 + diff * 0.75;
            this.x += diff;
        } else {
            this.down.velocity *= 0.90;
            this.x += this.down.velocity;
        }

        this.down.last = this.down.current;
        if (this.down.finished && !this.down.velocity) this.down = null;
    }
    onMove(x, y) {
        if (this.down && !this.down.finished) {
            this.down.current = x;
        }
    }
}
Game.tinyGoal = 3000;
Game.shortGoal = 6000;
Game.mediumGoal = 12000;
Game.longGoal = 24000;