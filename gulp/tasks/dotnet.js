var gulp = require('gulp');
var nodemon = require('nodemon');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');

gulp.task('dotnet', ['build'], function () {
  nodemon({
    watch: 'Controllers',
    ext: 'cs',
    exec: 'dnx web',
    ignore: [ 'node_modules/', 'wwwroot/', 'app/' ]
  })
  .on('start', function () {
    browserSync({
        proxy: {
            target: 'localhost:5000',
            proxyReq: [
                function (proxyReq) {
                  proxyReq.setHeader('Connection', 'keep-alive');
                }
            ]
        },
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