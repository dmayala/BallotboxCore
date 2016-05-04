var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'dotnet'], function () {
    gulp.watch('app/stylesheets/**', ['sass']);  
});