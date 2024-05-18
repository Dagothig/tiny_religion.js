'use strict';

class God extends PIXI.Container {
    constructor() {
        super();
        this.z = -200;
        this.mood = this.overallMood = 0;
        this.lookAtX = this.lookAtY = 0;

        this.background = new PIXI.Sprite(God.background);
        this.background.anchor.x = 0.5;
        this.background.x = -10;

        this.head = new PIXI.Sprite(God.head);
        this.head.anchor.x = 0.5;
        this.head.x = -10;

        this.leftEyeSocket = new PIXI.Container();
        this.leftEyeSocket.x = -70; this.leftEyeSocket.y = 74;
        this.leftEye = new PIXI.Sprite(God.eye);
        this.leftEye.anchor.x = this.leftEye.anchor.y = 0.5;
        this.leftEyeSocket.addChild(this.leftEye);

        this.rightEyeSocket = new PIXI.Container();
        this.rightEyeSocket.x = 70; this.rightEyeSocket.y = 74;
        this.rightEye = new PIXI.Sprite(God.eye);
        this.rightEye.anchor.x = this.rightEye.anchor.y = 0.5;
        this.rightEyeSocket.addChild(this.rightEye);

        this.leftBrow = new PIXI.TiledSprite(God.brow);
        this.leftBrow.anchor.x = this.leftBrow.anchor.y = 0.5;
        this.leftBrow.x = -74; this.leftBrow.y = 56;

        this.rightBrow = new PIXI.TiledSprite(God.brow);
        this.rightBrow.anchor.x = this.rightBrow.anchor.y = 0.5;
        this.rightBrow.x = 74; this.rightBrow.y = 56;
        this.rightBrow.scale.x = -1;

        this.mouth = new PIXI.TiledSprite(God.mouth);
        this.mouth.anchor.x = this.mouth.anchor.y = 0.5;
        this.mouth.x = -2; this.mouth.y = 112;

        this.addChild(this.background, this.head,
            this.leftEyeSocket, this.rightEyeSocket,
            this.leftBrow, this.rightBrow,
            this.mouth);

        this.events = {
            warrior: () => -this.likesLife/2,
            priest: () => this.likesAttention/2,
            builder: () => this.likesManMade/2,
            baby: () => this.likesLife,
            bridge: () => this.likesManMade * 4,
            house: () => this.likesManMade * 2 + this.likesLife * 1.5,
            barracks: () => this.likesManMade * 3 - this.likesLife * 2,
            temple: () => this.likesManMade * 3 + this.likesAttention * 2,
            workshop: () => this.likesManMade * 4,
            greenhouse: () => -this.likesManMade * 3 + this.likesLife * 2,
            tree: () => this.likesLife - this.likesManMade,
            fallingTree: () => this.likesManMade - this.likesLife,
            sacrifice: () => this.likesAttention - this.likesLife * 2,
            fight: () => -this.likesLife / 150,
            kill: () => -this.likesLife * 2,
            converting: () => this.likesAttention / 150,
            convert: () => this.likesAttention + this.likesLife,
            pray: () => this.likesAttention,
            summon: () => this.likesAttention / 2 - this.likesLife / 2,
            statue: () => this.likesAttention * 2 + this.likesManMade * 2
        };

        this.changePersonality(true);
        this.birds = [];
    }
    set tint(val) {
        this.head.tint
        = this.mouth.tint
        = this.leftBrow.tint
        = this.rightBrow.tint
        = val;
    }
    get tint() {
        return this.head.tint;
    }

    get tileY() {
        return this.mouth.tileY;
    }
    set tileY(val) {
        this.mouth.tileY =
        this.leftBrow.tileY =
        this.rightBrow.tileY = val;
    }

    get lifeModifier() { return Math.max(this.likesLife, 0); }
    get deathModifier() { return -Math.min(this.likesLife, 0); }
    get manMadeModifier() { return Math.max(this.likesManMade, 0); }
    get natureModifier() { return -Math.min(this.likesManMade, 0); }
    get attentionModifier() { return Math.max(this.likesAttention, 0); }
    get hermitModifier() { return -Math.min(this.likesAttention, 0); }

