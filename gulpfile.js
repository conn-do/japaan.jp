var gulp         = require('gulp');
var plumber      = require("gulp-plumber");
var slim         = require('gulp-slim');
var compass      = require('gulp-compass');
var autoprefixer = require("gulp-autoprefixer");

var sass_files = ['./sass/*.scss', './sass/*/*.scss'];

gulp.task('slim', function() {
    gulp.src('./slim/*.slim')
        .pipe(plumber())
        .pipe(slim({
            pretty: true,
            options: [
                'sort_attrs=false',
                'encoding="utf-8"'
            ]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('compass', function() {
    gulp.src(sass_files)
        .pipe(plumber())
        .pipe(compass({
            config_file: './config.rb',
            css: './css',
            sass: './sass',
            font: './fonts'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./css'));
});

gulp.task('default', ['slim', 'compass'], function() {
    gulp.watch(sass_files, ['compass']);
    gulp.watch(['./slim/*.slim'], ['slim']);
});