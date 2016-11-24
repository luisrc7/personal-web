var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var request = require('request');
var merge = require('merge2');
var buffer = require('gulp-buffer');
var gzip = require('gulp-gzip');

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('styles', ['sass'], function() {
  var bootstrap = request('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
    .pipe(source('bootstrap.css'));
  var fonts = request('https://fonts.googleapis.com/css?family=Roboto:300,300i')
    .pipe(source('fonts.css'));
  var main = gulp.src([
    'css/*.css',
    '!css/all*'
  ]);

  return merge(fonts, bootstrap, main)
    .pipe(buffer())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./css'))
    .pipe(rename('all.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gzip())
    .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
  var jquery = request('https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js')
    .pipe(source('jquery.js'));
  var bootstrap = request('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
    .pipe(source('bootstrap.js'));
  var main = gulp.src([
    'js/*.js',
    '!js/all*'
  ]);

  return merge(jquery, bootstrap, main)
    .pipe(buffer())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./js'));
});

gulp.task('compile', ['scripts', 'styles']);

gulp.task('default', ['sass:watch']);