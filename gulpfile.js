'use strict';

var gulp                  = require('gulp'),
        concat            = require('gulp-concat'),
        uglify            = require('gulp-uglify'),
        imagemin          = require('gulp-imagemin'),
        imageminJpegtran  = require('imagemin-jpegtran'),
        imageop           = require('gulp-image-optimization'),
        clean             = require('gulp-clean'),
        sourcemaps        = require('gulp-sourcemaps'),
        del               = require('del'),
        notify            = require('gulp-notify'),
        size              = require('gulp-size'),
        cache             = require('gulp-cache'),
        cached            = require('gulp-cached'),
        plumber           = require('gulp-plumber'),
        gutil             = require('gulp-util'),
        minifyHTML        = require('gulp-minify-html'),
        psi 			        = require('psi'),
	      ngrok 			      = require('ngrok'),
	      cp 				        = require('child_process'),
        browserSync       = require('browser-sync'),
        rename 			      = require('gulp-rename'),
        jshint 			      = require('gulp-jshint'),
        changed 		      = require('gulp-changed'),
        newer 			      = require('gulp-newer'),
	      parallel 		      = require('concurrent-transform'),
	      os 				        = require('os-utils'),
        cwebp 			      = require('gulp-cwebp'),
	      imageResize 	    = require('gulp-image-resize'),
        sequence          = require('run-sequence'),
        process           = require('gulp-exit'),
        connect           = require('gulp-connect'),
        minifyCss         = require('gulp-minify-css'),
        gzip              = require('gulp-gzip'),
        reload            = browserSync.reload,
        site              = '',
        portVal           = 8080;


var paths = {
  app: 'UP5-WebSiteOptimization/',
  scripts: {
    src: ['js/*', 'view/js/*'], 
    destProd: 		'html/build/js',
    script: 		'build/js/main.js',
		scriptProd: 	'html/build/js/main.js',
		scriptMin: 		'build/js/main.min.js',
		scriptMinProd: 	'html/build/js/main.min.js',
		bundleMain: 	'build/js/main.bundle.js',
		bundleMainMin:  'build/js/main.bundle.min.js',
    watch:  ['js/*', 'view/js/*']
   },
   jshint: {
		src: [
				'js/**/*.js',
				'views/js/*.js'
		]
	},
  images: {
    src:  			['img/*.{png, svg, gif, webp}', 'views/images/*.{png, svg, gif, webp}'],
    jpegSrc:    ['img/*.jpg', 'views/images/*.jpg'],
		dest: 			'build/img/',
		destProd: 	'html/build/img',
		watch:  		['img/*.{jpg, png, svg, gif, webp', 'views/images/*.{jpg, png, svg, gif, webp}'],
		watchOpt: 	'build/img/opt/*.{jpg, png, svg, gif, webp}',
		watchDest: 	'build/img/*.{jpg, png, svg, gif, webp}',
		watchProd: 	'html/build/img/**/*.{jpg, png, svg, gif, webp}' 
  },
  css: { 
    src: ['css/*', 'views/css/*'], 
    dest: 'html/build/css'
  },
  html: {
    dest: 'html',
    watch: ['index.html', '_layouts/*.html', '_includes/**/*', '_posts/**/*'],
  	watchProd: 'html/**/*.html'
  }
  
};

var messages = {
    udacityBuild: '<span style="color: grey">Running:</span> $ udacity build'
};


var onError	= function(err) {
	gutil.beep();
	gutil.log(gutil.colors.green(err + '\n'));
};

gulp.task('browser-sync', function() {
    browserSync({server: {baseDir: paths.html.dest}});
});

/**
 * Clean
 */

gulp.task('clear-cache', function(done) {
	return cache(cache.caches = {});
});

gulp.task('clean', function() {
   del(['html']);
   del(['build']);
  return gulp.src(paths.html.dest, {read: false})
    .pipe(clean())
    .pipe(notify('clean is done.\n'));
});

