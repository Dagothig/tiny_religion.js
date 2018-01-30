import Island from './entities/island';

import House from './entities/building/house';
import Tree from './entities/building/tree';
import FallingTree from './entities/building/falling-tree';

import Person from './entities/person';
import Villager from './entities/person/villager';
import Warrior from './entities/person/warrior';
import Builder from './entities/person/builder';
import Priest from './entities/person/priest';

import { cloudBackCycle, cloudFrontCycle } from './consts'; 

class Islands {
	constructor(game) {
		this._backing = [];
		this.game = game;
		this.resolveIslBnds();
		this.initClouds();
	}

	initClouds() {
		// Cloud sprites
        this.cloudStartBack = new PIXI.OscillatingSprite(
            Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        this.cloudStartBack.z = -101;
        
        this.cloudStartFront = new PIXI.OscillatingSprite(
            Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        this.cloudStartFront.z = -99;

        this.cloudEndBack = new PIXI.OscillatingSprite(
            Island.cloudStartBack, cloudBackCycle, 0, 0, 0, 8);
        this.cloudEndBack.z = -101;
        
        this.cloudEndFront = new PIXI.OscillatingSprite(
            Island.cloudStartFront, cloudFrontCycle, 0, 0, 0, 8);
        this.cloudEndFront.z = -99;
        
        this.cloudEndBack.scale.x = this.cloudEndFront.scale.x = -1;
        
        this.cloudStartBack.anchor.x = this.cloudStartFront.anchor.x =
        this.cloudEndBack.anchor.x = this.cloudEndFront.anchor.x = 1;
		
        this.cloudStartBack.anchor.y = this.cloudStartFront.anchor.y =
        this.cloudEndBack.anchor.y = this.cloudEndFront.anchor.y = 0.275;

        this.game.addChild(
            this.cloudStartBack, this.cloudStartFront,
            this.cloudEndBack, this.cloudEndFront);
	}

	resolveIslBnds() {
		let island = new Island(0, 0, null);
		let bnds = island.getLocalBounds();
        this.islBnds = {
            left: bnds.left,
            top: bnds.top,
            right: bnds.right,
            bottom: bnds.bottom,
            width: bnds.width,
            height: bnds.height
        };
	}

    get width() {
        return this.count * this.islBnds.width;
    }

    get left() {
    	return this.islBnds.left;
    }

    get right() {
    	return this.islBnds.left + this.width + this.islBnds.right;
    }

    get count() {
    	return this._backing.length;
    }

    get(index) {
    	return this._backing[index];
    }

    render(renderer) {
    	this.cloudStartBack.tint = this.cloudStartFront.tint =
        this.cloudEndBack.tint = this.cloudEndFront.tint = 
        this.game.cloudColor;
    }

	add(island) {
        island.index = this.count;
        island.cloudBack.time = (island.index ?
            this._backing[island.index - 1].cloudBack.time:
            this.cloudStartBack.time) + 50;
        island.cloudFront.time = (island.index ?
            this._backing[island.index - 1].cloudFront.time:
            this.cloudStartFront.time) + 50;
        this.cloudEndBack.time = island.cloudBack.time + 50;
        this.cloudEndFront.time = island.cloudFront.time + 50;

        this._backing.add(island);
        this.game.addChild(island);
        if (island.buildings.length)
            this.game.addChild.apply(this.game, island.buildings);
        if (island.people.length)
            this.game.addChild.apply(this.game, island.people);
        this.updateClouds();
	}

	updateClouds() {
		this.cloudStartBack.x = this.cloudStartFront.x =
		this.islBnds.left;

		this.cloudEndBack.x = this.cloudEndFront.x =
        this.islBnds.width * (this.count - 1) + this.islBnds.right;
	}

	generateInitial(kingdom) {
		let island = new Island(this.width, 0, kingdom);
		island.generateBuilding(House, true);
		island.generatePlain();
		island.people.add(
			new Person(0, 0, Villager, kingdom, island),
	        new Person(0, 0, Villager, kingdom, island),
	        new Person(0, 0, Warrior, kingdom, island),
	        new Person(0, 0, Priest, kingdom, island),
	        new Person(0, 0, Builder, kingdom, island)
		);
		return this.add(island);
	}
	
	generateNewIsland() {
        if (Math.random() < 2 / (3 + this.count)) 
        	this.generateUninhabited();
        else 
        	this.generateInhabited();
    }
    
    generateInhabited(kingdom = this.game.ai) {
        let count = Math.random() * this.count;
        for (let i = 0; i < count; i++) {
            let island = new Island(this.width, 0, kingdom);
            if (i === 0) island.generateOutpost();
            else {
                let rnd = Math.random();
                if (rnd < 0.33) {
                    island.generateOutpost();
                } else if (rnd < 0.66) {
                    island.generateTemple();
                } else {
                    island.generateCity();
                }
            }
            if (i + 1 < count)
                island.generateBridge();
            this.add(island);
        }
    }
    
    generateUninhabited() {
        let island = new Island(this.width, 0, this.game.gaia);
        if (Math.random() < 0.5) island.generatePlain();
        else island.generateForest();
        this.add(island);
    }

    outputState() {
    	return this._backing.map(isl => isl.outputState());
    }
}
['find', 'findIndex', 'filter', 'forEach', 'map', 'reduce', 'slice'].forEach(f =>
	Islands.prototype[f] = function(...args) {
		return this._backing[f].apply(this._backing, args);
	});

export default Islands;