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

const PIXLE_GAME_SRC_PATH = './src/';
const PIXLE_GAME_ASSETS_PATH = PIXLE_GAME_SRC_PATH + 'assets/';

const DEV_SRC_PATH = './local/';

// SVG paths
const PIXLE_GAME_SVG_FOLDER = PIXLE_GAME_ASSETS_PATH + 'svg/';

// Style paths
const STYLES_SRC_FILES = DEV_SRC_PATH + 'stylesheets/scss/**/!(_*)*.scss';
const PIXLE_GAME_STYLES_MIN_DEST_PATH = PIXLE_GAME_SRC_PATH + 'stylesheets/css/';

// Stylesheets deletion pattern
const STYLES_DEL_PATTERN = [
  PIXLE_GAME_SRC_PATH + 'stylesheets/*/',
  '!' + PIXLE_GAME_SRC_PATH + 'stylesheets/.gitkeep',
  '!' + PIXLE_GAME_SRC_PATH + 'stylesheets/README.md'
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
  await to_css(STYLES_SRC_FILES, PIXLE_GAME_STYLES_MIN_DEST_PATH).then(() =>
    uglify(PIXLE_GAME_STYLES_MIN_DEST_PATH)
  );
});

/*

/*

Compress svg files: ----------------------------------------------

*/

gulp.task('svg-compress', async function () {
  gulp.src(PIXLE_GAME_SVG_FOLDER + '**/*.svg')
    .pipe(plumber())
    .pipe(svgmin())
    .pipe(gulp.dest(PIXLE_GAME_SVG_FOLDER));
});

/*

Compress Task: ---------------------------------------------------

*/

gulp.task('compress', gulp.series('clear', 'default-stylesheets'));

/*

Default Task: ----------------------------------------------------

*/

gulp.task('watch', function () {
  'use strict';
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
