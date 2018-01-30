import BuildingType from './building-type';

let House = new BuildingType({
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
});

export default House;