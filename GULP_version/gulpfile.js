var gulp 		 = require("gulp"),
	fs  	  	 = require("fs"),
	runSequence  = require("run-sequence"),
	w3cjs        = require("w3cjs"),
	path 		 = require('path'),
	gw3cjs		 = require("gulp-w3cjs"),
	loadGulpTask = require('load-gulp-tasks');

var plugins = require("gulp-load-plugins")();
var project = require('./Gulpproject.js');
var helpers = require('./Gulphelpers.js')(false);

var options = {
	project: project,
	helpers: helpers
};

// Will check in the future if need
gulp.task("jade", function () {
	return gulp.src([paths.jade + "**/[^_]*.jade"])
		.pipe(plugins.data(function(file) {
			return JSON.parse(
				fs.readFileSync('./jade/data/data.json')
			);
		}))
		.pipe(plugins.plumber({
			errorHandler:onError
		}))
		.pipe(plugins.jade({
			pretty: true
		}))
		.pipe(plugins.w3cjs())
		.pipe(gulp.dest(paths.dist));
});


/*================== All taskes will be registered here ======================*/

loadGulpTask(gulp, options);

// Build Tasks =================>
gulp.task('build-dev', function(done) {
	runSequence('clean-dev', 'watch:dev', ['assemble', "css:dev", "js:dev", 'copy:dev']);
});

gulp.task('build-deploy', function() {
	runSequence('clean-deploy', ['css:deploy', 'js:deploy', 'copy:deploy'])
});



// default task when calling "gulp"  =================>
gulp.task('default', ['build-dev']);

gulp.task('deploy', ['build-deploy']);