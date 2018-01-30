import BuildingType from './building-type';

let Temple = new BuildingType({
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
});

export default Temple;