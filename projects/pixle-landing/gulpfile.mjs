/* jshint node: true */

import gulp from 'gulp';
import path from 'path';
import { fileURLToPath } from 'url';
import rename from 'gulp-rename';
import jsMinify from 'gulp-minify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import { deleteAsync } from 'del';

const sass = gulpSass(dartSass);

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
Paths: ----------------------------------------------------------
*/

const PIXLE_LANDING_SRC_PATH = `${__dirname}/src/`;
const DEV_SRC_PATH = `${__dirname}/local/`;

// JavaScript paths
const JAVASCRIPT_SRC_FILES = `${DEV_SRC_PATH}js/**/*`;
const JAVASCRIPT_MIN_DEST_PATH = `${PIXLE_LANDING_SRC_PATH}assets/js/`;

// JavaScript deletion pattern
const JAVASCRIPT_DEL_PATTERN = [
  `${JAVASCRIPT_MIN_DEST_PATH}**/*`,
  `!${JAVASCRIPT_MIN_DEST_PATH}.gitkeep`,
  `!${JAVASCRIPT_MIN_DEST_PATH}README.md`,
];

// Style paths
const STYLES_SRC_FILES = `${DEV_SRC_PATH}stylesheets/scss/**/!(_*)*.scss`;
const PIXLE_LANDING_STYLES_MIN_DEST_PATH = `${PIXLE_LANDING_SRC_PATH}stylesheets/css/`;

// Stylesheets deletion pattern
const STYLES_DEL_PATTERN = [
  `${PIXLE_LANDING_STYLES_MIN_DEST_PATH}**/*`,
  `!${PIXLE_LANDING_SRC_PATH}stylesheets/.gitkeep`,
  `!${PIXLE_LANDING_SRC_PATH}stylesheets/README.md`,
];

/*
Compress JavaScript files: --------------------------------------
*/

gulp.task('default-js', () => {
  return gulp.src(JAVASCRIPT_SRC_FILES)
    .pipe(plumber())
    .pipe(jsMinify({
      ext: {
        src: '.js',
        min: '.min.js',
      },
      noSource: true,
      ignoreFiles: ['.min.js', '-min.js'],
    }))
    .pipe(gulp.dest(JAVASCRIPT_MIN_DEST_PATH));
});

/*
Clear assets/stylesheets folder: --------------------------------
*/

async function clearFiles(pattern) {
  return deleteAsync(pattern).then(deletedFilePaths => {
    console.log('Deleted files:\n', deletedFilePaths.join('\n'));
  });
}

gulp.task('clear-css', async function() {
  await clearFiles(STYLES_DEL_PATTERN);
  return console.log("Clearing css files...");
});
gulp.task('clear-js', async function() {
  await clearFiles(JAVASCRIPT_DEL_PATTERN);
  return console.log("Clearing js files...");
});

/*
Convert to CSS: -------------------------------------------------
*/

function toCSS(source, dest) {
  return gulp.src(source)
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass(null, false).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
}

/*
Uglify / Clean CSS: ----------------------------------------------
*/

function uglify(dest) {
  return gulp.src(`${dest}**/!(*.min).css`)
    .pipe(plumber())
    .pipe(cleanCSS({ debug: true, compatibility: 'ie8' }, (details) => {
      console.log('Original Size : ' + details.name + ': ' + details.stats.originalSize + ' bytes');
      console.log('Minified Size : ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
    }))
    .pipe(rename((path) => {
      if (!path.extname.endsWith('.map')) {
        path.basename += '.min';
      }
    }))
    .pipe(gulp.dest(dest));
}

/*
Compress normal stylesheets: -------------------------------------
*/

gulp.task('default-stylesheets', async function() {
  await toCSS(STYLES_SRC_FILES, PIXLE_LANDING_STYLES_MIN_DEST_PATH);
  await uglify(PIXLE_LANDING_STYLES_MIN_DEST_PATH);
});

/*
Compress Task: ---------------------------------------------------
*/

gulp.task('compress', gulp.series('clear-css', 'default-stylesheets'));
gulp.task('compress-js', gulp.series('clear-js', 'default-js'));

export default function (localGulp) {
  localGulp.task('pixle-landing-compress', gulp.series('compress', 'compress-js'));
};

/*
Default Task: ----------------------------------------------------
*/

gulp.task('watch', () => {
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
