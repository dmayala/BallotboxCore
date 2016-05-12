var gulp = require('gulp');

gulp.task('fonts', function () {
    gulp.src([ './node_modules/bootstrap-sass/assets/fonts/bootstrap/*' ])
        .pipe(gulp.dest('./wwwroot/fonts/bootstrap'))  
});