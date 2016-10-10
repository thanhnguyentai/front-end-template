

var path = require('path');

module.exports = function(gulp, options, plugins) {

    var project = options.project;

    gulp.task('copy-dev:image', function() {
        gulp.src([path.join(project.dirs.images.main, '**/*.{png,jpg,gif,svg,ico}'), "!" + path.join(project.dirs.images.main, 'icons/**'), "!" + path.join(project.dirs.images.main, 'sprite/**') ])
        .pipe(gulp.dest(project.dirs.images.outCompiled));
    });
    gulp.task('copy-deploy:image', function() {
        gulp.src([path.join(project.dirs.images.main, '**/*.{png,jpg,gif,svg,ico}'), 
                "!" + path.join(project.dirs.images.main, 'icons/**'), 
                "!" + path.join(project.dirs.images.main, 'sprite/**'),
                "!" + path.join(project.dirs.images.main, 'no-deploy/**') ])

        .pipe(gulp.dest(project.dirs.images.out));
    });

    gulp.task('copy-dev:font', function() {
        gulp.src([path.join(project.dirs.fonts.main, '**/*{eot,svg,ttf,woff,woff2,css,js}')])
        .pipe(gulp.dest(project.dirs.fonts.outCompiled));
    });
    gulp.task('copy-deploy:font', function() {
        gulp.src([path.join(project.dirs.fonts.main, '**/*{eot,svg,ttf,woff,woff2,css,js}')])
        .pipe(gulp.dest(project.dirs.fonts.out));
    });

    gulp.task('copy-dev:video', function() {
        gulp.src([path.join(project.dirs.videos.main, '**')])
        .pipe(gulp.dest(project.dirs.videos.outCompiled));
    });
    gulp.task('copy-deploy:video', function() {
        gulp.src([path.join(project.dirs.videos.main, '**')])
        .pipe(gulp.dest(project.dirs.videos.out));
    });

	gulp.task("copy:dev", ['copy-dev:image', 'copy-dev:font', 'copy-dev:video']);

	gulp.task("copy:deploy", ['copy-deploy:image', 'copy-deploy:font', 'copy-deploy:video']);
}