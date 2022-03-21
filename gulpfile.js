/* jshint node: true */

/*

Variables: ----------------------------------------------------

*/

import gulp from 'gulp';
import renameFiles from 'gulp-rename';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';

const sass = gulpSass(dartSass);

/*

Paths: -------------------------------------------------

*/

const SRC_PATH = './src/assets/';

// Style paths
const STYLES_SRC_FILES = SRC_PATH + 'stylesheets/scss/**/!(_*)*.scss';
const STYLES_DEST_PATH = SRC_PATH + 'stylesheets/css/';

/*

Convert to CSS: -------------------------------------------------

*/

gulp.task('to-css', function () {
  'use strict';
  return gulp.src(STYLES_SRC_FILES)
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 3 version'))
    .pipe(sourcemaps.write('./sourcemaps/', {includeContent: false}))
    .pipe(gulp.dest(STYLES_DEST_PATH));
});

/*

Uglify / Clean CSS: -------------------------------------------------

*/

gulp.task('uglify', function () {
  'use strict';
  return gulp.src(STYLES_DEST_PATH + '**/!(*.min).css')
    .pipe(plumber())
    .pipe(cleanCSS({debug: true}, function (details) {
      console.log('Original Size : ' + details.name + ': ' + details.stats.originalSize + ' bytes');
      console.log('Minified Size : ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
    }))
    .pipe(renameFiles({suffix: '.min'}))
    .pipe(gulp.dest(STYLES_DEST_PATH + 'minified/'));
});

/*

Compress Task: -----------------------------------------------------

*/

gulp.task('compress', gulp.series('to-css', 'uglify'));

/*

Default Task: -----------------------------------------------------

*/

gulp.task('watch', function () {
  'use strict';
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
