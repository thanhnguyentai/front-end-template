var gulp 		 = require("gulp"),
	// sass 		 = require("gulp-sass"),
	// jade 		 = require("gulp-jade"),
	// sourcemaps   = require("gulp-sourcemaps"),
	// watch 		 = require("gulp-watch"),
	// postcss      = require("gulp-postcss"),
	// csscomb      = require("gulp-csscomb"),
	// concat       = require("gulp-concat"),
	// cssbeautify  = require("gulp-cssbeautify"),
	// gutil 		 = require("gulp-util"),
	// plumber      = require("gulp-plumber"),
	// favicons     = require("gulp-favicons"),
	// replace  	 = require("gulp-replace"),
	// prettify  	 = require("gulp-prettify"),
	// gulpIgnore   = require("gulp-ignore"),
	// gdata   	 = require("gulp-data"),
	// guglify   	 = require("gulp-uglify"),
	// gif   	     = require("gulp-if"),
	// gcleancss  	 = require("gulp-clean-css"),
	// babel  	     = require("gulp-babel"),
	assemble     = require("assemble"),
	fs  	  	 = require("fs"),
	browserSync  = require("browser-sync").create(),
	cssnano      = require("cssnano"),
	autoprefixer = require("autoprefixer"),
	runSequence  = require("run-sequence"),
	del          = require("del"),
	w3cjs        = require("w3cjs"),
	path 		 = require('path'),
	// gw3cjs		 = require("gulp-w3cjs");

	loadGulpTask = require('load-gulp-tasks');

var plugins = require("gulp-load-plugins")();
var project = require('./Gulpproject.js');
var helpers = require('./Gulphelpers.js')(false);

var options = {
	project: project,
	helpers: helpers
};

var optimize = true;

var onError = function (err) {
	gutil.beep();
	console.log(err);
};

gulp.task('copy', function() {
	gulp.src(paths.dist + "**")
		.pipe(gulp.dest(paths.compile));
});

gulp.task("cleanFavicons", function () {
	return del(paths.favicons);
});

gulp.task("favicons", ["cleanFavicons"], function () {
	return gulp.src(paths.images + "favicons.png").pipe(favicons({
		appName: "ARPRO",
		appDescription: "",
		developerName: "Hieu Nguyen",
		developerURL: "http://trunghieunguyen.com/",
		background: "#020307",
		path: paths.favicons,
		url: "http://niteco.com",
		display: "browser",
		orientation: "portrait",
		version: 1.0,
		logging: false,
		online: false,
		html: "./html/index.html",
		pipeHTML: true,
		replace: true,
		icons: {
			android: false,
			appleIcon: false,
			appleStartup: false,
			favicons: true,
			firefox: true,
			windows: false,
			yandex: false
		}
	}))
	.on("error", gutil.log)
	.pipe(gulp.dest(paths.favicons));
});

gulp.task('replace', function() {
	return gulp.src([paths.dist + "**/[^_]*.html"])
	.pipe(replace(/<!--insert:favicons-->/, function(s) {
		var favicons = fs.readFileSync(paths.favicons + 'html/index.html', 'utf8');
		return favicons;
	}))
	.pipe(gulp.dest(paths.dist));
});

