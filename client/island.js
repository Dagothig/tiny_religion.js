'use strict';

class Island extends PIXI.Container {
    constructor(x, y, kingdom) {
        super();
        this.x = x;
        this.y = y;
        this.ground = new PIXI.TiledSprite(Island.ground);
        this.cloudBack = new PIXI.OscillatingSprite(
            Island.cloudBack, cloudBackCycle, 0, 0, 0, 8);
        this.cloudFront = new PIXI.OscillatingSprite(
            Island.cloudFront, cloudFrontCycle, 0, 0, 0, 8);
        this.ground.anchor.x = this.cloudBack.anchor.x = this.cloudFront.anchor.x =
            0.525;
        this.ground.anchor.y = this.cloudBack.anchor.y = this.cloudFront.anchor.y =
            0.275;
        this.addChild(this.cloudBack, this.ground, this.cloudFront);
        this.buildings = [];
        this.people = [];
        this.kingdom = kingdom;

        this.zoneWidth = 300;
        this.zoneHeight = 120;
    }
    get z() { return -100; }

    generateBuilding(
        type,
        finished = true,
        radius = type.radius,
        attempts = 10 * radius
    ) {
        for (let i = 0; i < attempts; i++) {
            let pos = this.getRandomPoint(radius);
            if (this.buildings.find(b =>
                b.isInRadius(pos, radius))) continue;
            let b = new Building(pos.x, pos.y, type, this.kingdom, this, finished);
            this.buildings.add(b);
            return b;
        }
    }
    generateBuildings(count, ...args) {
        for (let i = 0; i < count; i++)
            this.generateBuilding.apply(this, args);
    }
    generateBridge(finished = true) {
        if (this.bridge) throw 'bridge already exists';
        let bridge = new Building(
            this.x + this.getLocalBounds().right, this.y,
            Bridge, this.kingdom, this, finished);
        this.buildings.add(bridge);
        this.bridge = bridge;
        return bridge;
    }
    generateForest() {
        this.generateBuildings(Math.random() * 20 + 10, Tree);
    }
    generatePlain() {
        this.generateBuildings(Math.random() * 10, Tree);
    }
    generateOutpost() {
        let houses = Math.random() * 3;
        this.generatePlain();
        this.generateBuildings(houses, House);
        this.generateBuilding(Barracks);
        this.people.add(
            new Person(this.x, this.y, Builder, this.kingdom, this),
            new Person(this.x, this.y, Priest, this.kingdom, this),
            new Person(this.x, this.y, Villager, this.kingdom, this),
            new Person(this.x, this.y, Villager, this.kingdom, this)
        );
        let extra = 5 + houses * 4;
        for (let i = 4; i < extra; i++)
            this.people.add(new Person(
                this.x, this.y, Warrior, this.kingdom, this));
    }
    generateCity() {
        let houses = 10 + Math.random() * 10;
        let special = Math.random() * 3;
        let trees = Math.random() * 10;
        let types = [Barracks, Temple, Workshop];
        for (let i = 0; i < special; i++)
            this.generateBuilding(types.rand());
        this.generateBuildings(houses, House);
        this.generateBuildings(trees, Tree);
        for (let i = 0; i < 5 + houses * 4; i++) {
            this.people.add(new Person(
                this.x, this.y, Person.jobs.rand(), this.kingdom, this));
        }
    }
    generateTemple() {
        let temples = Math.random() * 3;
        let trees = Math.random() * 20;
        this.generateBuildings(temples, Temple);
        this.generateBuildings(trees, Tree);
        for (let i = 0; i < temples * 5; i++) {
            this.people.add(new Person(
                this.x, this.y, Priest, this.kingdom, this));
        }
    }

    getRandomPoint(radius = 0) {
        // we have (x/hw)^2 + (y/hh)^2 < 1 where hw half-width and hh half-height
        // we take x in [-hw, hw]
        // then (y/hh)^2 < 1 - (x/hw)^2
        // and y < hh * Math.sqrt(1 - (x/hw)^2)
        let hwidth = (this.zoneWidth - radius) / 2,
            hheight = (this.zoneHeight - radius) / 2;
        let x = Math.random() * hwidth * 2 - hwidth;
        let yrange = hheight * Math.sqrt(1 - Math.pow(x / hwidth, 2));
        let y = Math.random() * yrange * 2 - yrange;
        return { x: this.x + x, y: this.y + y, island: this };
    }

    update(delta, game) {
        let alliedPresence = null, enemyPresence = null;
        this.people = this.people.filter(p => {
            if (p.kingdom === this.kingdom) alliedPresence = p.kingdom;
            else enemyPresence = p.kingdom;
            return !p.shouldRemove;
        });
        if (!alliedPresence && enemyPresence) this.changeKingdom(enemyPresence);

        let eco = 0;
        this.buildings = this.buildings.filter(b =>
            (eco += b.finished ? b.eco : 0, !b.shouldRemove));
        this.ground.tileX = Math.bounded(eco, 0, 3)|0;

        this.cloudBack.update(delta);
        this.cloudFront.update(delta);
    }
    render(delta, game, renderer) {
        this.cloudBack.tint = game.cloudColor;
        this.cloudFront.tint = game.cloudColor;
        this.ground.tint = game.globalColor;
    }

    changeKingdom(newKingdom) {
        this.kingdom = newKingdom;
        if (this.kingdom.isPlayer) sounds.islandWin.play();
        else sounds.islandLose.play();
        this.buildings.forEach(b => {
            b.kingdom = newKingdom;
            b.updateTextureState();
        });
    }

    outputState() {
        return {
            people: this.people.map(person => person.outputState()),
            buildings: this.buildings.map(building => building.outputState()),
            kingdom: this.kingdom.name
        }
    }
    resolveIndices(game) {
        this.people.forEach(person => person.resolveIndices(game));
        this.buildings.forEach(building => building.resolveIndices(game));
    }
}
Island.fromState = function(state, game) {
    let isl = new Island(game.islandsWidth, 0, game[state.kingdom]);
    isl.people = state.people.map(s => Person.fromState(s, isl, game));
    isl.buildings = state.buildings.map(s => Building.fromState(s, isl, game));
    return isl;
};
PIXI.loader
.add('island', 'images/Island.png', null, res =>
    Island.ground = new PIXI.TiledTexture(res.texture, 480, 240))
.add('cloudBack', 'images/CloudBack.png', null, res =>
    Island.cloudBack = res.texture)
.add('cloudFront', 'images/CloudFront.png', null, res =>
    Island.cloudFront = res.texture)
.add('cloudStartBack', 'images/CloudStartBack.png', null, res =>
    Island.cloudStartBack = res.texture)
.add('cloudStartFront', 'images/CloudStartFront.png', null, res =>
    Island.cloudStartFront = res.texture);