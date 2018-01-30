let buildingTypes = [];

class BuildingType {
    constructor(opts) {
        opts.radius2 = opts.radius * opts.radius;
        Object.merge(this, opts || {});

        buildingTypes.add(this);
        buildingTypes[this.name] = this;
        PIXI.loader.add(opts.name, opts.path, null, res => this.init(res.texture));
    }
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture,
            this.playerColored ? texture.width / 2 : texture.width,
            texture.height / 2);
    }
}

export default BuildingType;
export { buildingTypes };