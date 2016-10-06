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
	path 		 = require('path');
	// gw3cjs		 = require("gulp-w3cjs");

var plugins = require("gulp-load-plugins")();
var project = require('./Gulpproject.js');
var helpers = require('./Gulphelpers.js')(false);

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

gulp.task("test", ["watch"], function () {
	browserSync.init({
		server: {
			baseDir: ["./_compiled/", "./"]
		}
	});
});

gulp.task("deploy", function (done) {
	optimize = true;
	runSequence("clean", ["sass", "jade", "vendor-js", "images", "fonts", "copyJS"], ["replace"], ["prettify"], done);
});

gulp.task('default', ["deploy"]);


/*================== All taskes will be registered here ======================*/

// Clean tasks =================>
gulp.task('clean-static', function(done) {
	return del(project.dirs.static.main + "/*");
});
gulp.task('clean-templates', function(done) {
	return del(project.dirs.scripts.templates + "/*");
});
gulp.task('clean-styles', function(done) {
	return del(project.dirs.styles.out + "/*");
});
gulp.task('clean-images', function(done) {
	return del(project.dirs.images.out + "/*");
});
gulp.task('clean-scripts', function(done) {
	return del(project.dirs.scripts.out + "/*");
});
gulp.task('clean-fonts', function(done) {
	return del(project.dirs.fonts.out + "/*");
});

gulp.task('clean-dev', ['clean-static', "clean-templates"]);

gulp.task('clean-deploy', ['clean-styles', "clean-images", "clean-scripts", "clean-fonts", "clean-templates"]);


// CSS Tasks =================>
gulp.task("sass-dev", function () {
	var processors = [
		autoprefixer({
			browsers: ['last 2 versions', 'ie 9']
		})
	];
	return gulp.src(project.dirs.styles.main + "/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [
				project.dirs.styles.main,
				project.dirs.styles.partials
			]
		}).on("error", sass.logError))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(project.dirs.styles.outCompiled));
});
gulp.task('css-dev', function(done) {
	runSequence("sass:dev",["autoprefixer"]);
});

gulp.task('css-deploy', ["sass:deploy","autoprefixer","cssmin"]);



// JavaScript Tasks =================>
gulp.task('js-dev', ["handlebars", "requirejs:dev"]);

gulp.task('js-deploy', ["handlebars", "requirejs:deploy", "uglify"]);



// Copy tasks =================>
gulp.task('copy-dev', ["copy:imagesCompiled", "copy:fontsCompiled", "copy:videosCompiled"]);

gulp.task('copy-deploy', ["copy:images", "copy:fonts", "copy:videos"]);



// Static Tasks =================>

gulp.task('assemble-static', function() {
	var app = assemble();
	
	app.option({
		layout: "static"
	});

	app.data(path.join(project.dirs.base, 'data/**/*.json'));
	app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
	app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));

	return app.src(path.join(project.dirs.base, "index.hbs"))
			.pipe(app.renderFile())
			.pipe(plugins.extname())
			.pipe(app.dest(project.dirs.static.main));
});

gulp.task('assemble-view', function() {
	var app = assemble();
	
	app.option({
		layout: "view"
	});

	app.data(path.join(project.dirs.base, 'data/**/*.json'));
	app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
	app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));
	
	/*
		This code works well,
		but in case like 
		app.pages(path.join(project.dirs.views.main, 404.hbs")) or
		app.page(path.join(project.dirs.views.main, 404.hbs"))
		the output will put at a WRONG PLACE,

		to make it work right, change it to
		app.pages(path.join(project.dirs.views.main, 404*.hbs"))
		SO STRANGE

		app.pages(path.join(project.dirs.views.main, "[!404,!_]*.hbs"));
		return app.toStream("pages")
				.pipe(app.renderFile())
				.pipe(plugins.extname())
				.pipe(app.dest(project.dirs.static.main));

	*/ 

	return app.src(path.join(project.dirs.views.main, "[!404,!_]*.hbs"))
			.pipe(app.renderFile())
			.pipe(plugins.extname())
			.pipe(app.dest(project.dirs.static.main));

});

gulp.task('assemble-404', function() {
	var app = assemble();
	
	app.option({
		layout: "404"
	});

	app.data(path.join(project.dirs.base, 'data/**/*.json'));
	app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
	app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));

	return app.src(path.join(project.dirs.views.main, "404.hbs"))
			.pipe(app.renderFile())
			.pipe(plugins.extname())
			.pipe(app.dest(project.dirs.static.main));

});

gulp.task('assemble', ['assemble-static', 'assemble-view', 'assemble-404']);



// Bower Task ==================>
gulp.task('clone-bower', ["bowercopy:deps"]);



// Build Tasks =================>
gulp.task('build-frontend', function(done) {
	runSequence('clean-dev', ['assemble', "css-dev", "js-dev", 'copy-dev'], "watch");
});

gulp.task('build-deploy', ['clean-deploy', 'css-deploy', 'js-deploy', 'copy-deploy']);



// default task when calling "gulp"  =================>
gulp.task('default', ['build-frontend']);

gulp.task('deploy', ['build-deploy']);