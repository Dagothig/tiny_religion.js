'use strict';

class Kingdom {
    constructor(name, tint, isPlayer) {
        this.name = name;
        this.tint = tint;
        this.isPlayer = isPlayer;
        this.resetCount = x => this[x.name + 'Count'] = 0;
        this.addToPersonCount = x => {
            if (x.kingdom !== this) return;
            if (x.isSummon) this.summonCount++;
            else this.peopleCount++;
            this[x.job.name + 'Count']++;
        };
        this.addToBuildingCount = x =>
            x.finished ? this[x.type.name + 'Count']++ :
            x.type === Tree ? this.growing++ :
            x.type !== FallingTree ? this.unfinished++ :
            null;
    }

    count(game) {
        this.islandCount = 0;
        this.unfinished = 0;
        this.growing = 0;
        Building.types.forEach(this.resetCount);
        this.peopleCount = 0;
        this.summonCount = 0;
        Person.jobs.forEach(this.resetCount);
        game.islands.forEach(island => {
            island.people.forEach(this.addToPersonCount);
            if (island.kingdom !== this) return;
            this.islandCount++;
            island.buildings.forEach(this.addToBuildingCount);
        });
    }

    linkedTo(game, other) {
        for (let i = 0; i < game.islands.length - 1; i++) {
            let j = i+1;
            let islI = game.islands[i], islJ = game.islands[j];
            if (islI.bridge && islI.bridge.finished && (
                (islI.kingdom === this && islJ.kingdom === other) ||
                (islI.kingdom === other && islJ.kingdom === this))
            ) return true;
        }
        return false;
    }

    findOfJob(game, job, filter) {
        for (let i = 0; i < game.islands.length; i++) {
            let island = game.islands[i];
            for (let j = 0; j < island.people.length; j++) {
                let person = island.people[j];
                if (person.kingdom === this
                    && person.job === job
                    && (!filter || filter(person))
                ) return person;
            }
        }
    }

    build(game, type) {
        if (this.builded) return 'project limit reached';
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
            if (this.isPlayer) {
                game.god.event(type.name, 0.5, building.position);
                sounds.build.play();
            }
            return 'building ' + building.type.name;
        }
        return 'no suitable spot found';
    }

    buildBridge(game) {
        if (this.builded) return 'project limit reached';
        let index = game.islands.findIndex(i => !i.bridge && i.kingdom === this);
        let island = game.islands[index];
        if (!island) return 'island not owned';
        let bridge = island.generateBridge(false);
        game.addChild(bridge);
        if (index === game.islands.length - 1) game.generateNewIsland();
        for (let j = 0; j < 3; j++) {
            let person = this.findOfJob(game, Builder, p => !p.building);
            if (!person) break;
            person.building = bridge;
            person.movements.length = 0;
        }
        if (this.isPlayer) {
            game.god.event(Bridge.name, 0.5, bridge.position);
            sounds.build.play();
        }
        return 'project started';
    }

    forestate(game) {
        if (this.growed)
            return 'sapling limit reached';
        for (let i = 0; i < game.islands.length * 3; i++) {
            let island = game.islands.rand();
            if (island.kingdom !== this) continue;
            let tree = island.generateBuilding(Tree, false);
            if (!tree) continue;
            game.addChild(tree);
            if (this.isPlayer) {
                game.god.event(Tree.name, 0.5, tree.position);
                sounds.build.play();
            }
            return 'tree planted';
        }
        return 'suitable spot not found';
    }
    deforest(game) {
        let islands = game.islands.filter(island => island.kingdom === this);
        if (!this.treeCount) return 'no tree to cut';
        let trees = null, island = null, maxTries = 10000;
        while (!trees || !trees.length) {
            island = islands[(Math.random() * islands.length)|0];
            trees = island.buildings.filter(b => b.type === Tree && b.finished);
            if (!maxTries--) return 'tree not found';
        }
        if (!trees || !trees.length) return 'tree not found';
        let tree = trees[(Math.random() * trees.length)|0];
        tree.shouldRemove = true;
        let felled = new Building(tree.x, tree.y, FallingTree, this, island);
        game.addChild(felled);
        island.buildings.add(felled);
        if (this.isPlayer) {
            game.god.event('fallingTree', 0.5, felled.position);
            sounds.build.play();
        }
        return 'tree felled';
    }
    train(game, job) {
        let person = this.findOfJob(game, Villager);
        if (person) {
            game.addChild(new SFX(person.x, person.y, Summon));
            person.job = job;
            if (this.isPlayer) {
                game.god.event(job.name, 1, person.position);
                sounds[job.name + 'Train'].play();
            }
            return job.name + ' trained';
        }
        return 'no villager found';
    }
    untrain(game, job) {
        let person = this.findOfJob(game, job);
        if (person) {
            game.addChild(new SFX(person.x, person.y, Summon));
            person.job = Villager;
            if (this.isPlayer) {
                game.god.event(job.name, -1, person.position);
                sounds.untrain.play();
            }
            return job.name + ' untrained';
        }
        return 'no ' + job.name + ' found';
    }
    doBaby(game) {
        if (this.housed) return 'pop limit reached';
        if (game.islands.find(island =>
                island.people.find(person =>
                    person.kingdom === this && person.job === Villager &&
                    Villager.doBaby.call(person, game))) &&
            this.isPlayer
        ) {
            sounds.baby.play();
            return 'baby made';
        }
        return 'baby attempted';
    }
    attemptSummon(game) {
        if (this.templed) return 'pop limit reached';
        if (game.islands.find(island =>
            island.people.find(person =>
                person.kingdom === this && person.job === Priest &&
                Priest.doSummon.call(person, game))) &&
            this.isPlayer
        ) {
            sounds.summon.play();
            return 'summon successful';
        }
        return 'summon attempted';
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
        if (this.isPlayer && p) {
            let prop = c/(this.peopleCount + this.summonCount);
            sounds.pray.play(null, prop);
            game.god.event('pray', prop, p.position);
        }
        return 'praying';
    }
    sendAttack(game) {
        let mean = game.islands.filter(isl => isl.kingdom !== this).rand();
        if (!mean) return 'no enemy';
        game.islands.forEach(island =>
            island.kingdom === this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                person.job === Warrior &&
                person.moveTo(game.islands, mean.index)));
        return 'warriors sent';
    }
    sendConvert(game) {
        let mean = game.islands.filter(isl => isl.kingdom !== this).rand();
        if (!mean) return 'no enemy';
        game.islands.forEach(island =>
            island.kingdom === this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                person.job === Priest &&
                person.moveTo(game.islands, mean.index)));
        return 'priests sent';
    }
    sendRetreat(game) {
        let ally = game.islands.filter(isl => isl.kingdom === this).rand();
        if (!ally) return 'no one to retreat';
        game.islands.forEach(island =>
            island.kingdom !== this &&
            island.people.forEach(person =>
                person.kingdom === this &&
                person.moveTo(game.islands, ally.index)));
        return 'retreating';
    }

    get maxPop() {
        return Math.floor(this.islandCount * 5
            + this.houseCount * 5
            + this.treeCount / 4);
    }
    get housed() { return this.peopleCount >= this.maxPop; }
    get maxSummon() { return this.templeCount * 10; }
    get templed() { return this.summonCount >= this.maxSummon; }
    get maxUnfinished() { return Math.floor(this.islandCount / 2 + 1); }
    get builded() { return this.unfinished >= this.maxUnfinished;  }
    get growed() { return this.growing >= this.greenHouseCount + 1; }
}