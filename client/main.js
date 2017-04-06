let scaling = 1;
document.addEventListener('DOMContentLoaded', () => {
    // Setup renderer
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    let renderer = PIXI.autoDetectRenderer();
    renderer.roundPixels = true;
    container.appendChild(renderer.view);
    let resize = () => {
        let w = container.clientWidth, h = container.clientHeight;
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
    let ui = new UI(() => {
        ui.hideTitle();
        game = new Game(win => {
            ui.showTitle(win);
            game.detachEvents();
            game = null;
        });
        game.attachEvents(container);
    });
    ui.showTitle();

    Game.onLoad(() => {
        let last = performance.now();
        let upd = () => {
            let time = performance.now();
            let delta = time - last;
            ui.update(delta, game);
            if (game) {
                game.update(delta, renderer.width, renderer.height);
                renderer.backgroundColor = game.backgroundColor;
                renderer.render(game);
                game.checkForEnd();
            }
            last = time;
            requestAnimationFrame(upd);
        }
        upd();
        resize();
    });
});