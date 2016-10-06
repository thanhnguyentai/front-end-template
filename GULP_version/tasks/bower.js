
// user gulp-main-bower-files
var plugins = require("gulp-load-plugins")();

module.exports = function(gulp, options, plugins) {

    var project = options.project;

    // files: {
    //     '<%= project.dirs.scripts.bower %>/require.js': 'requirejs/require.js',
    //     '<%= project.dirs.scripts.bower %>/velocity.js': 'velocity/velocity.js',
    //     '<%= project.dirs.scripts.bower %>/velocity.ui.js': 'velocity/velocity.ui.js',
    //     '<%= project.dirs.scripts.bower %>/jquery.form.js': 'jquery-form/jquery.form.js',
    //     '<%= project.dirs.scripts.bower %>/jquery.validate.js': 'jquery-validation/dist/jquery.validate.js',
    //     '<%= project.dirs.scripts.bower %>/jquery.validate.additional.js': 'jquery-validation/dist/additional-methods.js',
    //     '<%= project.dirs.scripts.bower %>/underscore.js': 'underscore/underscore.js',
    //     '<%= project.dirs.scripts.bower %>/fastclick.js': 'fastclick/lib/fastclick.js',
    //     '<%= project.dirs.scripts.bower %>/backbone.js': 'backbone/backbone.js',
    //     '<%= project.dirs.scripts.bower %>/picturefill.js': 'picturefill/src/picturefill.js'
    // }

    gulp.task('bower-copy', function() {
        return gulp.src('./../bower.json')
                .pipe(plugins.mainBowerFiles({
                    overrides: {
                        requirejs : {
                            main: ["./require.js"]
                        },
                        velocity: {
                            main: ["./velocity.js", "./velocity.ui.js"]
                        },
                        "jquery-form": {
                            main: ["./jquery.form.js"]  
                        },
                        "jquery-validation": {
                            main: ["./dist/jquery.validate.js", "./dist/additional-methods.js"]
                        },
                        underscore: {
                            main: ["./underscore.js"]
                        },
                        fastclick: {
                            main: ["./lib/fastclick.js"]
                        },
                        backbone: {
                            main: ["./backbone.js"]
                        },
                        picturefill: {
                            main: ["./src/picturefill.js"]
                        },

                        // ignore ones
                        "requirejs-plugins": {
                            ignore: true
                        },
                        handlebars: {
                            ignore: true
                        },
                        "handlebars-helpers": {
                            ignore: true
                        },
                        jquery: {
                            ignore: true
                        }
                    }
                }))
                .pipe(gulp.dest(project.dirs.scripts.bower));
    });
}