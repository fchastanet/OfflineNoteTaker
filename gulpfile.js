var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('gulp-replace');
var buffer = require('vinyl-buffer');
var exec = require('child_process').exec;

var paths = {
  sass: ['./scss/**/*.scss'],
  javascript: ['./www/app/**/module.js', './www/app/**/*.js'],
  javascripDest:'./www/dist/app',
  designDocument: ['./couchdbDesignDocuments/*.js'],
  designDocumentDest: './dist/couchdbDesignDocuments'
};

gulp.task('default', ['javascript', 'designDocument', 'sass']);

gulp.task('watch', function() {
  gulp.watch(paths.designDocument, ['designDocument'])
  //gulp.watch(paths.javascript, ['javascript']);
  //gulp.watch(paths.sass, ['sass']);
  
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('javascript', function () {
  gulp.src(paths.javascript)
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest(paths.javascripDest));
});

gulp.task('designDocument', function () {
  gulp.src(paths.designDocument)
    .pipe(buffer()) //convertit le stream en un buffer (afin de lire tout le fichier d'un seul bloc)
    .pipe(replace(/'/g, '"'))
    //remplacement /*<stringify>*/ (.*) /*</stringify>*/ par "$1 avec des quotes à la places des doubles"
    .pipe(replace(/\/\*<stringify>\*\/[ \t\r\n]*([\s\S]*?)[ \t\r\n]*\/\*<\/stringify>\*\//gmi, function(match, match1) {
      var content = match1; //todo tester minifyjs sur content
      content = content.replace(/\"/g, "'");
      content = content.replace(/\\'/g, "&quote;");
      content = content.replace(/\/\/.*$/gm, ""); //suppression des commentaires du style //
      content = content.replace(/^[ ]*([\s\S]*?)[ ]*$/gm, "$1"); //supression des espaces de début et fin de ligne
      content = content.replace(/[\n\r]*/g, ""); //suppression des sauts de ligne
      content = '\"' + content + '\"';
      return  content;
    }))
    //suppression des commentaires
    .pipe(replace(/\/\*([\s\S]*?)\*\//g, '')) 
    .pipe(gulp.dest(paths.designDocumentDest));
});


gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
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