    update(delta, game) {
        this.overallMood += this.mood;
        this.mood /= 1.01;
        if (Math.abs(this.mood) < 0.01) this.mood = 0;
        switch (game.markedEnd) {
            case "win":
                this.mood += 0.1;
                return;
            case "lost":
                this.mood -= 0.1;
                return;
        }

        // Birds
        if (Math.random() < 0.01)
            if (this.birds.length < this.birdTarget) {
                let bounds = game.getLocalBounds();
                let bird = new Bird(
                    Math.randRange(bounds.left, bounds.right),
                    Math.randRange(bounds.top, bounds.bottom),
                    this.tint);
                this.birds.add(bird);
                game.addChild(bird);
                game.addChild(new SFX(bird.x, bird.y, Summon, bird.z));
            } else if (this.birds.length > this.birdTarget) {
                let bird = this.birds.rand();
                if (bird) {
                    game.addChild(new SFX(bird.x, bird.y, Lightning, bird.z));
                    bird.die(game);
                    this.birds.remove(bird);
                    this.lookAt(bird);
                }
            }

        let feeling = this.feeling(game.goal);

        if (feeling < 0) {
            feeling *= -1;
            // Check for punish
            if (Math.random() < feeling * this.deathModifier / 200)
                this.doSacrifice(game);

            if (Math.random() < feeling * this.natureModifier / 200)
                this.convertToTree(game);

            if (Math.random() < feeling * this.lifeModifier / 200)
                this.convertToBird(game);
        } else {
            // Check for reward
            if (Math.random() < feeling * this.deathModifier / 400)
                this.convertToMinotaur(game);

            if (Math.random() < feeling * this.natureModifier / 600)
                this.convertToBigTree(game);

            if (Math.random() < feeling * this.attentionModifier / 600)
                game.player.build(game, Statue, true);
        }

        if (this.mood > 0) {
            this.satisfaction += this.mood;
            if (this.satisfaction > game.goal / 5)
                this.changePersonality(false, game);
        }

        this.sincePersonality++;
        if (this.sincePersonality > God.personalityLength)
            this.changePersonality(false, game);
    }
    render(delta, game, renderer) {
        this.background.tint =
            PIXI.Color.interpolate(game.cloudColor, 0xffffff, 0.5);

        let feeling = this.feeling(game.goal);
        this.tileY = Math.bounded(3 - Math.round(feeling * 3), 0, 6);

        let x = this.x + this.leftEyeSocket.x,
            y = this.y + this.leftEyeSocket.y;
        let dstToLeftEye = Math.dst(x, y, this.lookAtX, this.lookAtY);
        this.leftEye.x = 4 * (this.lookAtX - x) / dstToLeftEye;
        this.leftEye.y = 4 * (this.lookAtY - y) / dstToLeftEye;

        x = this.x + this.rightEyeSocket.x;
        y = this.y + this.rightEyeSocket.y;
        let dstToRightEye = Math.dst(x, y, this.lookAtX, this.lookAtY);
        this.rightEye.x = 4 * (this.lookAtX - x) / dstToRightEye;
        this.rightEye.y = 4 * (this.lookAtY - y) / dstToRightEye;
    }

    randomPerson(game, filter) {
        let islands = game.islands.filter(i =>
            i.people.find(p => p.kingdom === game.player));
        let island = islands.rand();
        if (!island) return null;
        let dude, i = 10;
        do { dude = island.people.rand(); }
        while (!(dude.kingdom === game.player && (!filter || filter(dude))) && i--);
        return i+1 && dude;
    }

    randomBuilding(game, filter) {
        let island = game.islands.filter(i => i.kingdom === game.player).rand();
        return island && island.buildings.filter(filter || (() => true)).rand();
    }

    doSacrifice(game) {
        let dude = this.randomPerson(game);
        if (!dude) return strs.msgs.noSacrifice;
        this.event('sacrifice', 1, dude.position);
        game.addChild(new SFX(dude.x, dude.y, Lightning));
        sounds.lightning.play();
        game.overlay.flash(8);
        game.shake(30, 4, 0);
        dude.die(game);
        return strs.msgs.sacrificing;
    }

    convertToMinotaur(game) {
        let minotaur = this.randomPerson(game, x => x.job !== Minotaur);
        if (!minotaur) return;
        game.addChild(new SFX(minotaur, TopBeam).after(() => {
            if (minotaur.shouldRemove) return;
            minotaur.sinceTookDamage = 24;
            game.addChild(new SFX(minotaur, BigSummon));
            sounds.warriorTrain.play();
            minotaur.changeJob(Minotaur);
        }));
    }

    convertToTree(game) {
        let person = this.randomPerson(game);
        if (!person) return;
        game.addChild(new SFX(person, TopBeam).after(() => {
            if (person.shouldRemove) return;
            this.event(Tree.name, 1, person.position);
            game.addChild(new SFX(person.x, person.y, BigSummon));
            sounds.done.play();
            let tree = new Building(
                person.x, person.y, Tree, person.kingdom, person.island, true);
            person.island.buildings
                .filter(b => b.type !== BigTree && b.type !== Bridge
                    && b.isInRadius(tree, 0.1))
                .forEach(b => b.explode(game));
            tree.grow = 0.3;
            person.island.buildings.add(tree);
            game.addChild(tree);
            person.shouldRemove = true;
        }));
    }

