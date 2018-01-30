import BuildingType from './building-type';
import SFX from '../sfx';
import { Sparkle } from '../sfx/sfx-type';

let BigTree = new BuildingType({
    name: 'bigTree',
    path: 'images/BigTree.png',
    decal: { x: 0, y: 45, z: 0 },
    playerColored: false,
    radius: 10,
    eco: -1,
    buildTime: 0,

    explode: {
        bounds: {
            left: -20,
            right: 20,
            top: -90,
            bottom: 10
        }
    },

    building() {
        this.grow = 1;
    },
    update(delta, game) {
        if (!this.finished) this.progressBuild(1, game);
        if (this.grow < 1) this.grow = Math.min(this.grow + 0.1, 1);
        if (Math.random() < 0.05)
            game.addChild(new SFX(
                Math.randRange(this.x - 32, this.x + 32),
                Math.randRange(this.y - 20, this.y - 92),
                Sparkle, 80));
    },
    render() {
        if (this.scale.x < 1 || this.grow < 1)
            this.scale.x = this.scale.y = this.grow;
        if (!this.finished)
            this.tint = 0xffffff;
    }
});

export default BigTree;