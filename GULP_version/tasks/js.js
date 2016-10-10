

var plugins = require("gulp-load-plugins")();

var runSequence  = require("run-sequence");
var path 	     = require('path');
var fs  	  	 = require("fs");

module.exports = function(gulp, options, plugins) {

    var project = options.project;

    gulp.task('handlebars', function() {
    });

    gulp.task("require:dev", function() {
		return gulp.src(path.join(project.dirs.scripts.main, "**/*.js"))
        .pipe(gulp.dest(project.dirs.scripts.outCompiled));
	});

    gulp.task("js-deploy:copy", function() {
        return gulp.src(path.join(project.dirs.scripts.main, "**/*.js"))
        .pipe(gulp.dest(project.dirs.scripts.out));
    });

    gulp.task("require:deploy", function() {
        var requireConfig = {
            baseUrl: 'js',
            paths: {
                base: 'src',
                jquery: 'lib/jquery',
                videojs: 'lib/video',
                youtube_video_js: 'lib/Youtube',
                moment: 'lib/moment',
                underscore: 'lib/bower/underscore',
                backbone: 'lib/bower/backbone',
                vendor: 'lib/bower',
                templates: 'templates',
                pikaday: 'lib/pikaday',
            },
            map: {
                '*': {
                    'handlebars': 'vendor/handlebars',
                    'velocity': 'vendor/velocity'
                }
            },
            shim: {
                'vendor/handlebars': {
                    exports: 'Handlebars'
                },
                'lib/owl.carousel': {
                    exports: 'jQuery.fn.owlCarousel',
                    deps: [
                        'jquery'
                    ]
                },
                'lib/pikaday.jquery': {
                    deps: [
                        'jquery',
                        'moment'
                    ]
                },
                'lib/jquery.fancybox': {
                    deps: [
                        'jquery'
                    ]
                },
                'lib/jquery.fancybox-buttons': {
                    deps: [
                        'jquery'
                    ]
                }
            }
        };

        var options = {
            umd: false
        };


        return gulp.src(path.join(project.dirs.scripts.main, "**/*.js"))
        .pipe(plugins.amdOptimizer(requireConfig, options))
        .pipe(plugins.concat("scripts.js"))
        // .pipe(plugins.uglify())
        .pipe(gulp.dest(project.dirs.scripts.out));
    
	});

	gulp.task("js:dev", function() {
        runSequence('handlebars', ['require:dev']);
    });

	gulp.task("js:deploy", function() {
        runSequence('handlebars','js-deploy:copy', 'require:deploy');
    });
}