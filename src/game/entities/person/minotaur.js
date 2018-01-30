import Job from './job';

import Warrior from './warrior'; 

let Minotaur = new Job('minotaur', 'images/Minotaur.png', {
    person() {
        this.decal.x = 6;
        this.decal.y = 14;
    },
    init(texture) {
        this.texture = new PIXI.TiledTexture(texture, 12, 16);
    },
    fightModifier: 2,
    update(delta, game) {
        if (this.health < 200) this.health += 0.025;
        Warrior.update.apply(this, arguments);
    }
});

export default Minotaur;