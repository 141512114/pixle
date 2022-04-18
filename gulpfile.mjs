/* jshint node: true */

/*

Variables: ------------------------------------------------------

*/

import gulp from 'gulp';
import rename from 'gulp-rename';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import svgmin from 'gulp-svgmin';
import plumber from 'gulp-plumber';
import del from 'del';

const sass = gulpSass(dartSass);

/*

Paths: ----------------------------------------------------------

*/

const SRC_PATH = './src/';
const DEV_SRC_PATH = './local/';
const ASSETS_PATH = SRC_PATH + 'assets/';

// SVG paths
const SVG_FOLDER = ASSETS_PATH + 'svg/';

// Style paths
const STYLES_SRC_FILES = DEV_SRC_PATH + 'stylesheets/scss/**/!(_*)*.scss';
const STYLES_MIN_DEST_PATH = SRC_PATH + 'stylesheets/css/';

const BOOTSTRAP_SRC_FILES = DEV_SRC_PATH + 'stylesheets/bootstrap/**/!(_*)*.scss';
const BOOTSTRAP_MIN_DEST_PATH = SRC_PATH + 'stylesheets/bootstrap/';

// Stylesheets deletion pattern
const STYLES_DEL_PATTERN = [
  SRC_PATH + 'stylesheets/*/',
  '!' + SRC_PATH + 'stylesheets/',
  '!' + SRC_PATH + 'stylesheets/README.md'
];
const STYLES_CSS_DEL_PATTERN = [
  STYLES_MIN_DEST_PATH + '*/',
  '!' + SRC_PATH + 'stylesheets/README.md'
];
const STYLES_BOOTSTRAP_DEL_PATTERN = [
  BOOTSTRAP_MIN_DEST_PATH + '*/',
  '!' + SRC_PATH + 'stylesheets/README.md'
];

/*

Clear assets/stylesheets folder: --------------------------------

*/

async function clear_styles(pattern) {
  const deletedFilePaths = await del(pattern);
  console.log('Deleted files:\n', deletedFilePaths.join('\n'));
  console.log('\n');
}

gulp.task('clear', () => clear_styles(STYLES_DEL_PATTERN));
gulp.task('clear-css', () => clear_styles(STYLES_CSS_DEL_PATTERN));
gulp.task('clear-bootstrap', () => clear_styles(STYLES_BOOTSTRAP_DEL_PATTERN));

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
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
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
      .pipe(cleanCSS({debug: true, compatibility: 'ie8'}, function (details) {
        console.log('Original Size : ' + details.name + ': ' + details.stats.originalSize + ' bytes');
        console.log('Minified Size : ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
      }))
      .pipe(rename(function (path) {
        if (!path.extname.endsWith('.map')) {
          path.basename += '.min';
        }
      }))
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
}

/*

Compress normal stylesheets: -------------------------------------

*/

gulp.task('default-stylesheets', async function () {
  await to_css(STYLES_SRC_FILES, STYLES_MIN_DEST_PATH).then(() =>
    uglify(STYLES_MIN_DEST_PATH)
  );
});

/*

Compress normal bootstrap: ---------------------------------------

*/

gulp.task('bootstrap-stylesheets', async function () {
  await to_css(BOOTSTRAP_SRC_FILES, BOOTSTRAP_MIN_DEST_PATH).then(() =>
    uglify(BOOTSTRAP_MIN_DEST_PATH)
  );
});

/*

Compress svg files: ----------------------------------------------

*/

gulp.task('svg-compress', async function() {
  gulp.src(SVG_FOLDER + '**/*.svg')
    .pipe(plumber())
    .pipe(svgmin())
    .pipe(gulp.dest(SVG_FOLDER));
});

/*

Compress Task: ---------------------------------------------------

*/

gulp.task('compress', gulp.series('clear-css', 'default-stylesheets'));
gulp.task('bootstrap', gulp.series('clear-bootstrap', 'bootstrap-stylesheets'));
gulp.task('combined', gulp.series('clear', 'bootstrap-stylesheets', 'default-stylesheets'));

/*

Default Task: ----------------------------------------------------

*/

gulp.task('watch', function () {
  'use strict';
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
