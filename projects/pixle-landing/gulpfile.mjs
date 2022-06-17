/* jshint node: true */

/*

Variables: ------------------------------------------------------

*/

import gulp from 'gulp';
import rename from 'gulp-rename';
import jsMinify from 'gulp-minify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import del from 'del';

const sass = gulpSass(dartSass);

/*

Paths: ----------------------------------------------------------

*/

const PIXLE_LANDING_SRC_PATH = './src/';
const DEV_SRC_PATH = './local/';

// JavaScript paths
const JAVASCRIPT_SRC_FILES = DEV_SRC_PATH + 'js/**/*';
const JAVASCRIPT_MIN_DEST_PATH = PIXLE_LANDING_SRC_PATH + 'assets/js/';

// JavaScript deletion pattern
const JAVASCRIPT_DEL_PATTERN = [
  JAVASCRIPT_MIN_DEST_PATH + '*/',
  '!' + JAVASCRIPT_MIN_DEST_PATH + '.gitkeep',
  '!' + JAVASCRIPT_MIN_DEST_PATH + 'README.md'
];

// Style paths
const STYLES_SRC_FILES = DEV_SRC_PATH + 'stylesheets/scss/**/!(_*)*.scss';
const PIXLE_LANDING_STYLES_MIN_DEST_PATH = PIXLE_LANDING_SRC_PATH + 'stylesheets/css/';

// Stylesheets deletion pattern
const STYLES_DEL_PATTERN = [
  PIXLE_LANDING_SRC_PATH + 'stylesheets/*/',
  '!' + PIXLE_LANDING_SRC_PATH + 'stylesheets/.gitkeep',
  '!' + PIXLE_LANDING_SRC_PATH + 'stylesheets/README.md'
];

/*

Compress javascript files: --------------------------------------

*/

gulp.task('default-js', async function () {
  gulp.src(JAVASCRIPT_SRC_FILES)
    .pipe(plumber())
    .pipe(jsMinify([{
      ext: {
        src: '.js',
        min: '.min.js'
      },
      noSource: true,
      ignoreFiles: ['.min.js', '-min.js']
    }]))
    .pipe(gulp.dest(JAVASCRIPT_MIN_DEST_PATH));
});

/*

Clear assets/stylesheets folder: --------------------------------

*/

async function clear_files(pattern) {
  const deletedFilePaths = await del(pattern);
  console.log('Deleted files:\n', deletedFilePaths.join('\n'));
  console.log('\n');
}

gulp.task('clear-css', () => clear_files(STYLES_DEL_PATTERN));
gulp.task('clear-js', () => clear_files(JAVASCRIPT_DEL_PATTERN));

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
  await to_css(STYLES_SRC_FILES, PIXLE_LANDING_STYLES_MIN_DEST_PATH).then(() =>
    uglify(PIXLE_LANDING_STYLES_MIN_DEST_PATH)
  );
});

/*

Compress Task: ---------------------------------------------------

*/

gulp.task('compress', gulp.series('clear-css', 'default-stylesheets'));
gulp.task('compress-js', gulp.series('clear-js', 'default-js'));

/*

Default Task: ----------------------------------------------------

*/

gulp.task('watch', function () {
  'use strict';
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
