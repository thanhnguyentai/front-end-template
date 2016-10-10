

var assemble = require("assemble"),
	path 	 = require('path');

module.exports = function(gulp, options, plugins) {

    var project = options.project;
        
    gulp.task('assemble:static', function() {
        var app = assemble();
        
        app.option({
            layout: "static"
        });

        app.data(path.join(project.dirs.base, 'data/**/*.json'));
        app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
        app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));

        return app.src(path.join(project.dirs.base, "index.hbs"))
                .pipe(app.renderFile())
                .pipe(plugins.extname())
                .pipe(app.dest(project.dirs.static.main));
    });

    gulp.task('assemble:view', function() {
        var app = assemble();
        
        app.option({
            layout: "view"
        });

        app.data(path.join(project.dirs.base, 'data/**/*.json'));
        app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
        app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));
        
        /*
            This code works well,
            but in case like 
            app.pages(path.join(project.dirs.views.main, 404.hbs")) or
            app.page(path.join(project.dirs.views.main, 404.hbs"))
            the output will put at a WRONG PLACE,

            to make it work right, change it to
            app.pages(path.join(project.dirs.views.main, 404*.hbs"))
            SO STRANGE

            app.pages(path.join(project.dirs.views.main, "[!404,!_]*.hbs"));
            return app.toStream("pages")
                    .pipe(app.renderFile())
                    .pipe(plugins.extname())
                    .pipe(app.dest(project.dirs.static.main));

        */ 

        return app.src(path.join(project.dirs.views.main, "[!404,!_]*.hbs"))
                .pipe(app.renderFile())
                .pipe(plugins.extname())
                .pipe(app.dest(project.dirs.static.main));

    });

    gulp.task('assemble:404', function() {
        var app = assemble();
        
        app.option({
            layout: "404"
        });

        app.data(path.join(project.dirs.base, 'data/**/*.json'));
        app.partials(path.join(project.dirs.views.partials, "**/*.hbs"));
        app.layouts(path.join(project.dirs.views.layouts, '*.hbs'));

        return app.src(path.join(project.dirs.views.main, "404.hbs"))
                .pipe(app.renderFile())
                .pipe(plugins.extname())
                .pipe(app.dest(project.dirs.static.main));

    });

    gulp.task("assemble", ["assemble:static", "assemble:view", "assemble:404"])
}


