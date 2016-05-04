var gulp = require('gulp');
var nodemon = require('nodemon');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');

gulp.task('dotnet', ['build'], function () {
  nodemon({
    watch: 'controllers',
    ext: 'cs',
    exec: 'dnx weblistener',
    ignore: [ 'node_modules/', 'wwwroot/', 'app/' ]
  })
  .on('start', function () {
    browserSync({
        proxy: 'localhost:5000',
        port: 5001
    });
  })
  .on('restart', function () {
    gutil.log('[Nodemon] ' + gutil.colors.green("'detected change, restarting'") + ' ...');
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 3000);
  });
});