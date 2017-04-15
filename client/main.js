let scaling = 1;
let container = document.createElement('div');
container.id = 'container';
let ui = new UI(container, () => newGame());
let game;

let paused = false;
function resume() {
    paused = false;
    Music.resume();
    ui.resume();
}
function pause() {
    paused = true;
    Music.pause();
    ui.pause();
}

function newGame(state = undefined) {
    Game.onLoad(() => {
        if (game) game.detachEvents();
        ui.hideTitle();
        game = new Game(win => {
            ui.showTitle(win);
            game.detachEvents();
            game = null;
        }, state);
        game.attachEvents(container);
    });
}

let state = JSON.parse(localStorage.getItem('save'));
function save() {
    if (!game) return;
    localStorage.setItem('save', JSON.stringify(state = game.outputState()));
}
function restore() { state && newGame(state); }

function saveTemp() {
    if (!game) return;
    localStorage.setItem('saveTemp', JSON.stringify(game.outputState()));
}
function restoreTemp() {
    let tempState = JSON.parse(localStorage.getItem('saveTemp'));
    localStorage.removeItem('saveTemp');
    tempState && newGame(tempState);
}

window.addEventListener("DOMContentLoaded", () => {
    PIXI.loader.load(() => Game.loaded = true);
    // Remove the preload class from the body
    setTimeout(() => document.body.classList.remove('preload'), 1000);

    // Setup container & ui
    document.body.appendChild(container);
    document.body.appendChild(ui.titleTag);
    document.body.appendChild(ui.btnsTag);
    document.body.appendChild(ui.menuContainerTag);
    ui.showTitle();

    // Setup renderer
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    let renderer = PIXI.autoDetectRenderer();
    renderer.roundPixels = true;
    container.appendChild(renderer.view);

    // Setup resize hook
    let resize = () => {
        let w = container.clientWidth, h = container.clientHeight;
        if (!h) return;
        scaling = 1;
        let minDst = 420;
        if (h < minDst) {
            scaling = minDst / h;
            w *= minDst / h;
            h = minDst;
        }
        while (h > minDst * 2) {
            scaling /= 2;
            w /= 2;
            h /= 2;
        }
        renderer.resize(w, h);
    }
    window.addEventListener('resize', resize);
    resize();
    settings.bind('tooltips', resize);

    Game.onLoad(() => {
        // Setup event loop
        let last = performance.now();
        let upd = () => {
            let time = performance.now();
            let delta = time - last;

            if (game) {
                if (!paused) game.update(delta, renderer.width, renderer.height);
                game.render(delta, renderer);
                if (!paused) game.checkForEnd();
            }
            ui.update(delta, game);

            last = time;
            requestAnimationFrame(upd);
        }
        upd();
        resize();
    });
});