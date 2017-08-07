'use strict';

class Building extends PIXI.TiledSprite {
    constructor(x, y, type, kingdom, island, finished = false) {
        super(type.texture);
        this.x = x;
        this.y = y;
        this._z = 0;
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
    get eco() { return this.type.eco; }
    get z() { return this._z + this.y + this.type.decalZ; }
    set z(val) { this._z = val - this.y - this.type.decalZ; }

    isInRadius(o, radius) {
        radius = radius || o.radius;
        return radius ?
            Math.dst(this.x, this.y, o.x, o.y) < this.radius + radius :
            Math.dst2(this.x, this.y, o.x, o.y) < this.radius2;
    }
    changeKingdom(newKingdom) {
        this.kingdom.removeFromBuildingCount(this);
        this.kingdom = newKingdom;
        this.kingdom.addToBuildingCount(this);
        this.updateTextureState();
    }
    onAdd() { this.kingdom.addToBuildingCount(this); }
    onRemove() { this.kingdom.removeFromBuildingCount(this); }
    updateTextureState() {
        this.tileX = !this.type.playerColored || this.kingdom.isPlayer ? 0 : 1;
        this.tileY = this.finished ? 1 : 0;
    }
    progressBuild(amount, game) {
        this.buildTime -= amount;
        if (this.buildTime <= 0) {
            this.kingdom.removeFromBuildingCount(this);
            this.finished = true;
            this.kingdom.addToBuildingCount(this);

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
    explode(game) {
        var explosion = new SFX(this.x, this.y, Explosion);
        explosion.scale.x = explosion.scale.y = Math.bounded(
            (this.width / explosion.width + this.height / explosion.height) / 2,
            0.5, 1);
        game.addChild(explosion);
        this.exploded = true;
        this.explodeSpeedX = Math.randRange(-4, 4);
        this.explodeSpeedY = Math.randRange(6, 10);
        this.explodeDirection = Math.random() < 0.5 ? 0.4 : -0.4;
        if (this.kingdom.isPlayer)
            game.god.event(this.type.name, -0.5, this.position);
    }
    update(delta, game) {
        if (this.type.update) this.type.update.apply(this, arguments);
        if (this.exploded) {
            this.x += this.explodeSpeedX;
            this.y -= this.explodeSpeedY;
            this.z += this.explodeSpeedY;
            this.rotation += this.explodeDirection;
            this.alpha -= 0.02;
            if (this.alpha <= 0) this.shouldRemove = true;
        }
    }
    render(delta, game, renderer) {
        this.tint = game.globalColor;
        if (this.type.render) this.type.render.apply(this, arguments);
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
class BuildingType {
    constructor(
        name, path,
        decalX, decalY, decalZ,
        playerColored, radius, eco, buildTime, ext
    ) {
        Building.types.add(this);
        this.name = name;
        PIXI.loader.add(name, path, null,
            res => this.init(res.texture));
        this.decalX = decalX;
        this.decalY = decalY;
        this.decalZ = decalZ;
        this.playerColored = playerColored;
        this.radius = radius; this.radius2 = radius * radius
        this.eco = eco;
        this.buildTime = buildTime;
        Object.merge(this, ext || {});
    }
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture,
            this.playerColored ? texture.width / 2 : texture.width,
            texture.height / 2);
    }
}
let Bridge = new BuildingType(
    'bridge', 'images/Bridge.png', -10, -52, -30, false, 200, 0, 10000, {
        building() {
            this.island.bridge = this;
            this.scale.x = 1;
        }
    }),
House = new BuildingType(
    'house', 'images/House.png', 0, 0, 16, true, 20, 1/3, 2000),
Barracks = new BuildingType(
    'barracks', 'images/Barracks.png', 0, 0, 16, true, 30, 1/2, 10000),
Workshop = new BuildingType(
    'workshop', 'images/Workshop.png', 0, 0, 16, true, 30, 1, 10000),
Temple = new BuildingType(
    'temple', 'images/Temple.png', 0, 0, 16, true, 30, 1/2, 10000),
GreenHouse = new BuildingType(
    'greenHouse', 'images/GreenHouse.png', 0, 0, 16, true, 30, -1/6, 10000),
Tree = new BuildingType(
    'tree', 'images/Tree.png', 0, 5, 0, false, 10, -1/6, 1000, {
        building() {
            this.rotation = (Math.random() - 0.5) * Math.PI / 16;
            this.grow = 1;
        },
        update(delta, game) {
            if (!this.finished) this.progressBuild(1, game);
            if (this.grow < 1) this.grow = Math.min(this.grow + 0.1, 1);
        },
        render() {
            if (this.scale.x < 1 || this.grow < 1)
                this.scale.x = this.scale.y = this.grow;
        },
        notifyCompletion() { ui.notify('tree grown') }
    }),
FallingTree = new BuildingType(
    'fallingTree', 'images/FallingTree.png', 0, 5, 0, false, 10, 0, 120, {
        onFinished() { this.shouldRemove = true; },
        notifyCompletion() { ui.notify('stump removed') }
    }),
BigTree = new BuildingType(
    'bigTree', 'images/BigTree.png', 0, 45, 0, false, 10, -1, 0, {
        building() {
            this.grow = 1;
        },
        update(delta, game) {
            if (!this.finished) this.progressBuild(1, game);
            if (this.grow < 1) this.grow = Math.min(this.grow + 0.1, 1);
            if (Math.random() < 0.05)
                game.addChild(new SFX(
                    Math.randRange(this.x - 32, this.x + 32),
                    Math.randRange(this.y - 20, this.y - 92),
                    Sparkle, 80));
        },
        render() {
            if (this.scale.x < 1 || this.grow < 1)
                this.scale.x = this.scale.y = this.grow;
            if (!this.finished)
                this.tint = 0xffffff;
        }
    }),
Statue = new BuildingType(
    'statue', 'images/Statue.png', 0, 18, 3, false, 8, 1/4, 1000);