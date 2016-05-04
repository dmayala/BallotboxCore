var gulp = require('gulp');
var nodemon = require('nodemon');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var _ = require('lodash');

var initBrowserSync = _.once(function () {
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
});

gulp.task('dotnet', function () {
  nodemon({
    watch: 'Controllers',
    ext: 'cs',
    exec: 'dnx web',
    ignore: [ 'node_modules/', 'wwwroot/', 'app/' ]
  })
  .on('start', initBrowserSync)
  .on('restart', function () {
    gutil.log('[Nodemon] ' + gutil.colors.green("'detected change, restarting'") + ' ...');
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 2500);
  });
});