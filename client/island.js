'use strict';

class Island extends PIXI.Container {
    constructor(x, y, kingdom) {
        super();
        this.x = x;
        this.y = y;
        this.ground = new PIXI.TiledSprite(Island.ground);
        this.cloud = new PIXI.Sprite(Island.cloud);
        this.ground.anchor.x = this.cloud.anchor.x = 0.525;
        this.ground.anchor.y = this.cloud.anchor.y = 0.3;
        this.addChild(this.ground, this.cloud);
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
        this.cloud.tint = game.cloudColor;
        this.ground.tint = game.globalColor;

        let alliedPresence = null, enemyPresence = null;
        this.people = this.people.filter(p => {
            if (p.kingdom === this.kingdom) alliedPresence = p.kingdom;
            else enemyPresence = p.kingdom;
            return !p.shouldRemove;
        });
        if (!alliedPresence && enemyPresence) this.changeKingdom(enemyPresence);

        let buildingCount = 0, treeCount = 0;
        this.buildings = this.buildings.filter(b => {
            if (b.type === Tree) treeCount++;
            else if (b.type === FallingTree){}
            else buildingCount++;
            return !b.shouldRemove;
        });
        this.ground.tileX = (Math.bounded((buildingCount)/ 3, 0, 3)|0);
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
}
PIXI.loader
.add('island', 'images/Island.png', null, res =>
    Island.ground = new PIXI.TiledTexture(res.texture, 480, 240))
.add('cloud', 'images/Cloud.png', null, res =>
    Island.cloud = res.texture)
.add('cloudStart', 'images/CloudStart.png', null, res =>
    Island.cloudStart = res.texture);