'use strict';

class Island extends PIXI.Container {
    constructor(x, y, kingdom) {
        super();
        this.x = x;
        this.y = y;
        this.ground = new PIXI.TiledSprite(Island.ground);
        this.cloud = new PIXI.Sprite(Island.cloud);
        this.ground.anchor.x = this.cloud.anchor.x = 0.5;
        this.ground.anchor.y = this.cloud.anchor.y = 0.3;
        this.addChild(this.ground, this.cloud);
        this.buildings = [];
        this.people = [];
        this.kingdom = kingdom;

        this.zoneWidth = 300;
        this.zoneHeight = 120;
    }
    get z() { return -100; }

    generateBuilding(type, finished = true, radius = type.radius, attempts = 200) {
        for (let i = 0; i < attempts; i++) {
            let pos = this.getRandomPoint(radius);
            if (this.buildings.find(b =>
                b.isInRadius(pos, radius))) continue;
            let b = new Building(pos.x, pos.y, type, this.kingdom, this, finished);
            this.buildings.add(b);
            return b;
        }
    }
    generateTrees(n = Math.pow(Math.random(), 3) * 40) {
        for (let i = 0; i < n; i++) {
            this.generateBuilding(
                Math.random() < 0.90 ? Tree : FallingTree,
                Math.random() < 0.75,
                Tree.radius * 0.5
            );
        }
    }
    generateOutpost() {
        let houses = Math.random() * 3;
        let barracks = Math.random() * 2;
        let vils = (Math.random() + 0.5) * (5 + houses * 5) / 2;
        for (let i = 0; i < houses; i++)
            this.generateBuilding(House);
        for (let i = 0; i < barracks; i++)
            this.generateBuilding(Barracks);
        for (let i = 0; i < vils; i++) {
            let job = Person.jobs[(Math.random() * Person.jobs.length)|0];
            this.people.add(new Person(this.x, this.y, job, this.kingdom, this));
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
    Island.cloud = res.texture);