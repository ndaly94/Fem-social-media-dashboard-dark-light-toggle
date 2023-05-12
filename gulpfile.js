// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser= require('gulp-terser');
const browsersync = require('browser-sync').create();
// fix for gulp needing sass compiler


// use dart-sass for @sure
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.'}));
}

// Javascript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true})
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(terser())
    .pipe(dest('dist', {sourcemaps: '.'}));
}

//browserSync
function browserSyncServ(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

//Watch Task - monitors our task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// Default Gulp Task - tells us what will run if we run 'gulp' command in terminal
exports.default = series(scssTask, jsTask, browserSyncServ, watchTask)

// Build Gulp Task
exports.build = series(scssTask, jsTask);