/**
 * Styles
 */
 gulp.task('build-css', function() {
  return gulp.src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(cache(gzip()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(notify('minify-css is done.\n'));
});
 
/**
 * Scripts
 */
gulp.task('jshint-gulp', function () {
	return gulp.src('gulpfile.js')
	    .pipe(cache(jshint('.jshintrc')))
        .pipe(jshint.reporter('jshint-stylish'))
	    .pipe(notify('jshint-gulp is done.\n'));
});

gulp.task('jshint', ['jshint-gulp'], function () {
	return gulp.src(paths.scripts.script)
	    .pipe(cache(jshint('.jshintrc')))
        .pipe(jshint.reporter('jshint-stylish'))
	    .pipe(notify('jshint-gulp is done.\n'));
});

gulp.task('concat', ['jshint'], function () {
	return gulp.src(paths.scripts.src)
		.pipe(concat('all.js'))
		.pipe(gulp.dest(paths.scripts.destProd))
		.pipe(size({showFiles: true}));
});

gulp.task('build-scripts', ['concat'], function () {
	return gulp.src(paths.scripts.bundleMain)
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(gulp.dest(paths.scripts.destProd))
		.pipe(notify('js is done.\n'));
});

gulp.task('js-reload', ['build-scripts'], function () {
	return gulp.src(paths.scripts.bundleMainMin)
		.pipe(plumber({errorHandler: onError}))
		.pipe(reload({stream:true}));
});

/**
 * Images
 */
 
gulp.task('image-opt',  function () {
    return gulp.src(paths.images.src)
       .pipe(cache(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
        })))
      .pipe(gulp.dest(paths.images.destProd))
      .pipe(notify('image-opt is done.\n'));
});

gulp.task('image-resize-sm', ['image-opt'], function () {
	return 	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width 	: 400,
			height 	: 300,
			crop 	: true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-sm'}))
		.pipe(gulp.dest(paths.images.dest))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(paths.images.destProd));
	});

gulp.task('image-resize-md', ['image-resize-sm'], function () {
	return	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width : 800,
			height : 600,
			crop : true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-md'}))
	    .pipe(gulp.dest(paths.images.dest))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(paths.images.destProd));
});

gulp.task('image-resize-lg', ['image-resize-md'], function () {
	return	gulp.src(paths.images.watchOpt)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.dest))
		.pipe(parallel(imageResize({
			width : 1200,
			height : 900,
			crop : true,
			upscale : false
		}), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); })))
	    .pipe(rename({suffix: '-lg'}))
		.pipe(size({showFiles: true}))
	    .pipe(gulp.dest(paths.images.dest))
		.pipe(gulp.dest(paths.images.destProd));
});

gulp.task('build-images', ['image-resize-lg'], function () {
	return gulp.src(paths.images.watchProd)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(paths.images.watchDest))
	    .pipe(parallel(cwebp()), os.cpuUsage(function(v) { console.log( 'CPU Usage (%): ' + v ); }))
	    .pipe(gulp.dest(paths.images.dest))
	    .pipe(gulp.dest(paths.images.destProd))
	    .pipe(notify('cwebp is done.\n'));
});

gulp.task('img-reload', ['build-images'], function () {
	return gulp.src(paths.images.destProd)
		.pipe(plumber({errorHandler: onError}))
		.pipe(reload({stream:true}))
	  .pipe(notify('img-reload is done.\n'));
});
/**
 * build
 */
 


gulp.task('udacity', function() {
  	return gulp.src(paths.html.watchProd)
	    .pipe(minifyHTML())
	    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('udacity-rebuild', ['udacity'], function () {
    reload();
});

/**
 * ngrok
 */
 
 /*gulp.task('browser-sync-psi', ['udacity-rebuild'], function() {
  browserSync({
    port: portVal,
    open: false,
    server: {
      baseDir: paths.app
    }
  });
});*/

 gulp.task('server-start',  function (done) {
   return connect.server({
     livereload: true
    });
});

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(portVal, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-desktop', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'desktop'
  }, function (err, data) {
    console.log('-----------*Desktop*-------------')
    console.log('Score: ', data.score);
    console.log(data.pageStats);
  });
});

gulp.task('psi-mobile', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'mobile'
  }, function (err, data) {
    console.log('-----------*Mobile*-------------')
    console.log('Score: ', data.score);
    console.log(data.pageStats);
  });
});

gulp.task('psi-seq', function (cb) {
  return sequence(
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

gulp.task('psi', ['psi-seq'], function() {
  console.log('Woohoo! Check out your page speed scores!')
  //process.exit();
});

/**
 * Watch
 */

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts.watch, ['js-reload']);
  gulp.watch(paths.images.watch, ['img-reload']);
});


gulp.task('optimize', function(callback) {
  sequence('clean',
              'watch',
              ['build-css', 'build-scripts', 'build-images'],
              //'build-html',
              'psi',
              'server-start',
              callback);
});