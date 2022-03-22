/* jshint node: true */

/*

Variables: ------------------------------------------------------

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

Paths: ----------------------------------------------------------

*/

const SRC_PATH = './src/assets/';
const DEV_SRC_PATH = './src/dev-assets/';

// Style paths
const STYLES_SRC_FILES = DEV_SRC_PATH + 'stylesheets/scss/**/!(_*)*.scss';
const STYLES_DEST_PATH = SRC_PATH + 'stylesheets/css/';

const BOOTSTRAP_SRC_FILES = DEV_SRC_PATH + 'stylesheets/bootstrap/**/!(_*)*.scss';
const BOOTSTRAP_DEST_PATH = SRC_PATH + 'stylesheets/bootstrap-min/';

/*

Convert to CSS: -------------------------------------------------

*/

async function to_css(source, dest) {
  'use strict';
  return await new Promise((resolve) => {
    gulp.src(source)
      .pipe(plumber())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 3 version'))
      .pipe(sourcemaps.write('./', {includeContent: false}))
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
}

/*

Uglify / Clean CSS: ----------------------------------------------

*/

async function uglify(dest) {
  'use strict';
  return await new Promise((resolve) => {
    gulp.src(dest + '**/!(*.min).css')
      .pipe(plumber())
      .pipe(cleanCSS({debug: true}, function (details) {
        console.log('Original Size : ' + details.name + ': ' + details.stats.originalSize + ' bytes');
        console.log('Minified Size : ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
      }))
      .pipe(renameFiles({suffix: '.min'}))
      .pipe(gulp.dest(dest + 'minified/'))
      .on('end', resolve);
  });
}

/*

Compress normal stylesheets: -------------------------------------

*/

gulp.task('default-stylesheets', async function () {
  await to_css(STYLES_SRC_FILES, STYLES_DEST_PATH).then(() =>
    uglify(STYLES_DEST_PATH)
  );
});

/*

Compress normal bootstrap: ---------------------------------------

*/

gulp.task('bootstrap-stylesheets', async function () {
  await to_css(BOOTSTRAP_SRC_FILES, BOOTSTRAP_DEST_PATH).then(() =>
    uglify(BOOTSTRAP_DEST_PATH)
  );
});

/*

Compress Task: ---------------------------------------------------

*/

gulp.task('compress', gulp.series('default-stylesheets'));
gulp.task('bootstrap', gulp.series('bootstrap-stylesheets'));
gulp.task('combined', gulp.series('bootstrap', 'compress'));

/*

Default Task: ----------------------------------------------------

*/

gulp.task('watch', function () {
  'use strict';
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
