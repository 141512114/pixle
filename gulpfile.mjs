/* jshint node: true */

import gulp from 'gulp';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import rename from 'gulp-rename';
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

// Paths
const DEV_SRC_PATH = path.join(__dirname, 'local');
const STYLES_SRC_FILES = path.join(DEV_SRC_PATH, 'stylesheets', 'scss', '**', '!(_*)*.scss');
const STYLES_MIN_DEST_PATH = path.join(DEV_SRC_PATH, 'stylesheets', 'css');

const BOOTSTRAP_SRC_FILES = path.join(DEV_SRC_PATH, 'stylesheets', 'bootstrap', '**', '!(_*)*.scss');
const BOOTSTRAP_MIN_DEST_PATH = path.join(STYLES_MIN_DEST_PATH, 'bootstrap');

const STYLES_DEL_PATTERN = [
  path.join(STYLES_MIN_DEST_PATH, '**'),
  '!' + path.join(BOOTSTRAP_MIN_DEST_PATH, '**'),
];

const BOOTSTRAP_DEL_PATTERN = [
  path.join(BOOTSTRAP_MIN_DEST_PATH, '**'),
];

// Function to clear styles
async function clearStyles(pattern) {
  const deletedFilePaths = await deleteAsync(pattern);
  console.log('Deleted files:\n', deletedFilePaths.join('\n'));
}

// Tasks to clear styles
gulp.task('clear-css', async function() {
  await clearStyles(STYLES_DEL_PATTERN);
});
gulp.task('clear-bootstrap', async function() {
  await clearStyles(BOOTSTRAP_DEL_PATTERN);
});

// Function to compile SCSS to CSS
async function compileCSS(source, dest) {
  return new Promise((resolve) => {
    gulp.src(source)
      .pipe(plumber())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass(null, false).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
}

// Function to minify CSS
async function minifyCSS(source, dest) {
  return new Promise((resolve) => {
    gulp.src(source)
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
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
}

// Task to compile default stylesheets
gulp.task('default-stylesheets', gulp.series(
  () => compileCSS(STYLES_SRC_FILES, STYLES_MIN_DEST_PATH),
  () => minifyCSS([path.join(STYLES_MIN_DEST_PATH, '**', '!(*.min).css'), '!' + path.join(BOOTSTRAP_MIN_DEST_PATH, '**/*')], STYLES_MIN_DEST_PATH)
));

// Task to compile bootstrap stylesheets
gulp.task('bootstrap-stylesheets', gulp.series(
  () => compileCSS(BOOTSTRAP_SRC_FILES, BOOTSTRAP_MIN_DEST_PATH),
  () => minifyCSS(path.join(BOOTSTRAP_MIN_DEST_PATH, '**', '!(*.min).css'), BOOTSTRAP_MIN_DEST_PATH)
));

// Task to clear, compile and minify all stylesheets
gulp.task('compress', gulp.series('clear-css', 'default-stylesheets'));
gulp.task('bootstrap', gulp.series('clear-bootstrap', 'bootstrap-stylesheets'));
gulp.task('combined', gulp.series('bootstrap', 'compress'));

// Load tasks from external gulpfiles
async function loadGulpTasks(gulpfilePath) {
  const gulpfileURL = pathToFileURL(gulpfilePath).href;
  const gulpfile = await import(gulpfileURL);
  if (typeof gulpfile.default === 'function') {
    gulpfile.default(gulp); // In case the gulpfile exports a default function to receive the gulp instance
  }
}

await loadGulpTasks(path.resolve(__dirname, 'projects/pixle-game/gulpfile.mjs'));
await loadGulpTasks(path.resolve(__dirname, 'projects/pixle-landing/gulpfile.mjs'));

// Task to combine all compress tasks
gulp.task('everything', gulp.series('combined', 'pixle-game-compress', 'pixle-landing-compress'));

// Default task to watch stylesheets
gulp.task('watch', () => {
  gulp.watch(STYLES_SRC_FILES, gulp.series('compress'));
});

gulp.task('default', gulp.series('compress', 'watch'));
