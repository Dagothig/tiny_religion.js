class God extends PIXI.Container {
    constructor() {
        super();
        this.mood = this.overallMood = 0;

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

        this.changePersonality(true);

        this.addChild(this.background, this.head,
            this.leftEyeSocket, this.rightEyeSocket,
            this.leftBrow, this.rightBrow,
            this.mouth);
    }
    get z() { return -200; }
    set tint(val) {
        this.head.tint
        = this.mouth.tint
        = this.leftBrow.tint
        = this.rightBrow.tint
        = val;
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
        this.background.tint =
            PIXI.Color.interpolate(game.cloudColor, 0xffffff, 0.5);

        this.overallMood += this.mood /= 1.01;
        let feeling = this.feeling(game.goal);
        this.tileY = Math.bounded(3 - Math.round(feeling * 3), 0, 6);

        if (Math.random() < -feeling / 500) doSacrifice(game);

        this.sincePersonality++;
        if (this.sincePersonality > God.personalityLength)
            this.changePersonality();
    }

    doSacrifice(game) {
        let islands = game.player.islands;
        let island = islands[(Math.random() * islands.length)|0];
        let dude = island.people[(Math.random() * island.people.length)|0];
        if (!dude) return;
        game.addChild(new SFX(dude.x, dude.y, Lightning));
        dude.die(game);
    }

    feeling(goal) {
        return (this.mood +
            this.overallMood / (this.overallMood < 0 ? goal/4 : goal)) / 2;
    }

    changePersonality(base = false) {
        if (base) {
            this.likesLife = God.preferenceModifier;
            this.likesAttention = God.preferenceModifier / 4;
            this.likesManMade = -God.preferenceModifier / 4;
            this.sincePersonality = God.personalityLength * 4 / 5;
        } else {
            let range = God.preferenceModifier * 2;
            let min = God.preferenceModifier;
            this.likesLife = Math.random() * range - min;
            this.likesAttention = Math.random() * range - min;
            this.likesManMade = Math.random() * range - min;
            this.sincePersonality = 0;
        }
        let life = this.likesLife / God.preferenceModifier * 200,
            manMade = this.likesManMade / God.preferenceModifier * 200,
            attention = this.likesAttention / God.preferenceModifier * 200;

        let R = 0, G = 0, B = 0;
        if (life < 0) R -= (life / 200) * 255;
        else B += (life / 200) * 255;
        if (manMade <= 0) G -= (manMade / 200) * 255;
        else {
            if (R < 128) R = 128 - ((128 - R) / ((manMade + 50) / 50));
            else R = (R - 128) / ((manMade + 50) / 50) + 128;
            if (G < 128) G = 128 - ((128 - G) / ((manMade + 50) / 50));
            else G = (G - 128) / ((manMade + 50) / 50) + 128;
            if (B < 128) B = 128 - ((128 - B) / ((manMade + 50) / 50));
            else B = (B - 128) / ((manMade + 50) / 50) + 128;
        }
        R = R * (Math.pow(2, attention / 200));
        G = G * (Math.pow(2, attention / 200));
        B = B * (Math.pow(2, attention / 200));
        this.tint = PIXI.Color.fromRGB(
            Math.bounded(R|0, 0, 255),
            Math.bounded(G|0, 0, 255),
            Math.bounded(B|0, 0, 255)
        );
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