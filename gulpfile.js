let gulp = require('gulp')

gulp.task('client', function(cb) {
    let plumber = require('gulp-plumber'),
        babel = require('gulp-babel'),
        concat = require('gulp-concat'),
        cached = require('gulp-cached'),
        remember = require('gulp-remember');

    return gulp.src([
        "client/extensions.js",
        "client/pixi-extensions.js",
        "client/settings.js",

        "client/sound.js",
        "client/state.js",

        "client/sfx.js",
        "client/god.js",
        "client/kingdom.js",
        "client/island.js",
        "client/building.js",
        "client/person.js",
        "client/bird.js",
        "client/overlay.js",
        "client/game.js",

        "client/fps-counter.js",
        "client/ui.js",
        "client/main.js"
    ])
    .pipe(plumber({
        errorHandler: function(e) {
            console.error(e.name, ':', e.message);
            this.emit('end');
        }
    }))
    .pipe(cached('babel'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(remember('babel'))
    .pipe(concat('client.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch-client', function(cb) {
    return gulp.watch("client/**/*.js", gulp.series('client'));
});

let node;
gulp.task('static', function(cb) {
    if (node) node.kill();
    let childProcess = require('child_process');
    node = childProcess.spawn('node', ['static']);
    cb();
});
process.on('exit', () => node && node.kill());

gulp.task('default', gulp.parallel('watch-client', 'client', 'static'));