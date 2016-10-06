
var del = require("del")

module.exports = function(gulp, options, plugins) {

    var project = options.project;

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
}