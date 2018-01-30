import BuildingType from './building-type';

let GreenHouse = new BuildingType({
    name: 'greenHouse',
    path: 'images/GreenHouse.png',
    decal: { x: 0, y: 0, z: 16 },
    playerColored: false,
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
});

export default GreenHouse;