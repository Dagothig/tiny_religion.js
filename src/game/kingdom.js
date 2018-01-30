'use strict';

import strs from '../strs';

import { jobs } from './entities/person/job';
import { buildingTypes } from './entities/building/building-type';

import Building from './entities/building';
import Bridge from './entities/building/bridge';
import Tree from './entities/building/tree';
import FallingTree from './entities/building/falling-tree';

import Villager from './entities/person/villager';
import Builder from './entities/person/builder';
import Priest from './entities/person/priest';
import Warrior from './entities/person/warrior';
import Minotaur from './entities/person/minotaur';

import SFX from './entities/sfx';
import { Summon } from './entities/sfx/sfx-type';

class EventTarget {
    constructor() {
        this.backing = {};
    }

    for(name, createIfNotFound = false) {
        return (this.backing[name] || (this.backing[name] = []));
    } 
    on(name, listener) {
        this.for(name, true).push(listener);
        return this;
    }   
    trigger(name, argument) {
        this.for(name).forEach(listener => listener(argument));
    }
    add(name, listener) {
        this.on(name, listener);
    }
    remove(name, listener) {
        this.for(name).remove(listener);
    }
}

class Kingdom {
    constructor(name, tint) {
        this.name = name;
        this.tint = tint;
        this.personTint = this.tint;
        this.buildingTint = PIXI.Color.interpolate(this.tint, 0xffffff, 0.15);
        this.events = new EventTarget();

        let resetCount = x => this[x.name + 'Count'] = 0;

        this.islandCount = 0;
        this.unfinished = 0;
        this.growing = 0;
        buildingTypes.forEach(resetCount);
        this.peopleCount = 0;
        this.summonCount = 0;
        jobs.forEach(resetCount);

        let personCount = amount => x =>
            x.kingdom === this && (
            (x.isSummon ? this.summonCount += amount : this.peopleCount += amount),
            this[x.job.name + 'Count'] += amount);
        this.addToPersonCount = personCount(1);
        this.removeFromPersonCount = personCount(-1);

        let buildingCount = amount => x =>
            x.finished ? this[x.type.name + 'Count'] += amount :
            x.type === Tree ? this.growing += amount :
            x.type !== FallingTree ? this.unfinished += amount :
            null;
        this.addToBuildingCount = buildingCount(1);
        this.removeFromBuildingCount = buildingCount(-1);

        let islandCount = amount => x => this.islandCount += amount;
        this.addToIslandCount = islandCount(1);
        this.removeFromIslandCount = islandCount(-1);
    }

    count(game) {
        this.islandCount = 0;
        this.unfinished = 0;
        this.growing = 0;
        buildingTypes.forEach(this.resetCount);
        this.peopleCount = 0;
        this.summonCount = 0;
        jobs.forEach(this.resetCount);
        game.islands.forEach(island => {
            island.people.forEach(this.addToPersonCount);
            if (island.kingdom !== this) return;
            this.islandCount++;
            island.buildings.forEach(this.addToBuildingCount);
        });
    }

    linkedTo(game, other) {
        for (let i = 0; i < game.islands.count - 1; i++) {
            let j = i+1;
            let islI = game.islands.get(i), islJ = game.islands.get(j);
            if (islI.bridge && islI.bridge.finished && (
                (islI.kingdom === this && islJ.kingdom === other) ||
                (islI.kingdom === other && islJ.kingdom === this))
            ) return true;
        }
        return false;
    }

    findOfJob(game, job, filter) {
        for (let i = 0; i < game.islands.count; i++) {
            let island = game.islands.get(i);
            for (let j = 0; j < island.people.length; j++) {
                let person = island.people[j];
                if (person.kingdom === this
                    && person.job === job
                    && (!filter || filter(person))
                ) return person;
            }
        }
    }

    build(game, type, skipChecks = false) {
        if (!skipChecks && this.builded) return strs.msgs.builded;
        let isls = game.islands.slice(0).sort(() => Math.random() - 0.5);
        for (let i = 0; i < isls.length; i++) {
            let isl = isls[i];
            if (isl.kingdom !== this) continue;
            let building = isl.generateBuilding(type, false);
            if (!building) continue;
            game.addChild(building);
            for (let j = 0; j < 3; j++) {
                let person = this.findOfJob(game, Builder, p => !p.building);
                if (!person) break;
                person.building = building;
                person.movements.length = 0;
            }
            this.events.trigger('build', { building: building, type: type });
            return strs.msgs.building(type);
        }
        return strs.msgs.noSpot;
    }

    buildBridge(game, skipChecks = false) {
        if (!skipChecks && this.builded) return strs.msgs.builded;
        let index = game.islands.findIndex(i => !i.bridge && i.kingdom === this);
        let island = game.islands.get(index);
        if (!island) return strs.msgs.noIsland;

        let bridge = island.generateBridge(false);
        game.addChild(bridge);
        if (index === game.islands.count - 1) game.islands.generateNewIsland();

        for (let j = 0; j < 3; j++) {
            let person = this.findOfJob(game, Builder, p => !p.building);
            if (!person) break;
            person.building = bridge;
            person.movements.length = 0;
        }
        this.events.trigger('build', { building: bridge, type: Bridge });
        return strs.msgs.building(bridge.type);
    }

