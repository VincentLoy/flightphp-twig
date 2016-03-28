/**
 * Project : Flight Twig Template
 * File : gulpfile.js
 * Date : 28/03/2016
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */

/*globals require, console*/
(function () {
    'use strict';

    require('es6-promise');

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        babel = require('gulp-babel'),
        less = require('gulp-less'),
        minifyCSS = require('gulp-minify-css'),
        sourcemaps = require('gulp-sourcemaps'),
        plumber = require('gulp-plumber'),
        autoprefixer = require('gulp-autoprefixer'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        browserSync = require('browser-sync'),

        // variables
        staticSrcDir = 'static/src/',
        targetDistDir = 'static/dist/',

        JS_SRC = [
            // libs and es5 stuff
            'node_modules/babel-polyfill/dist/polyfill.js'
        ],

        ES6_SRC = [
            staticSrcDir + 'js/app.js'
        ];


    // Compile Less
    // and save to target CSS directory
    gulp.task('build:less:min', ['build:less'], function () {
        return gulp.src(staticSrcDir + 'less/app.less')
            .pipe(plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(less({style: 'compressed'})
                .on('error', gutil.log))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(sourcemaps.init())
            .pipe(minifyCSS())
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(targetDistDir + 'css/'))
            .pipe(browserSync.stream());
    });


    gulp.task('build:less', function () {
        return gulp.src(staticSrcDir + '/less/app.less')
            .pipe(plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(less({style: 'compressed'})
                .on('error', gutil.log))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulp.dest(targetDistDir + 'css/'));
    });

    gulp.task('build:js', function () {
        return gulp.src(JS_SRC)
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('libs.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(targetDistDir + 'js/'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

    gulp.task('build:es6', function () {
        return gulp.src(ES6_SRC)
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['babel-preset-es2015']
            }))
            .pipe(uglify())
            .pipe(concat('script.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(targetDistDir + 'js/'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

    gulp.task('build:assets', [
        'build:js',
        'build:es6',
        'build:less:min'
    ]);

    // Keep an eye on Less
    gulp.task('serve', function () {
        browserSync.init({
            server: {
                open: false,
                proxy: 'http://flight-twig' // local dev ip or vhost
            }
        });

        gulp.watch('*/**/*.less', ['build:less:min']);
        gulp.watch('index.html').on('change', browserSync.reload);
    });

    // What tasks does running gulp trigger?
    gulp.task('default', ['build:less:min', 'serve']);
}());
