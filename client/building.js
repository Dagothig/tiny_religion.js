'use strict';

class BuildingType {
    constructor(
        name, path, decalX, decalY, decalZ, playerColored, radius, buildTime, ext
    ) {
        this.name = name;
        Building.types.add(this);
        PIXI.loader.add(name, path, null,
            res => this.init(res.texture));
        this.decalX = decalX;
        this.decalY = decalY;
        this.decalZ = decalZ;
        this.playerColored = playerColored;
        this.radius = radius; this.radius2 = radius * radius
        this.buildTime = buildTime;
        if (ext) Object.merge(this, ext);
    }
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture,
            this.playerColored ? texture.width / 2 : texture.width,
            texture.height / 2);
    }
}
class Building extends PIXI.TiledSprite {
    constructor(x, y, type, kingdom, island, finished = false) {
        super(type.texture);
        this.x = x;
        this.y = y;
        if (Math.random() < 0.5) this.scale.x = -1;
        this.decal.x = this.texture.width / 2 + type.decalX;
        this.decal.y = this.texture.height / 2 + type.decalY;
        this.type = type;
        this.buildTime = finished ? 0 : type.buildTime;
        this.kingdom = kingdom;
        this.island = island;
        this.finished = finished;
        if (this.type.building) this.type.building.apply(this, arguments);
        this.updateTextureState();
    }
    get radius() { return this.type.radius; }
    get radius2() { return this.type.radius2; }
    get z() { return this.y + this.type.decalZ; }

    isInRadius(o, radius) {
        radius = radius || o.radius;
        return radius ?
            Math.dst(this.x, this.y, o.x, o.y) < this.radius + radius :
            Math.dst2(this.x, this.y, o.x, o.y) < this.radius2;
    }
    updateTextureState() {
        this.tileX = !this.type.playerColored || this.kingdom.isPlayer ? 0 : 1;
        this.tileY = this.finished ? 1 : 0;
    }
    progressBuild(amount, game) {
        this.buildTime -= amount;
        if (this.buildTime <= 0) {
            this.finished = true;
            this.updateTextureState();
            if (this.kingdom.isPlayer) {
                game.god.event(this.type.name, 0.5, this.position);
                this.notifyCompletion();
                sounds.done.play();
            }
            if (this.type.onFinished) this.type.onFinished.call(this);
        }
    }
    notifyCompletion() {
        if (this.type.notifyCompletion) this.type.notifyCompletion.call(this);
        else ui.notify(this.type.name + ' built');
    }
    update(delta, game) {
        if (this.type.update) this.type.update.apply(this, arguments);
    }
    render(delta, game, renderer) {
        this.tint = game.globalColor;
    }
    outputState() {
        return {
            x: this.x,
            y: this.y,
            type: this.type.name,
            kingdom: this.kingdom.name,
            buildTime: this.buildTime,
            finished: this.finished
        };
    }
    resolveIndices(game) {}
}
Building.fromState = function(s, island, game) {
    let type = Building.types.find(t => t.name === s.type);
    let kingdom = game[s.kingdom];
    let b = new Building(s.x, s.y, type, kingdom, island, s.finished);
    b.finished = s.finished;
    return b;
}
Building.types = [];
let Bridge = new BuildingType(
    'bridge', 'images/Bridge.png', -10, -52, -30, false, 200, 10000, {
        building() {
            this.island.bridge = this;
            this.scale.x = 1;
        }
    }),
House = new BuildingType(
    'house', 'images/House.png', 0, 0, 16, true, 20, 2000),
Barracks = new BuildingType(
    'barracks', 'images/Barracks.png', 0, 0, 16, true, 30, 10000),
Workshop = new BuildingType(
    'workshop', 'images/Workshop.png', 0, 0, 16, true, 30, 10000),
Temple = new BuildingType(
    'temple', 'images/Temple.png', 0, 0, 16, true, 30, 10000),
GreenHouse = new BuildingType(
    'greenHouse', 'images/GreenHouse.png', 0, 0, 16, true, 30, 10000),
Tree = new BuildingType(
    'tree', 'images/Tree.png', 0, 4, 0, false, 10, 1000, {
        building() {
            this.rotation = (Math.random() - 0.5) * Math.PI / 16;
        },
        update(delta, game) {
            if (!this.finished)
                this.progressBuild(1, game);
        },
        notifyCompletion() { ui.notify('tree grown') }
    }),
FallingTree = new BuildingType(
    'fallingTree', 'images/FallingTree.png', 0, 4, 0, false, 10, 250, {
        onFinished() { this.shouldRemove = true; },
        notifyCompletion() { ui.notify('stump removed') }
    });