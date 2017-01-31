'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  source = require('vinyl-source-stream'),
  babelify = require('babelify'),
  path = require('path'),
  fs = require('fs');

gulp.task('build', () =>{
  return gulp.src('./src/**/*.js')
    .pipe($.cached('server'))
    .pipe($.babel())
    .pipe(gulp.dest('./build'))
});

gulp.task('watch:build', gulp.series(
  'build',
  () => gulp.watch('./src/**/*.js', gulp.series('build'))
));
