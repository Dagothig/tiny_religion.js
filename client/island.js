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

        this.zoneWidth = 320;
        this.zoneHeight = 120;

        this.generateTrees();
    }
    get z() { return -100; }

    generateTrees() {
        for (let i = 0, n = Math.pow(Math.random(), 4) * 30; i < n; i++) {
            let pos = this.getRandomPoint(Tree.radius);
            if (this.buildings.find(b => b.isInRadius(pos, Tree.radius))) continue;
            let tree = new Building(pos.x, pos.y, Tree, this.kingdom, this, true);
            this.buildings.add(tree);
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

        this.buildings = this.buildings.filter(p => !p.shouldRemove);
    }

    changeKingdom(newKingdom) {
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