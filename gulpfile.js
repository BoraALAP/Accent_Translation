const gulp = require('gulp');
const sass = require('gulp-sass');
const watchSass = require("gulp-watch-sass");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const browserify = require('gulp-browserify');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');


const src = 'dev/', dist = 'public/';

gulp.task('sass', function() {
  return gulp.src(src+'scss/**/*.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
    })  
  	.pipe(sourcemaps.init())
  	.pipe(sass({style: 'compressed'}))
  	.pipe(cleanCSS({compatibility: 'ie8'}))
  	.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))  	
    .pipe(sourcemaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(dist+'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp.src(src+'script/**/*.js')
      
      .pipe(browserify())
      // .pipe(uglify())
      .pipe(babel())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(dist+'js'))
});

gulp.task('js-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('watch', ['js'], function() {
  browserSync.init({
    server: {
      baseDir: "./"
  }
  });
  gulp.watch(src+"script/*.js", ['js-watch']);
  gulp.watch(src+"scss/**/*.scss", ['sass']);
  
  gulp.watch("*.html").on('change', browserSync.reload);
});


