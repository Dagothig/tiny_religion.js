import Person from './';
import Job from './job';
import Villager from './villager';
import SFX from '../sfx';
import { Summon } from '../sfx/sfx-type';

let Priest = new Job('priest', 'images/Priest.png', {
    person() { this.sinceSummon = 0; },
    update(delta, game) {
        this.sinceSummon++;
        let target = this.findTarget(game, 48 * 48);
        if (!target) return;
        
        this.kingdom.events.trigger('converting', { priest: this, target: target });
        if (Math.random() * 1500 >= 3 + this.kingdom.templeCount) return;
        
        var oldKingdom = target.kingdom;
        target.changeKingdom(this.kingdom);
        game.addChild(new SFX(target.x, target.y, Summon));
        this.kingdom.events.trigger('convert', { 
            priest: this, 
            target: target, 
            oldKingdom: oldKingdom 
        });
    },
    doSummon(game) {
        if (this.kingdom.templed) return;
        if (Math.random() * 5000 >= this.sinceSummon) return;

        this.sinceSummon = 0;
        let summon = new Person(this.x, this.y, Villager, this.kingdom, this.island, true);
        game.addChild(summon, new SFX(this.x, this.y, Summon));
        this.island.people.add(summon);
        this.kingdom.events.trigger('summon', { priest: this, summon: summon });
        return summon;
    },
    outputState() { return { sinceSummon: this.sinceSummon }; }
});

export default Priest;