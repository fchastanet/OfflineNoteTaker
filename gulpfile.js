var gulp = require('gulp'),
    gutil = require('gulp-util'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserify = require('browserify'),
    through = require('through2'),
    uglify = require('gulp-uglify'),
    globby = require('globby'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    replace = require('gulp-replace'),
    buffer = require('vinyl-buffer'),
    exec = require('child_process').exec,
    path = require('path'),
    mergeStream = require('merge-stream'),
    rework = require('gulp-rework'),
    source = require('vinyl-source-stream');

var paths = {
    app: './www/',
    sass: ['scss/**/*.scss'],
    appJavascriptSrc: ['www/app/**/module.js', 'www/app/**/*.js'],
    javascriptMapDest: 'www/dist/maps',
    javascriptDest: 'www/dist',
    cssDest: 'www/css',
    designDocumentSrc: 'couchdbDesignDocuments',
    designDocument: ['couchdbDesignDocuments/*.js'],
    designDocumentDest: 'dist/couchdbDesignDocuments',
    dependencies: {
        js: {
            list: [
                './node_modules/ionic-bower/js/ionic.bundle.js',
                './node_modules/angular-elastic/elastic.js',
                './node_modules/toastr/dist/toastr.js',
                './node_modules/moment/moment.js',
                './node_modules/pouchdb/dist/pouchdb.js',
                './node_modules/angular-ui-router/release/angular-ui-router.js',
            ],
            destFile: 'dependencies.bundled.js'
        },
        css: {
            list: [
                './node_modules/toastr/dist/toastr.css'
            ],
            destFile: 'dependencies.bundled.css'
        },
    }

};

gulp.task('default', ['javascript', 'sass', 'browserify', 'cssIfy']);

gulp.task('watch', function(done) {
    gulp.watch(paths.designDocument).on('change', 
        function(file) {
            var fullRoot = path.resolve(paths.designDocumentSrc);
            var relativePath = path.relative(fullRoot, file.path);
            console.log('designDocument change ' + file.path + ' relative ' + relativePath);
            gulp
                .src(file.path)

            /**
             * conversion du fichier javascript vers le format json 
             */
            .pipe(buffer()) //convertit le stream en un buffer (afin de lire tout le fichier d'un seul bloc)
                .pipe(replace(/'/g, '"'))
                //remplacement /*<stringify>*/ (.*) /*</stringify>*/ par "$1 avec des quotes à la places des doubles"
                .pipe(replace(/\/\*<stringify>\*\/[ \t\r\n]*([\s\S]*?)[ \t\r\n]*\/\*<\/stringify>\*\//gmi, function(match, match1) {
                    var content = match1; //todo tester minifyjs sur content
                    content = content.replace(/\"/g, '\'');
                    content = content.replace(/\\'/g, '&quote;');
                    content = content.replace(/\/\/.*$/gm, ''); //suppression des commentaires du style //
                    content = content.replace(/^[ ]*([\s\S]*?)[ ]*$/gm, '$1'); //supression des espaces de début et fin de ligne
                    content = content.replace(/[\n\r]*/g, ''); //suppression des sauts de ligne
                    content = '\"' + content + '\"';
                    return content;
                }))
                //suppression des commentaires
                .pipe(replace(/\/\*([\s\S]*?)\*\//g, ''))
                .pipe(gulp.dest(paths.designDocumentDest))
              ;
            /**
             * mise à jour du fichier vers couchdb (la commande curl doit être installée)
             */
            var cmd = 'curl http://127.0.0.1:5984/nodes/_design/node';
            console.log('check if document is here : ' + cmd);
            exec(cmd, function(err, stdout, stderr) {
                if (err) {
                    return;
                }
                var result = JSON.parse(stdout);
                console.log(stdout);
                console.dir(result);
                if (typeof result._rev === 'string') {
                    cmd = 'curl -X DELETE admin:admin@127.0.0.1:5984/nodes/_design/node?rev=' + result._rev;
                    console.log('existing document, remove it : ' + cmd);
                    exec(cmd, function(err, stdout, stderr) {
                        console.log('stdout ' + stdout + ' stderr :' + stderr);
                        if (err) {
                            return;
                        }
                        putDocument();
                    });
                } else {
                    putDocument();
                }

                function putDocument() {
                    var fileName = paths.designDocumentDest + '/' + relativePath;
                    cmd = 'curl -H "Content-Type: application/json" -X PUT admin:admin@127.0.0.1:5984/nodes/_design/node --data-binary "@' + fileName + '"';
                    console.log('add the new document : ' + cmd);
                    exec(cmd, function(err, stdout, stderr) {
                        console.log('stdout ' + stdout + ' stderr :' + stderr);
                        return;
                    });
                }
            });
            return done();
        }
    );
    gulp.watch(paths.javascript, ['javascript']);
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('browserify', function() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();
    bundledStream
        // turns the output bundle stream into a stream containing
        // the normal attributes gulp plugins expect.
        .pipe(source(paths.dependencies.js.destFile))
        // the rest of the gulp task, as you would normally write it.
        // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
          // Add gulp plugins to the pipeline here.
          .pipe(uglify())
          .on('error', gutil.log)
        .pipe(sourcemaps.write(paths.javascriptMapDest))
        .pipe(gulp.dest(paths.javascriptDest));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(paths.dependencies.js.list).then(function(entries) {
        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug : !gutil.env.production,
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    }).catch(function(err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
});

gulp.task('cssIfy', function() {
    return gulp.src(paths.dependencies.css.list)
        .pipe(concat(paths.dependencies.css.destFile))
        .pipe(rework({sourcemap: true}))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(csso())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.cssDest));
});

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(rework({sourcemap: true}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(csso())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('javascript', function() {
    gulp.src(paths.appJavascriptSrc)
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(gulp.dest(paths.javascriptDest + '/app'));
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
