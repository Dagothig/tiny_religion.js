class Kingdom {
    constructor(tint, isPlayer) {
        this.tint = tint;
        this.isPlayer = isPlayer;
        this.resetCount = x => this[x.name + 'Count'] = 0;
        this.addToPersonCount = x => {
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

    findOfJob(game, job) {
        for (let i = 0; i < game.islands.length; i++) {
            let island = game.islands[i];
            for (let j = 0; j < island.people.length; j++) {
                let person = island.people[j];
                if (person.kingdom === this && person.job === job)
                    return person;
            }
        }
    }

    build(game, type) {
        if (this.builded) return false;
        for (let i = 0; i < game.islands.length * 4; i++) {
            let island = game.islands.rand();
            if (island.kingdom !== this) continue;
            let building = island.generateBuilding(type, true);
            if (!building) continue;
            game.addChild(building);
            for (let j = 0; j < 3; j++) {
                let person = this.findOfJob(game, Builder);
                if (!person) break;
                person.building = building;
                person.movements.length = 0;
            }
            return true;
        }
        return false;
    }

    buildBridge(game) {
        let island;
        for (let i = 0; i < game.islands.length; i++) {
            island = game.islands[i];
            if (!island.bridge) {
                if (island.kingdom !== this) return false;
                break;
            }
        }
        if (island.bridge || this.builded) return false;
        let bridge = new Building(
            island.x + island.getLocalBounds().right,
            island.y, Bridge, this, island);
        game.addChild(bridge);
        island.buildings.add(bridge);
        island.bridge = bridge;
        game.generateNewIsland();
        for (let j = 0; j < 3; j++) {
            let person = this.findOfJob(game, Builder);
            if (!person) break;
            person.building = bridge;
            person.movements.length = 0;
        }
        return true;
    }

    forestate(game) {
        if (this.growing) return false;
        for (let i = 0; i < game.islands.length * 3; i++) {
            let island = game.islands.rand();
            if (island.kingdom !== this) continue;
            let tree = island.generateBuilding(Tree, false);
            if (!tree) continue;
            game.addChild(tree);
            return true;
        }
        return false;
    }
    deforest(game) {
        let islands = game.islands.filter(island => island.kingdom === this);
        if (!this.treeCount) return false;
        let trees = null, island = null, maxTries = 10000;
        while (!trees) {
            island = islands[(Math.random() * islands.length)|0];
            trees = island.buildings.filter(b => b.type === Tree);
            if (!maxTries--) return false;
        }
        let tree = trees[(Math.random() * trees.length)|0];
        tree.shouldRemove = true;
        let felled = new Building(tree.x, tree.y, FallingTree, this, island);
        game.addChild(felled);
        island.buildings.add(felled);
        return true;
    }
    train(game, job) {
        let person = this.findOfJob(game, Villager);
        if (person) {
            person.sinceTookDamage = 10;
            person.job = job;
        }
    }
    untrain(game, job) {
        let person = this.findOfJob(game, job);
        if (person) {
            person.sinceTookDamage = 10;
            person.job = Villager;
        }
    }
    doBaby(game) {
        game.islands.forEach(island =>
            island.people.forEach(person =>
                person.kingdom === this && person.job === Villager &&
                Villager.doBaby.call(person, game)));
    }
    attemptSummon(game) {
        game.islands.forEach(island =>
            island.people.forEach(person =>
                person.kingdom === this && person.job === Priest &&
                Priest.doBaby.call(person, game)));
    }
    pray(game) {
        game.islands.forEach(island =>
            island.people.forEach(person =>
                person.kingdom === this && person.pray()));
    }
    sendAttack(game) {

    }
    sendConvert(game) {

    }
    sendRetreat(game) {

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
}