    forestate(game, skipChecks = false) {
        if (!skipChecks && this.growed) return strs.msgs.growed;
        for (let i = 0; i < game.islands.count * 3; i++) {
            let island = game.islands.rand();
            if (island.kingdom !== this) continue;
            let tree = island.generateBuilding(Tree, false);
            if (!tree) continue;
            game.addChild(tree);
            this.events.trigger('build', { building: tree, type: Tree });
            return strs.msgs.planting;
        }
        return strs.msgs.noSpot;
    }
    deforest(game) {
        let islands = game.islands.filter(island => island.kingdom === this);
        if (!this.treeCount) return strs.msgs.noTree;
        let trees = null, island = null, maxTries = 10000;
        while (!trees || !trees.length) {
            island = islands.get((Math.random() * islands.count)|0);
            trees = island.buildings.filter(b => b.type === Tree && b.finished);
            if (!maxTries--) return strs.msgs.treeNotFound;
        }
        if (!trees || !trees.length) return strs.msgs.treeNotFound;
        let tree = trees[(Math.random() * trees.length)|0];
        tree.shouldRemove = true;
        let felled = new Building(tree.x, tree.y, FallingTree, this, island);
        game.addChild(felled);
        island.buildings.add(felled);
        this.events.trigger('build', { building: felled, type: FallingTree });
        return strs.msgs.treeFelled;
    }
    train(game, job) {
        let person = this.findOfJob(game, Villager);
        if (person) {
            game.addChild(new SFX(person.x, person.y, Summon));
            person.changeJob(job);
            this.events.trigger('train', { person: person, job: job });
            return strs.msgs.trained(job);
        }
        return strs.msgs.villagerNotFound;
    }
    untrain(game, job) {
        let person = this.findOfJob(game, job);
        if (!person) return strs.msgs.jobNotFound(job);

        game.addChild(new SFX(person.x, person.y, Summon));
        person.changeJob(Villager);
        this.events.trigger('untrain', { person: person, job: job });
        return strs.msgs.untrained(job);
    }
    doBaby(game, skipChecks = false) {
        if (!skipChecks && this.housed) return strs.msgs.housed;
        return game.islands.find(island =>
            island.people.find(person =>
                person.kingdom === this && 
                person.job === Villager &&
                Villager.doBaby.call(person, game)))
            ? strs.msgs.babyMade
            : strs.msgs.babyAttempted;
    }
    attemptSummon(game, skipChecks = false) {
        if (!skipChecks && this.templed) return strs.msgs.templed;
        return game.islands.find(island =>
            island.people.find(person =>
                person.kingdom === this && 
                person.job === Priest &&
                Priest.doSummon.call(person, game)))
            ? strs.msgs.summonDone
            : strs.msgs.summonAttempted;
    }
    pray(game) {
        let c = 0, p;
        game.islands.forEach(island =>
            island.people.forEach(person =>{
                if (person.kingdom !== this) return;
                if (person.pray()) {
                    c++;
                    if (!p) p = person;
                }
            }));
        if (c) this.events.trigger('pray', { count: c, position: p.position });
        return strs.msgs.praying;
    }
    sendAttack(game) {
        let mean = game.islands.filter(isl => isl.kingdom !== this).rand();
        if (!mean) return strs.msgs.noEnemy;
        game.islands.forEach(island =>
            island.kingdom === this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                (person.job === Warrior || person.job === Minotaur) &&
                person.moveTo(game.islands, mean.index)));
        return strs.msgs.attacking;
    }
    sendConvert(game) {
        let mean = game.islands.filter(isl => isl.kingdom !== this).rand();
        if (!mean) return strs.msgs.noEnemy;
        game.islands.forEach(island =>
            island.kingdom === this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                person.job === Priest &&
                person.moveTo(game.islands, mean.index)));
        return strs.msgs.converting;
    }
    sendRetreat(game) {
        let ally = game.islands.filter(isl => isl.kingdom === this).rand();
        if (!ally) return strs.msgs.noRetreat;
        game.islands.forEach(island =>
            island.kingdom !== this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                person.moveTo(game.islands, ally.index)));
        return strs.msgs.retreating;
    }

    get maxPop() {
        return (this.islandCount * 5
            + this.houseCount * 5
            + this.treeCount / 4
            + this.bigTreeCount * 5)|0;
    }
    get housed() { return this.peopleCount >= this.maxPop; }
    get maxSummon() { return this.templeCount * 5 + 5; }
    get templed() { return this.summonCount >= this.maxSummon; }
    get maxUnfinished() { return Math.floor(this.islandCount / 2 + 1); }
    get builded() { return this.unfinished >= this.maxUnfinished; }
    get maxGrow() {
        return (this.greenHouseCount * 2
            + this.bigTreeCount * 2
            + 2);
    }
    get growed() { return this.growing >= this.maxGrow; }
}

export default Kingdom;