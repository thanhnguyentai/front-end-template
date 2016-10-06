

// user gulp-sass, gulp-sourcemaps

var plugins = require("gulp-load-plugins")();

module.exports = function(gulp, options, plugins) {

    var project = options.project;

	gulp.task("css:dev", function() {
		return gulp.src(project.dirs.styles.main + "/*.scss")
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({
				includePaths: [
					project.dirs.styles.main,
					project.dirs.styles.partials
				]
			}).on("error", plugins.sass.logError))
			.pipe(plugins.autoprefixer({
				browsers: ['last 2 versions', 'ie 9']
			}))
			.pipe(plugins.sourcemaps.write(".")) // write to current directory
			.pipe(gulp.dest(project.dirs.styles.outCompiled));
	});


	gulp.task("css:deploy", function() {
		return gulp.src(project.dirs.styles.main + "/*.scss")
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass({
				includePaths: [
					project.dirs.styles.main,
					project.dirs.styles.partials
				]
			}).on("error", plugins.sass.logError))
			.pipe(plugins.autoprefixer({
				browsers: ['last 2 versions', 'ie 9']
			}))
			.pipe(plugins.cleanCss({
				compatibility: 'ie8',
				keepSpecialComments: false
			}))
			.pipe(plugins.sourcemaps.write(".")) // write to current directory
			.pipe(gulp.dest(project.dirs.styles.out));
	});
}