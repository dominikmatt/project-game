var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var gulpCopy = require('gulp-copy');

function compile(watch) {
    var bundler = watchify(
                      browserify('./web/js/index.js', { debug: true })
                      .transform("babelify", {
                          presets: ["es2015"]
                      })
                );

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('index.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./web/dist/js'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function copyWorker() {
    return gulp.src(['./web/js/worker/*'])
        .pipe(gulp.dest('./web/dist/worker'));
};

function watch() {
    gulp.watch('./web/js/worker/*.js', copyWorker);
    return compile(true);
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);