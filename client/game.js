'use strict';

let darkSkyColor = 0x241e2f,
    skyColor = 0xa2a8b0,
    goodSkyColor = 0x80c0ff,

    darkCloudColor = 0xa81c50,
    cloudColor = 0x8ca0a4,
    goodCloudColor = 0xd6f0ff,

    darkGlobalColor = 0xff99cc,
    globalColor = 0xcccccc,
    goodGlobalColor = 0xfff0cc;

class Game extends PIXI.Container {
    constructor(goal = Game.shortGoal) {
        super();
        this.goal = goal;
        this.music = music2;

        this.god = new God();
        this.addChild(this.god);

        this.player = new Kingdom(0x113996, true);
        this.ai = new Kingdom(0xab1705, false);
        this.islands = [];

        let starting = new Island(0, 0, this.player);
        starting.generateTrees();
        this.islandBounds = starting.getLocalBounds();
        starting.people.push(
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Villager, this.player, starting),
            new Person(0, 0, Warrior, this.player, starting),
            new Person(0, 0, Priest, this.player, starting),
            new Person(0, 0, Builder, this.player, starting)
        );
        this.addIsland(starting);

        this.skiesMood = 0;
        this.x = -this.islandBounds.left;
    }
    update(delta, width, height) {

        if (window.isKeyPressed(37)) this.x += 5;
        if (window.isKeyPressed(39)) this.x -= 5;
        this.x = Math.bounded(this.x,
            -(this.islandBounds.left + this.islandBounds.width * this.islands.length - width),
            -this.islandBounds.left);
        this.y = height - this.islandBounds.bottom;
        this.god.x = -this.x + width / 2;
        this.god.y = -this.y;
        /*while (this.islands.length * 480 < width)
            this.generateNewIsland();*/

        this.updateColor();
        this.player.count(this);
        this.ai.count(this);

        this.children.forEach(child => child.update && child.update(delta, this));
        this.children = this.children.filter(child => !child.shouldRemove);
        this.children.sort((a, b) => (a.z || 0) - (b.z || 0));
    }
    updateColor() {
        let feeling = this.god.feeling(this.goal);
    this.skiesMood += (feeling - this.skiesMood) * 0.01;
        this.skiesMood = Math.bounded(this.skiesMood, -1, 1);

        this.backgroundColor = PIXI.Color.interpolate(skyColor,
            this.skiesMood > 0 ? goodSkyColor : darkSkyColor,
            Math.abs(this.skiesMood));
        this.cloudColor = PIXI.Color.interpolate(cloudColor,
            this.skiesMood > 0 ? goodCloudColor : darkCloudColor,
            Math.abs(this.skiesMood));
        this.globalColor = PIXI.Color.interpolate(globalColor,
            this.skiesMood > 0 ? goodGlobalColor : darkGlobalColor,
            Math.abs(this.skiesMood));
    }

    addIsland(island) {
        this.islands.add(island);
        this.addChild(island);
        if (island.buildings.length)
            this.addChild.apply(this, island.buildings);
        if (island.people.length)
            this.addChild.apply(this, island.people);
    }
    generateNewIsland() {
        let island = new Island(this.islands.length * 480, 0, this.ai);
        island.generateTrees();
        if (Math.random() < 0.25) island.generateOutpost();
        this.addIsland(island);
    }
}
Game.tinyGoal = 3000;
Game.shortGoal = 6000;
Game.mediumGoal = 12000;
Game.longGoal = 24000;