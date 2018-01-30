import sounds from '../../../sounds';
import Job from './job';

let Warrior = new Job('warrior', 'images/Warrior.png', {
	fightModifier: 1,
    update(delta, game) {
        let target = this.findTarget(game, 32 * 32, p => p.sinceTookDamage <= 0);
        if (!target) return;
        
        target.takeDamage((3 + this.kingdom.barracksCount) * this.type.fightModifier, game);
        sounds.hit.play();
        this.kingdom.events.trigger('fight', { warrior: this, target: target });
    }
});

export default Warrior;