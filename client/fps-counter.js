class FPSCounter {
    constructor() {
        this.tag = document.createElement('div');
        this.tag.classList.add('fps-counter');
        settings.bind('fps', t =>
            this.tag.classList[t ? 'remove' : 'add']('hidden'));

        this.fps = 60;
        this.lastDelta = 0;
    }

    update(delta) {
        var fpsFromDelta = 1000 / delta;
        this.fps = this.fps * 0.9 + fpsFromDelta * 0.1;
        this.lastDelta = delta;
        this.tag.innerHTML = this.fps|0;
    }
}