gulp.task("sass", function () {
	var processors = [
		autoprefixer({
			browsers: ["> 0%"]
		})
	];
	/*if (optimize) {
		processors.push(cssnano({ safe: true, convertValues: false }));
	}*/
	return gulp.src(paths.scss + "*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [
				paths.scss,
				paths.bower + "csswizardry-grids/",
				paths.bower + "bourbon/app/assets/stylesheets/",
				paths.bower + "font-awesome-sass/assets/stylesheets/",
				paths.bower + "slick-carousel/slick/",
				paths.bower + "Easy-Responsive-Tabs-to-Accordion/css/",
				paths.bower + "typecsset/", 
				paths.node  + "video.js/dist/video-js.css"
			]
		}).on("error", sass.logError))
		// .pipe(postcss(processors))
		// .pipe(csscomb())
		// .pipe(gif(optimize != true, cssbeautify({
		// 	indent: '	',
		// 	openbrace: 'end-of-line', //end-of-line, separate-line
		// 	autosemicolon: false
		// })))
		// .pipe(gif(optimize, gcleancss()))
		// .pipe(gif(optimize != true, sourcemaps.write(".")))
		.pipe(gulp.dest(paths.dist + "css/"));
		// .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task("jade", function () {
	return gulp.src([paths.jade + "**/[^_]*.jade"])
		.pipe(gdata(function(file) {
			return JSON.parse(
				fs.readFileSync('./jade/data/data.json')
			);
		}))
		.pipe(plumber({
			errorHandler:onError
		}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gw3cjs())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('prettify', function() {
	gulp.src(paths.dist + '*.html')
		.pipe(prettify({
			indent_with_tabs: true,
			preserve_newlines: true,
			end_with_newline: true,
			"brace-style": "end-expand",
			"indent-inner-html": true
		}))
		.pipe(gulp.dest(paths.dist))
});

gulp.task("clean", function () {
	return del(paths.dist);
});

gulp.task("cleanCompiled", function () {
	return del(paths.compile, {force: true});
});

gulp.task("copyToCompiled", function (done) {
	runSequence("cleanCompiled", ["copy"], done);
});

gulp.task("images", function() {
	return gulp.src(['!' + paths.images + 'favicons.png', '!' + paths.images + 'favicons/html/*.*', paths.images + "**/*.*"])
		.pipe(gulp.dest(paths.dist + "images/"));
});

gulp.task("fonts", function() {
	return gulp.src(paths.fonts + "**/*.*")
		.pipe(gulp.dest(paths.dist + "fonts/"));
});

gulp.task("copyJS", function() {
	return gulp.src([paths.bower + "ExplorerCanvas/excanvas.js", paths.js + "jquery-1.9.1.min.js"])
		.pipe(gulp.dest(paths.dist + "js/"));
});

gulp.task("build", function (done) {
	runSequence("clean", ["sass", "jade", "vendor-js", "copyJS"], ["replace"], ["prettify"], done);
});

gulp.task("watch", ["build"], function () {
	gulp.watch(paths.scss + "**/*.scss", ["sass"]);
	gulp.watch(paths.jade + "**/*.*", ["jade"]);
	gulp.watch(paths.js + "**/*.*", ["vendor-js"]);
});

gulp.task("vendor-js", function () {
	return gulp.src([
		paths.node + "es5-shim/es5-shim.js", 
        //paths.bower + "jquery/dist/jquery.min.js",
		//paths.js + "jquery-1.9.1.min.js",
		paths.bower + "slick-carousel/slick/slick.min.js",
		paths.bower + "jquery.easy-pie-chart/dist/jquery.easypiechart.js", 
		//paths.bower + "Easy-Responsive-Tabs-to-Accordion/js/easyResponsiveTabs.js",
		paths.js + "easyResponsiveTabs.js",
		paths.js + "dropdown.js",
		//paths.js + "mediaelement-and-player.js", 
		//paths.node + "video.js/dist/*.js", 
		paths.js + "custom.js",
		paths.js + "ar-map.js" 
		
	])
	.pipe(concat("vendor.min.js"))
	.pipe(gif(optimize, guglify({
		compress: {
			drop_console: true
		}
	})))
	//.pipe(babel())
	.pipe(gulp.dest(paths.dist + "js/"));
});


/*================== All taskes will be registered here ======================*/

loadGulpTask(gulp, options);


// JavaScript Tasks =================>
gulp.task('js-dev', ["handlebars", "requirejs:dev"]);

gulp.task('js-deploy', ["handlebars", "requirejs:deploy", "uglify"]);



// Copy Tasks =================>
gulp.task('copy-dev', ["copy:imagesCompiled", "copy:fontsCompiled", "copy:videosCompiled"]);

gulp.task('copy-deploy', ["copy:images", "copy:fonts", "copy:videos"]);


// Build Tasks =================>
gulp.task('build-dev', function(done) {
	runSequence('clean-dev', ['assemble', "css:dev", "js:dev", 'copy:dev']);
});

gulp.task('build-deploy', function() {
	runSequence('clean-deploy', ['css:deploy', 'js:deploy', 'copy:deploy'])
});



// default task when calling "gulp"  =================>
gulp.task('default', ['build-dev']);

gulp.task('deploy', ['build-deploy']);