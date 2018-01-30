import Person from './';
import Job from './job';
import SFX from '../sfx';
import { Sparkle } from '../sfx/sfx-type';
import FallingTree from '../building/falling-tree';

let Villager = new Job('villager', 'images/Villager.png', {
    person() { this.sinceBaby = 0; },
    update(delta, game) {
        this.sinceBaby++;
        if (this.island.kingdom !== this.kingdom) return;
        this.island.buildings
        .filter(b =>
            b.type === FallingTree 
            && !b.finished
            && b.isInRadius(this, 10))
        .forEach(b => b.progressBuild(1, game));
    },
    doBaby(game) {
        if (this.kingdom.housed) return;
        if (Math.random() * 3000 >= this.sinceBaby) return;
        
        this.sinceBaby = 0;
        let baby = new Person(this.x, this.y, Villager, this.kingdom, this.island);
        game.addChild(baby, new SFX(this.x, this.y, Sparkle));
        this.island.people.add(baby);
        this.kingdom.events.trigger('baby', { parent: this, baby: baby });
        return baby;
    },
    outputState() { return { sinceBaby: this.sinceBaby }; },
    readState(state, game) { this.sinceBaby = state.sinceBaby; }
});

export default Villager;