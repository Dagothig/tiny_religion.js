'use strict';

import SFX from '../sfx';
import { Blood } from '../sfx/sfx-type';
import sounds from '../../../sounds';

class Person extends PIXI.AnimatedSprite {
    constructor(x, y, job, kingdom, island, isSummon = false) {
        super(job.texture, 10, true);
        this.decal = { x: 4, y: 10 };
        this.x = x;
        this.y = y;
        this.job = job;

        this.health = 100;
        this.sinceTookDamage = 0;
        this.praying = 0;
        this.speed = 0.25;
        this.target = null;
        this.movements = [];

        this.island = island;
        this.kingdom = kingdom;
        this.isSummon = isSummon;
    }
    get z() { return this.y; }

    get targetReached() {
        return Math.dst(this.x, this.y, this.target.x, this.target.y) < this.speed;
    }

    get job() { return this._job; }
    set job(job) {
        this._job = job;
        this.setTiledTexture(job.texture);
        if (job.person) job.person.apply(this, arguments);
    }

    takeDamage(amount, game) {
        this.health -= amount;
        this.sinceTookDamage = 10;
        if (this.health <= 0) this.die(game);
    }
    die(game) {
        this.shouldRemove = true;
        game.addChild(new SFX(this.x, this.y, Blood));
        sounds.death.play();
    }
    changeKingdom(newKingdom) {
        this.kingdom.removeFromPersonCount(this);
        this.kingdom = newKingdom;
        this.kingdom.addToPersonCount(this);
    }
    onAdd() { this.kingdom.addToPersonCount(this); }
    onRemove() { this.kingdom.removeFromPersonCount(this); }
    changeJob(newJob) {
        this.kingdom.removeFromPersonCount(this);
        this.job = newJob;
        this.kingdom.addToPersonCount(this);
    }

    update(delta, game) {
        if (this.health < 100) this.health += 0.025;
        if (this.sinceTookDamage > 0) this.sinceTookDamage--;
        if (this.praying > 0) {
            this.praying--;
            this.tileX = 0;
            return;
        }

        if (this.job.update.apply(this, arguments)) return;

        // Movement
        let dstToTarget = 0;
        if (!this.target ||
            (this.x === this.target.x && this.y === this.target.y)
        ) {
            // Switch island
            if (this.target && this.island !== this.target.island) {
                this.island.people.remove(this);
                this.island = this.target.island;
                this.island.people.add(this);
            }

            // Ensure that the next target (if there is one) is accessible
            let newIsland = this.movements.length && this.movements[0].island;
            if (newIsland && newIsland !== this.island) {
                // Ensure that there is a bridge
                let bridge =
                    (this.island.index < newIsland.index ?
                        this.island : newIsland)
                    .bridge;
                if (!bridge || !bridge.finished)
                    this.movements = [];
            }

            // Ensure that there is a next target
            if (!this.movements.length) this.findNextTarget(game);

            // Setup movement
            this.speed = (Math.random() + 1) / 4;
            this.target = this.movements.shift();
            dstToTarget = Math.dst(this.x, this.y, this.target.x, this.target.y);
            let ratio = this.speed / dstToTarget;
            this.movX = (this.target.x - this.x) * ratio,
            this.movY = (this.target.y - this.y) * ratio;
        }
        else dstToTarget = Math.dst(this.x, this.y, this.target.x, this.target.y);

        if (dstToTarget < this.speed) {
            this.x = this.target.x;
            this.y = this.target.y;
        } else {
            this.x += this.movX;
            this.y += this.movY;
        }

        super.update(delta);
    }
    render(delta, game, renderer) {
        this.tileY = Math.abs(this.movX) > Math.abs(this.movY) ?
            (this.movX > 0 ? this.tileY = 1 : this.tileY = 2) :
            (this.movY > 0 ? this.tileY = 3 : this.tileY = 4);
        this.tint = this.sinceTookDamage > 4 ? 0xffffff : this.kingdom.personTint;
    }
    findNextTarget(game) {
        if (this.job.findNextTarget.call(this, game)) return;
        this.movements.push(this.island.getRandomPoint());
        if (Math.random() < 0.25)
            this.moveTo(game.islands, (Math.random() * game.islands.count)|0);
    }
    moveTo(islands, index) {
        let start = (this.movements.last || this).island;
        let dir = Math.sign(index - start.index);
        for (let i = start.index; i !== index; i += dir) {
            let prev = islands.get(i), next = islands.get(i+dir);
            let bridge = (dir > 0 ? prev : next).bridge;
            if (!bridge || !bridge.finished) return;
            this.movements.push({
                x: bridge.x - dir * 90,
                y: bridge.y + Math.randRange(-15, 5),
                island: prev
            }, {
                x: bridge.x,
                y: bridge.y + Math.randRange(-15, 5),
                island: next
            }, {
                x: bridge.x + dir * 90,
                y: bridge.y + Math.randRange(-15, 5),
                island: next
            });
        }
    }

    targetForIsland(dst2, filter, island) {
        for (let i = island.people.length; i--;) {
            let p = island.people[i];
            if (p.kingdom !== this.kingdom
                && (!filter || filter(p))
                && Math.dst2(this.x, this.y, p.x, p.y) < dst2
            ) return p;
        }
        return null;
    }
    findTarget(game, dst2, filter) {
        let target = this.targetForIsland(dst2, filter, this.island);
        if (target) return target;

        let toIsland = this.x - this.island.x;
        if (toIsland > 150 && this.island.index + 1 < game.islands.count)
            return this.targetForIsland(
                dst2, filter, game.islands.get(this.island.index + 1));
        else if (toIsland < -150 && this.island.index - 1 >= 0)
            return this.targetForIsland(
                dst2, filter, game.islands.get(this.island.index - 1));
    }

    pray() {
        return this.praying <= 0 && (this.praying = Math.random() * 50 + 75);
    }

    outputState() {
        return Object.merge({
            x: this.x,
            y: this.y,
            job: this.job.name,
            health: this.health,
            isSummon: this.isSummon,
            sinceTookDamage: this.sinceTookDamage,
            praying: this.praying,
            speed: this.speed,
            movX: this.movX,
            movY: this.movY,
            target: this.target && {
                x: this.target.x,
                y: this.target.y,
                island: this.target.island.index
            },
            movements: this.movements.map(m => ({
                x: m.x,
                y: m.y,
                island: m.island.index
            })),
            kingdom: this.kingdom.name
        }, this.job.outputState && this.job.outputState.apply(this, arguments));
    }
    resolveIndices(game) {
        if (this.target)
            this.target.island = game.islands.get(this.target.island);
        this.movements.forEach(m => m.island = game.islands.get(m.island));
        this.job.resolveIndices && this.job.resolveIndices.apply(this, arguments);
    }
}
Person.fromState = function(s, island, game) {
    let job = jobs[s.job], kingdom = game[s.kingdom];
    let p = new Person(s.x, s.y, job, kingdom, island, s.isSummon);
    p.health = s.health;
    p.sinceTookDamage = s.sinceTookDamage;
    p.praying = s.praying;
    p.speed = s.speed;
    p.movX = s.movX;
    p.movY = s.movY;
    p.target = s.target && {
        x: s.target.x, y: s.target.y,
        island: s.target.island
    };
    p.movements = s.movements.map(m => ({ x: m.x, y: m.y, island: m.island }));
    p.job.readState && p.job.readState.apply(p, arguments);
    return p;
};

export default Person;