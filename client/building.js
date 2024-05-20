'use strict';

class Building extends PIXI.TiledSprite {
    constructor(x, y, type, kingdom, island, finished = false) {
        super(type.texture);

        this.x = x;
        this.y = y;
        this._z = 0;
        if (Math.random() < 0.5) this.scale.x = -1;
        this.decal.x = this.texture.width / 2 + type.decal.x;
        this.decal.y = this.texture.height / 2 + type.decal.y;
        this.type = type;
        this.buildTime = finished ? 0 : type.buildTime;
        this.kingdom = kingdom;
        this.island = island;
        this.finished = finished;
        this.exploded = 0;
        if (this.type.building) this.type.building.apply(this, arguments);
        this.updateTextureState();
    }
    get radius() { return this.type.radius; }
    get radius2() { return this.type.radius2; }
    get eco() { return this.type.eco; }
    get z() { return this._z + this.y + this.type.decal.z; }
    set z(val) { this._z = val - this.y - this.type.decal.z; }

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
        else ui.notify(strs.msgs.built(this.type));
    }
    explode(game) {
        if (this.exploded) return;

        this.exploded = 1;
        this.filters = [this.ditherFilter = new PIXI.filters.DitherFilter()];

        if (this.kingdom.isPlayer)
            game.god.event(this.type.name, -0.5, this.position);

        if (this.type.explode && this.type.explode.start)
            this.type.explode.start.call(this, game);
    }
    updateCheckExplosion(delta, game) {
        let duration = this.type.explode && this.type.explode.duration || 40;
        if (this.exploded > duration) this.shouldRemove = true;

        let freq = this.type.explode && this.type.explode.freq || 6;
        if (!((this.exploded - 1) % freq)) {
            let bounds = this.type.explode && this.type.explode.bounds
                || this.getLocalBounds();

            let explosion = new SFX(
                this.x + Math.randRange(bounds.left, bounds.right),
                this.y + Math.randRange(bounds.top, bounds.bottom),
                Explosion);

            let minScale = this.type.explode
                && this.type.explode.scale
                && this.type.explode.scale.min
                || 0.25;

            let maxScale = this.type.explode
                && this.type.explode.scale
                && this.type.explode.scale.max
                || 0.75;

            let scale = Math.randRange(minScale, maxScale);

            explosion.scale.x = explosion.scale.y = scale;
            explosion.rotation = Math.randRange(0, Math.TWO_PI);
            game.addChild(explosion);
        }

        this.exploded++;
    }
    update(delta, game) {
        if (this.type.update) this.type.update.apply(this, arguments);
        if (this.exploded) this.updateCheckExplosion(delta, game);
    }
    render(delta, game, renderer) {
        let duration = this.type.explode && this.type.explode.duration || 60;
        if (this.exploded)
            this.ditherFilter.render(1 - this.exploded / duration);

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
    constructor(opts) {
        Building.types.add(this);

        opts.radius2 = opts.radius * opts.radius;
        Object.merge(this, opts || {});

        PIXI.loader.add(opts.name, opts.path, null, res => this.init(res.texture));
    }
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture,
            this.playerColored ? texture.width / 2 : texture.width,
            texture.height / 2);
    }
}
let Bridge = new BuildingType({
    name: 'bridge',
    path: 'images/Bridge.png',
    decal: { x: -10, y: -52, z: -30 },
    playerColored: false,
    radius: 200,
    eco: 0,
    buildTime: 10000,

    explode: {
        start(game) {
            let filter = p => this.isInRadius(p, -Bridge.radius / 2);
            this.island.people.filter(filter)
            .concat(this.island.index + 1 < game.islands.length ?
                game.islands[this.island.index + 1].people.filter(filter) :
                [])
            .forEach(p => p.die(game));
            this.island.bridge = null;
        },
        freq: 2,

        bounds: {
            left: -70,
            right: 70,
            top: -30,
            bottom: 30
        }
    },

    building() {
        this.island.bridge = this;
        this.scale.x = 1;
    }
}),
House = new BuildingType({
    name: 'house',
    path: 'images/House.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 20,
    eco: 1/3,
    buildTime: 2000,

    explode: {
        scale: {
            max: 0.5
        },
        freq: 8,
        bounds: {
            left: -20,
            right: 20,
            top: -30,
            bottom: 20
        }
    }
}),
Barracks = new BuildingType({
    name: 'barracks',
    path: 'images/Barracks.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: 1/2,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
Workshop = new BuildingType({
    name: 'workshop',
    path: 'images/Workshop.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: 1,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
Temple = new BuildingType({
    name: 'temple',
    path: 'images/Temple.png',
    decal: { x: 0, y: 0, z: 16},
    playerColored: true,
    radius: 30,
    eco: 1/2,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -30,
            right: 30,
            top: -30,
            bottom: 20
        }
    }
}),
GreenHouse = new BuildingType({
    name: 'greenHouse',
    path: 'images/GreenHouse.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: true,
    radius: 30,
    eco: -1/6,
    buildTime: 10000,

    explode: {
        bounds: {
            left: -20,
            right: 20,
            top: -30,
            bottom: 20
        }
    }
}),
Tree = new BuildingType({
    name: 'tree',
    path: 'images/Tree.png',
    decal: { x: 0, y: 5, z: 0 },
    playerColored: false,
    radius: 10,
    eco: -1/6,
    buildTime: 1000,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    },

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
    notifyCompletion() { ui.notify(strs.msgs.treeGrown) }
}),
FallingTree = new BuildingType({
    name: 'fallingTree',
    path: 'images/FallingTree.png',
    decal: { x: 0, y: 5, z: 0 },
    playerColored: false,
    radius: 10,
    eco: 0,
    buildTime: 120,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    },

    onFinished() { this.shouldRemove = true; },
    notifyCompletion() { ui.notify(strs.msgs.stumpRemoved) }
}),
BigTree = new BuildingType({
    name: 'bigTree',
    path: 'images/BigTree.png',
    decal: { x: 0, y: 45, z: 0 },
    playerColored: false,
    radius: 10,
    eco: -1,
    buildTime: 0,

    explode: {
        bounds: {
            left: -20,
            right: 20,
            top: -90,
            bottom: 10
        }
    },

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
Statue = new BuildingType({
    name: 'statue',
    path: 'images/Statue.png',
    decal: { x: 0, y: 18, z: 3 },
    playerColored: false,
    radius: 8,
    eco: 1/4,
    buildTime: 1000,

    explode: {
        scale: {
            min: 0.25,
            max: 0.5
        },
        duration: 20,
        freq: 9,
        bounds: {
            left: -10,
            right: 10,
            top: -35,
            bottom: 5
        }
    }
});
