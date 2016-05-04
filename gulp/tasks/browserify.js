/*
 *  browserify task 
 *  ----------------
 *  Bundle javascript things with browserify!
 *
 *  If the watch task is running, this uses watchify instead
 *  of browserify for faster bundling using caching.
 */

var browserify = require('browserify');
var babelify = require('babelify');
var tsify = require('tsify');
var debowerify = require('debowerify');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');

gulp.task('browserify', function () {
    var bundler = browserify({
        // required watchify args
        cache: {}, packageCache: {}, fullPaths: true,
        // specify app entry point
        entries: ['./app/index.tsx', './typings/browser.d.ts', './app/typings/custom.d.ts'],
        // file extensions
        extensions: ['.ts', '.tsx'],
        // Enable source maps
        debug: true
    })
      .plugin(tsify)
      .transform(debowerify)
      .transform(babelify);

    var bundle = function () {
        // log when bundling starts
        bundleLogger.start();
        bundler
          .bundle()
          // report compile error
          .on('error', handleErrors)
          // make stream gulp compatible -specify output name
          .pipe(source('app.js'))
          // specify output destination
          .pipe(gulp.dest('./wwwroot/js'))
          // log when bundling completes
          .on('end', function () {
            browserSync.reload({ stream: false });
            bundleLogger.end()
          });
    }

    if (global.isWatching) {
        bundler = watchify(bundler);
        bundler.on('update', bundle);
    }

    return bundle();
});
