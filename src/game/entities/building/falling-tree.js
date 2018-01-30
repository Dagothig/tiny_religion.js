import BuildingType from './building-type';

let FallingTree = new BuildingType({
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

    onFinished() { this.shouldRemove = true; }
});

export default FallingTree;