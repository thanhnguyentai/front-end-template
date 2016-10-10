

var path = require('path');

module.exports = function(gulp, options, plugins) {
    var project = options.project;

    gulp.task('watch:dev', function() {
        
        gulp.watch([path.join(project.dirs.base, '**/*.hbs'), path.join(project.dirs.static.data, '**/*.json')], ["assemble"]);
        gulp.watch([path.join(project.dirs.styles.main, '**/*.scss'), path.join(project.dirs.styles.partials, '**/*.scss')], ["css:dev"]);
        gulp.watch([path.join(project.dirs.scripts.main, '**/*.js'), path.join(project.dirs.scripts.lib, '**')], ['js:dev']);
        gulp.watch(path.join(project.dirs.images.main, '**/*'), ["copy-dev:image"]);
    });
}