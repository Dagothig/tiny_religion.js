let jobs =  [];

class Job {
    constructor(name, path, ext) {
        this.name = name;
        jobs.add(this);
        jobs[name] = this;
        PIXI.loader.add(name, path, null, res => this.init(res.texture));
        Object.merge(this, ext);
    }
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture, 8, 12);
    }
    update() {}
    findNextTarget() {}
    outputState() {}
    resolveIndices() {}
}

export default Job;
export { jobs };