'use strict';

// personalityColors[life][manMade]
let personalityColors = [
    [, 0x00ff00, ],
    [, 0xffffff, ],
    [, 0xff0088, ]
];

class God extends PIXI.Container {
    constructor() {
        super();
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
            sacrifice: () => this.likesAttention - this.likesLife * 2,
            fight: () => -this.likesLife / 150,
            kill: () => -this.likesLife * 2,
            converting: () => this.likesAttention / 150,
            convert: () => this.likesAttention + this.likesLife,
            pray: () => this.likesAttention,
            summon: () => this.likesAttention / 2 - this.likesLife / 2
        };

        this.changePersonality(true);
    }
    get z() { return -200; }
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

    update(delta, game) {
        this.overallMood += this.mood;
        this.mood -= 0.01 * Math.sign(this.mood);
        if (Math.abs(this.mood) < 0.01) this.mood = 0;

        if (Math.random() < -this.feeling(game.goal) / 400)
            this.doSacrifice(game);

        if (this.mood > 0) {
            this.satisfaction += this.mood;
            if (this.satisfaction > game.goal / 10)
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

    doSacrifice(game) {
        let islands = game.islands.filter(i =>
            i.people.find(p => p.kingdom === game.player));
        let island = islands.rand();
        if (!island) return;
        let dude;
        do { dude = island.people.rand() } while (!dude.kingdom === game.player);
        this.event('sacrifice', 1, dude.position);
        game.addChild(new SFX(dude.x, dude.y, Lightning));
        sounds.lightning.play();
        game.overlay.flash(8);
        dude.die(game);
    }

    feeling(goal) {
        return (this.mood +
            this.overallMood / (this.overallMood < 0 ? goal/4 : goal)) / 2;
    }

    changePersonality(base, game) {
        if (game) game.overlay.flash(60);
        sounds.new.play();
        this.sincePersonality = 0;
        this.mood = 0;
        this.satisfaction = 0;

        let min = -God.preferenceModifier,
            max = God.preferenceModifier;
        let range = max - min;
        if (base) {
            this.likesLife = max;
            this.likesAttention = max / 4;
            this.likesManMade = min / 4;
            this.sincePersonality = God.personalityLength * 4 / 5;
        } else {
            this.likesLife = min + Math.random() * range;
            this.likesAttention = min + Math.random() * range;
            this.likesManMade = min + Math.random() * range;
        }
        this.updateColor();
    }
    updateColor(
        life = this.likesLife / God.preferenceModifier,
        man = this.likesManMade / God.preferenceModifier,
        attention = this.likesAttention / God.preferenceModifier
    ) {
        // Get the angle into the range [0, 4[
        let angle = 2 * Math.atan2(man, life) / Math.PI;
        if (angle < 0) angle = 4 + angle;

        let hue = Math.shift(
            // From 0 to 1; +life+man; from teal-ish blue to purple
            angle <= 1 ? (11/16 + angle * 3/16) :
            // From 1 to 2; -life+man; from purple to orange-ish
            angle <= 2 ? (14/16 + (angle - 1) * 3/16) :
            // From 2 to 3; -life-man; from orange-ish to green
            angle <= 3 ? (1/16 + (angle - 2) * 3/16) :
            // From 3 to 5; -life+man; from green to teal-ish blue
            (4/16 + (angle - 3) * 7/16), 0, 1);
        let saturation = Math.max(Math.abs(life), Math.abs(man));
        let lightness = attention / (attention < 0 ? 6 : 4) + 0.5;
        this.tint = PIXI.Color.fromHSL(hue, saturation, lightness);
        this.offTint = PIXI.Color.fromHSL(hue, saturation * 0.5, lightness * 0.5);
        if (window.android) android.updateStatusTint(this.offTint);
    }

    event(what, scalar, where) {
        if (!this.events[what]) return;
        if (scalar < 0) scalar *= 2;
        let change = this.events[what]() * scalar;
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