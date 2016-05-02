var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('browserSync', ['build'], function () {
    browserSync({
        proxy: 'localhost:5000',
        port: 5001,
        files: [
          './wwwroot'
        ]
    });
});