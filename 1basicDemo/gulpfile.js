var gulp = require('gulp'),
    react = require('gulp-react'),
    watch = require('gulp-watch'),
    rename = require("gulp-rename"),
    notify = require("gulp-notify");

var fileNames = [
    './tpl.js'
];

//JSX语法转换任务
gulp.task('jsxTranslate', function() {
    return gulp.src(fileNames)
        .pipe(react())
        .on('error', function(err) {
            console.error('JSX ERROR in ' + err.fileName);
            console.error(err.message);
            notify({ message: 'Translate complate error!!!' })
            this.end();
        }) //交给notify处理错误
        .pipe(gulp.dest('JSXtoJS'));
});

//默认任务，转换JSX语法
gulp.task('default', function() {
    gulp.run('jsxTranslate');
    gulp.watch(fileNames, function() {
        gulp.run('jsxTranslate');
    });
});

