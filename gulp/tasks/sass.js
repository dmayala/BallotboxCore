var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var handleErrors = require('../util/handleErrors');
var browserSync = require('browser-sync');

gulp.task('sass', function () {
    gulp.src('./app/stylesheets/**/*.scss')
      .pipe(sass({
          includePaths: [
            './node_modules/bootstrap-sass/assets/stylesheets',
            './node_modules/font-awesome/scss'
          ],
          outputStyle: 'compressed'
      }))
      .pipe(concatCss('app.css'))
      .pipe(gulp.dest('./wwwroot/css'))
      .pipe(browserSync.stream()); 
      
});