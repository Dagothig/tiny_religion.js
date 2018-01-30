import BuildingType from './building-type';

let Tree = new BuildingType({
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
    }
});

export default Tree;