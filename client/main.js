PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

if (window.app && window.app.exit) {
    window.exit = function exit() {
        saveTemp();
        app.exit();
    };
}
if (!window.saveStorage) {
    window.saveStorage = localStorage;
}

let scaling = 1;
let container = dom('div', { id: 'container' });
let ui = new UI(container, () => restoreTemp() || newGame());
let renderer, game;

let paused = 0;
const pausedCounters = [];
const focusPause = 0, menuPause = 1;
function resume(key) {
    pausedCounters[key] = 0;
    checkPause();
}
function pause(key) {
    pausedCounters[key] = 1;
    checkPause();
}
function checkPause() {
    let wasPaused = !!paused;
    paused = 0;
    for (let key = 0; key < pausedCounters.length; key++) {
        const value = pausedCounters[key];
        switch (key) {
            case focusPause:
                paused += settings.pauseOnFocusLoss ? value : 0;
                break;
            default:
                paused += value;
                break;
        }
    }
    if (paused && !wasPaused) {
        container.classList.add('paused');
        Music.pause();
        ui.pause();
    }
    if (!paused && wasPaused) {
        container.classList.remove('paused');
        Music.resume();
        ui.resume();
    }
}

setInterval(() => document.hasFocus() ? resume(focusPause) : pause(focusPause), 100);

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
        ui.onNewGame(game);
    });
}

let state = JSON.parse(saveStorage.getItem('save'));
function save() {
    if (!game) return;
    saveStorage.setItem('save', JSON.stringify(state = game.outputState()));
    ui.notify(strs.msgs.saved);
}
function restore() {
    state && newGame(state);
    ui.notify(strs.msgs.restored);
}

function saveTemp() {
    if (!game) return;
    saveStorage.setItem('saveTemp', JSON.stringify(game.outputState()));
}
function restoreTemp() {
    let tempState = JSON.parse(saveStorage.getItem('saveTemp'));
    saveStorage.removeItem('saveTemp');
    tempState && newGame(tempState);
    return !!tempState;
}

function setupGame() {
    // Setup container
    document.body.appendChild(container);

    // Setup ui
    document.body.appendChild(ui.btnsTag);
    document.body.appendChild(ui.titleTag);
    document.body.appendChild(ui.menuContainerTag);
    ui.showTitle();

    // Setup renderer
    renderer = PIXI.autoDetectRenderer();
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
    };
    window.addEventListener('resize', resize);
    resize();

    Game.onLoad(() => {
        // Setup event loop
        let last = performance.now();
        let upd = () => {
            let time = performance.now();
            let delta = (time - last) || 1;

            if (game) {
                if (!paused) game.update(delta, renderer.width, renderer.height);
                if (game) game.render(delta, renderer);
                if (!paused && game) game.checkForEnd();
            }
            ui.update(delta, game);

            last = time;
            requestAnimationFrame(upd);
        }
        upd();
        resize();
    });
}

let splash;
window.addEventListener("DOMContentLoaded", () => {
    settings.bind('tooltips', t =>
        document.body.classList[t ? 'add' : 'remove']('show-tooltips'));

    splash = document.querySelector('.splash');
    if (!splash) return setupGame();
    splash.appendChild(dom("span", {}, strs.splash.prompt));
    let handler = () => splash && (splash.remove(), splash = null, setupGame());
    splash.onclick = handler;
});
