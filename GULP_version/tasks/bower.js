


module.exports = function(gulp, options, plugins) {

    var project = options.project;

    gulp.task('bower-copy', function() {
        return gulp.src('./../bower.json')
                .pipe(plugins.mainBowerFiles({
                    overrides: { // select files to get from bower components
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
                .pipe(plugins.rename(function(path) { // rename names of files for using easier or prevent from same names of multiple files
                    if(path.dirname.indexOf("jquery-validation") >=0  && path.basename.indexOf("additional-methods") >= 0) {
                        path.basename = "jquery.validate.additional";
                    }
                }))
                .pipe(plugins.flatten()) // remove paths from files, so that all files will be saved to a same directory
                .pipe(gulp.dest(project.dirs.scripts.bower)); // specify the destination directory
    });
}