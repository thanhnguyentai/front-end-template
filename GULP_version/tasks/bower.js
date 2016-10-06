

// user gulp-main-bower-files, gulp-flatten, gulp-rename

var plugins = require("gulp-load-plugins")();

module.exports = function(gulp, options, plugins) {

    var project = options.project;

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
                .pipe(plugins.rename(function(path){
                    if(path.dirname.indexOf("jquery-validation") >=0  && path.basename.indexOf("additional-methods") >= 0) {
                        path.basename = "jquery.validate.additional";
                    }
                }))
                .pipe(plugins.flatten())
                .pipe(gulp.dest(project.dirs.scripts.bower));
    });
}