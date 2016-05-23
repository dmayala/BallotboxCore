var gulp = require('gulp');

gulp.task('fonts', function () {
  gulp.src([ './node_modules/bootstrap-sass/assets/fonts/bootstrap/*', './node_modules/font-awesome/fonts/*' ])
    .pipe(gulp.dest('./wwwroot/fonts/'));
});