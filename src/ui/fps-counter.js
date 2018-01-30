import settings from '../settings';

class FPSCounter {
    constructor() {
        this.tag = dom('div', { class: 'fps-counter' });
        this.fps = this.lastDelta = 0;
        settings.bind('fps', t =>
            this.tag.classList[t ? 'remove' : 'add']('hidden'));
    }

    update(delta) {
        var fpsFromDelta = 1000 / delta;
        this.fps = this.fps * 0.9 + fpsFromDelta * 0.1;
        this.lastDelta = delta;
        this.tag.textContent = this.fps|0;
    }
}

export default FPSCounter;