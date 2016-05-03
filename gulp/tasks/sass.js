var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var handleErrors = require('../util/handleErrors');

gulp.task('sass', function () {
    gulp.src('./app/stylesheets/**/*.scss')
      .pipe(sass({
          includePaths: [
            './node_modules/bootstrap-sass/assets/stylesheets'
          ],
          outputStyle: 'compressed'
      }))
      .pipe(concatCss('app.css'))
      .pipe(gulp.dest('./wwwroot/css'));
});