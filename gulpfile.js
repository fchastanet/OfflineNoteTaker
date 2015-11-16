var gulp = require('gulp'),
    gutil = require('gulp-util'),
    ngAnnotate = require('gulp-ng-annotate'),
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
    reworkCss = require('gulp-reworkCss'),
    reworkCssUrl = require('rework-plugin-url'),
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
                './node_modules/pouchdb-authentication/dist/pouchdb.authentication.js',
                './node_modules/angular-ui-router/release/angular-ui-router.js',
            ],
            destFile: 'dependencies.bundled.js'
        },
        css: {
            list: [
                './node_modules/toastr/dist/toastr.css',
                './www/css/ionic.app.css'
            ],
            destFile: 'dependencies.bundled.css'
        },
        copy: [
            {
                files:'./node_modules/ionic-bower/fonts/*',
                base:'./node_modules/ionic-bower/fonts',
                dest: './www/fonts'
            }
        ]
    }

};

gulp.task('default', ['javascript', 'sass', 'jsBundle', 'cssBundle', 'copyLibDependencies']);

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
    gulp.watch(paths.appJavascriptSrc, ['javascript']);
    gulp.watch(paths.sass, ['cssBundle']);
});

gulp.task('jsBundle', function() {
    return gulp.src(paths.dependencies.js.list)
        .pipe(concat(paths.dependencies.js.destFile))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest(paths.javascriptDest))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.javascriptDest))
});

gulp.task('cssBundle', ['sass', 'concatCompressCss']);

gulp.task('sass', function(done) {
    gulp.src(paths.sass)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(reworkCss(
            reworkCssUrl(function(url) {
                return url.replace('/node_modules/ionic-bower', '');
            }),
            {sourcemap: true}
        ))
        .pipe(gulp.dest('./www/css/'))
        .on('end', function() {
            gulp.start('concatCompressCss');
            done();
        });
});

gulp.task('concatCompressCss', function() {
    return gulp.src(paths.dependencies.css.list)
        .pipe(concat(paths.dependencies.css.destFile))
        .pipe(reworkCss(
            reworkCssUrl(function(url) {
                return url.replace('/node_modules/ionic-bower', '');
            }),
            {sourcemap: true}
        ))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(csso())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.cssDest));
});

gulp.task('copyLibDependencies', function() {
    paths.dependencies.copy.forEach(function(copy) {
        gulp
            .src(copy.files, {base: copy.base})
            .pipe(gulp.dest(copy.dest));
    });
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
