let gulp = require('gulp')

gulp.task('client', function(cb) {
    let babel = require('gulp-babel'),
        concat = require('gulp-concat');

    return gulp.src([
        "client/extensions.js",
        "client/pixi-extensions.js",
        "client/settings.js",

        "client/sound.js",

        "client/sfx.js",
        "client/god.js",
        "client/kingdom.js",
        "client/island.js",
        "client/building.js",
        "client/person.js",
        "client/game.js",

        "client/ui.js",
        "client/main.js"
    ])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('client.js'))
    .pipe(gulp.dest('./'));
});
gulp.task('default', gulp.parallel('client'));