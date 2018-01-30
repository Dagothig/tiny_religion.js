import BuildingType from './building-type';

let Statue = new BuildingType({
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

export default Statue;