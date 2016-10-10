

var runSequence  = require("run-sequence");
var path 	     = require('path');

module.exports = function(gulp, options, plugins) {

    var project = options.project;
    var helpers = options.helpers;

    gulp.task('handlebars', function() {
        return gulp.src(path.join(project.dirs.views.partials, "**/precompile/*.hbs"))
        .pipe(plugins.handlebars())
        .pipe(plugins.defineModule('amd', {
            namespace: false,
            require: {
                Handlebars: 'vendor/handlebars', 
                HandlebarsHelper: 'vendor/handlebars-helpers', 
                HandlebarsExtension: 'base/modules/handlebars-extension'
            }
        }))
        .pipe(plugins.flatten())
        .pipe(gulp.dest(project.dirs.scripts.templates));
    });

    gulp.task("require:dev", function() {
		return gulp.src(path.join(project.dirs.scripts.main, "**/*.js"))
        .pipe(gulp.dest(project.dirs.scripts.outCompiled));
	});

    gulp.task("require:deploy", function() {
        var requireConfigFile = require("../" + path.join(project.dirs.scripts.main, 'require-config.js'));

        var requireConfig = {};

        requireConfig.name           = "../../node_modules/almond/almond";
        requireConfig.baseUrl        = project.dirs.scripts.main;
        requireConfig.mainConfigFile = path.join(project.dirs.scripts.main, 'require-config.js');
        requireConfig.insertRequire  = ["main"];
        requireConfig.optimize       = "none";
        requireConfig.wrap           = true;
        requireConfig.include        = ['require-config', 'main'].concat(helpers.getIncludeAliases(helpers.getIncludes(requireConfigFile, project.dirs.scripts.main)));

        return gulp.src(path.join(project.dirs.scripts.main, "main.js")) 
        .pipe(plugins.requirejsOptimize(requireConfig))
        .pipe(plugins.concat("scripts.js"))
        // .pipe(plugins.uglify())
        .pipe(gulp.dest(project.dirs.scripts.out));
    
	});

	gulp.task("js:dev", function() {
        runSequence('handlebars', ['require:dev']);
    });

	gulp.task("js:deploy", function() {
        runSequence('handlebars','require:deploy');
    });
}