import Job from './job';

import Tree from '../building/tree';
import FallingTree from '../building/falling-tree';
import Bridge from '../building/bridge';

let Builder = new Job('builder', 'images/Builder.png', {
    update(delta, game) {
        if (this.building && this.building.finished) this.building = null;
        if (this.island.kingdom !== this.kingdom) return;
        this.island.buildings
        .filter(b =>
            b.type !== FallingTree 
            && b.type !== Tree 
            && !b.finished
            && b.isInRadius(this, 10))
        .forEach(b => b.progressBuild(3 + this.kingdom.workshopCount, game));
    },
    findNextTarget(game) {
        if (!this.building || this.building.finished) return;
        this.moveTo(game.islands, this.building.island.index);
        let x = Math.randRange(-1, 1) * this.building.radius * 0.75;
        let y = Math.randRange(-1, 1) * this.building.radius * 0.75;
        if (this.building.type === Bridge) {
            x /= 4; 
            y /= 4;
            x -= 100;
        }
        // TODO; clamp movement inside island
        this.movements.push({
            x: this.building.x + x,
            y: this.building.y + y,
            island: this.building.island
        });
        return true;
    },
    outputState() {
        return this.building && {
            building: {
                index: this.building.island.buildings.indexOf(this.building),
                island: this.building.island.index
            }
        };
    },
    readState(state, game) {
        this.building = state.building;
    },
    resolveIndices(game) {
        if (this.building) this.building =
            game.islands(this.building.island).buildings[this.building.index];
    }
});

export default Builder;