    convertToBigTree(game) {
        let tree = this.randomBuilding(game, x => x.type === Tree);
        if (!tree) return;
        game.addChild(new SFX(tree, TopBeam).after(() => {
            if (tree.kingdom !== game.player) return;
            game.addChild(new SFX(tree, BigSummon));
            let bigTree = new Building(
                tree.x, tree.y, BigTree, tree.kingdom, tree.island, true);
            bigTree.grow = 0.1;
            tree.island.buildings.add(bigTree);
            game.addChild(bigTree);
            tree.shouldRemove = true;
        }));
    }

    convertToBird(game) {
        let person = this.randomPerson(game);
        if (!person) return;

        game.addChild(new SFX(person, TopBeam).after(() => {
            if (person.shouldRemove) return;
            game.addChild(new SFX(person.x, person.y, Blood));
            person.shouldRemove = true;
            this.event('baby', 1, person.position);
            for (let i = 3; i--;) {
                let bird = new Bird(person.x, person.y - 4, this.tint);
                this.birds.add(bird);
                game.addChild(bird);
            }
        }));
    }

    feeling(goal) {
        return (this.mood +
            this.overallMood / (this.overallMood < 0 ? goal/4 : goal)) / 2;
    }

    changePersonality(base, game) {
        if (game) {
            game.overlay.flash(60);
            game.shake(60, 10, 0);
        }
        sounds.new.play();
        this.sincePersonality = 0;
        this.mood = 0;
        this.satisfaction = 0;

        let min = -God.preferenceModifier, max = God.preferenceModifier;
        if (base) {
            this.updatePersonality(max, -min, max/4);
            this.sincePersonality = God.personalityLength * 4 / 5;
        } else {
            let range = max - min;
            this.updatePersonality(
                min + Math.random() * range,
                min + Math.random() * range,
                min + Math.random() * range);
        }
        if (game) game.onGodChangePersonality();
    }
    updatePersonality(life, man, attention) {
        this.likesLife = life;
        this.likesAttention = attention;
        this.likesManMade = man;
        this.birdTarget = 5 + 5 * (this.likesLife / God.preferenceModifier);
        this.updateColor();
    }
    updateColor(
        life = this.likesLife / God.preferenceModifier,
        man = this.likesManMade / God.preferenceModifier,
        attention = this.likesAttention / God.preferenceModifier
    ) {
        // Get the angle into the range [0, 4[
        let stops = God.hues.length;
        let angle = Math.atan2(man, life) * 2 / Math.PI + stops;

        let start = God.hues[Math.floor(angle) % stops];
        let end = God.hues[Math.ceil(angle) % stops];
        if (end < start) end += 1;
        let hue = Math.shift(start + (end - start) * (angle % 1), 0, 1);
        let saturation = Math.max(Math.abs(life), Math.abs(man));
        let lightness = attention / (attention < 0 ? 6 : 4) + 0.5;
        this.tint = PIXI.Color.fromHSL(hue, saturation, lightness);
        this.offTint = PIXI.Color.fromHSL(hue, saturation * 0.5, lightness * 0.5);
    }

    event(what, scalar, where) {
        if (!this.events[what]) return;
        let change = this.events[what]() * scalar;
        // Negative changes are slightly larger than positive to prevent abuse
        if (change < 0) change *= 1.5;
        this.mood += change;
        this.lookAt(where);
    }

    lookAt(pt) {
        this.lookAtX = pt.x;
        this.lookAtY = pt.y;
    }

    outputState() {
        return {
            likesLife : this.likesLife,
            likesAttention : this.likesAttention,
            likesManMade : this.likesManMade,
            mood : this.mood,
            overallMood : this.overallMood,
            sincePersonality : this.sincePersonality,
            satisfaction : this.satisfaction,
            lookAtX : this.lookAtX,
            lookAtY : this.lookAtY
        };
    }

    readState(state, game) {
        this.likesLife = state.likesLife;
        this.likesAttention = state.likesAttention;
        this.likesManMade = state.likesManMade;
        this.mood = state.mood;
        this.overallMood = state.overallMood;
        this.sincePersonality = state.sincePersonality;
        this.satisfaction = state.satisfaction;
        this.lookAtX = state.lookAtX;
        this.lookAtY = state.lookAtY;
        this.updateColor();
    }
}
God.preferenceModifier = 1;
God.personalityLength = 5000;
// The quadrants are +life, +man, -life, -man
God.hues = [9/16, 13/16, 0/16, 4/16];
PIXI.loader
.add('background', 'images/Background.png', null, res =>
    God.background = res.texture)
.add('head', 'images/God.png', null, res =>
    God.head = res.texture)
.add('eye', 'images/Eye.png', null, res =>
    God.eye = res.texture)
.add('brow', 'images/Brow.png', null, res =>
    God.brow = new PIXI.TiledTexture(res.texture, 34, 45))
.add('mouth', 'images/Mouth.png', null, res =>
    God.mouth = new PIXI.TiledTexture(res.texture, 98, 54));
