var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function () {
    gulp.watch('app/stylesheets/**', ['sass']);  
});