'use strict';

import SFX from '../sfx';
import { Explosion } from '../sfx/sfx-type'; 

class Building extends PIXI.Container {
    constructor(x, y, type, kingdom, island, finished = false) {
        super();

        this.type = type;
        this.kingdom = kingdom;
        this.island = island;
        this.buildTime = finished ? 0 : type.buildTime;
        this.finished = finished;
        this.exploded = 0;
        
        this.x = x;
        this.y = y;
        this._z = 0;
        if (Math.random() < 0.5) this.scale.x = -1;
        
        this.baseSprite = new PIXI.TiledSprite(type.texture);
        this.baseSprite.anchor.x = this.baseSprite.anchor.y = 0.5;
        this.baseSprite.x = -type.decal.x;
        this.baseSprite.y = -type.decal.y;
        this.addChild(this.baseSprite);
        
        if (this.type.playerColored) {
            this.colorSprite = new PIXI.TiledSprite(type.texture);
            this.colorSprite.tileX = 1;
            this.colorSprite.anchor.x = this.colorSprite.anchor.y = 0.5;
            this.colorSprite.x = -type.decal.x;
            this.colorSprite.y = -type.decal.y;
            this.addChild(this.colorSprite);
        }
        
        if (this.type.building) this.type.building.apply(this, arguments);
        this.updateTextureState();
    }
    get radius() { return this.type.radius; }
    get radius2() { return this.type.radius2; }
    get eco() { return this.type.eco; }
    get z() { return this._z + this.y + this.type.decal.z; }
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
        this.baseSprite.tileY = this.finished ? 1 : 0;
        if (this.colorSprite) {
            this.colorSprite.tileY = this.baseSprite.tileY;
            this.colorSprite.tint = this.kingdom.buildingTint;
        }
    }
    progressBuild(amount, game) {
        this.buildTime -= amount;
        if (this.buildTime <= 0) {
            this.kingdom.removeFromBuildingCount(this);
            this.finished = true;
            this.kingdom.addToBuildingCount(this);

            this.updateTextureState();
            this.kingdom.events.trigger('complete', { type: this.type, building: this });
            if (this.type.onFinished) this.type.onFinished.call(this);
        }
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

        this.baseSprite.tint = game.globalColor;

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
};

export default Building;