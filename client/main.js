let scaling = 1;
let container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);
// Setup renderer
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
let renderer = PIXI.autoDetectRenderer();
renderer.roundPixels = true;
container.appendChild(renderer.view);
let resize = () => {
    let w = container.clientWidth, h = container.clientHeight;
    console.log(w, h);
    if (!h) return;
    scaling = 1;
    if (h < 420) {
        w *= 420 / h;
        h = 420;
        scaling++;
    }
    renderer.resize(w, h);
}
window.addEventListener('resize', resize);
resize();

PIXI.loader.load(() => Game.loaded = true);
let game;
let ui = new UI(container, () => {
    ui.hideTitle();
    Game.onLoad(() => {
        game = new Game(win => {
            ui.showTitle(win);
            game.detachEvents();
            game = null;
        });
        game.attachEvents(container);
    });
});
ui.showTitle();
settings.bind('tooltips', resize);

function resume() {
    paused = false;
    Music.resume();
}
function pause() {
    paused = true;
    Music.pause();
}
let paused = false;
Game.onLoad(() => {
    let last = performance.now();
    let upd = () => {
        let time = performance.now();
        let delta = time - last;
        if (!paused) {
            ui.update(delta, game);
            if (game) {
                game.update(delta, renderer.width, renderer.height);
                renderer.backgroundColor = game.backgroundColor;
                renderer.render(game);
                game.checkForEnd();
            }
        }
        last = time;
        requestAnimationFrame(upd);
    }
    upd();
    resize();
});