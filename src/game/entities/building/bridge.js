import BuildingType from './building-type';

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
            .concat(this.island.index + 1 < game.islands.count ?
                game.islands.get(this.island.index + 1).people.filter(filter) :
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
});

export default Bridge;