// Imports

var gulp = require('gulp');
var sass = require('gulp-sass');
var styleguide = require('sc5-styleguide');
var prefix = require('gulp-autoprefixer');
var replace = require('gulp-replace');

// Path definitions

var assetsPath = 'assets';
var scssPath = assetsPath + '/scss';
var cssPath = assetsPath + '/css';
var scssWild = scssPath + '/**/*.scss';
var componentsPath = scssPath + '/components';
var componentScssWild = componentsPath + '/**/*.scss';
var componentScssRoot = componentsPath + '/all-components.scss';
var styleguideOverviewPath = componentsPath + '/README.md';

var buildPath = 'styleguide';
var styleguideStylesBuildPath = buildPath + '/styles';
var styleguideAppRoot = '/styleguide';
var styleguideBuildPath = buildPath;

const TITLE = 'Harvest Styleguide';
var prefixer_args = ["last 3 versions", "> 1%", "ie >= 8"];
var sass_opts = {
	includePaths: scssPath,
	errLogToConsole: true
};

gulp.task('all_scss', function() {
	return gulp.src(scssWild)

		.pipe(sass(sass_opts))
		.pipe(prefix({browsers:prefixer_args}))

		.pipe(gulp.dest(cssPath));
});

gulp.task('static_styleguide:scss', function() {
	return gulp.src(componentScssWild)

		.pipe(sass(sass_opts))
		.pipe(prefix({browsers:prefixer_args}))

		.pipe(gulp.dest(styleguideStylesBuildPath));
});

gulp.task('static_styleguide:generate', function() {
	return gulp.src(componentScssWild)
		.pipe(styleguide.generate({
			title: TITLE,
			disableEncapsulation: true,
			rootPath: styleguideBuildPath,
			appRoot: styleguideAppRoot,
			overviewPath: styleguideOverviewPath
		}))
		.pipe(gulp.dest(styleguideBuildPath));
});

gulp.task('static_styleguide:applystyles', function() {
	return gulp.src(componentScssRoot)

		.pipe(sass(sass_opts))
		.pipe(prefix({browsers:prefixer_args}))

		.pipe(styleguide.applyStyles())
		.pipe(gulp.dest(styleguideBuildPath));
});

gulp.task('static_styleguide:cleanup', ['static_styleguide:generate'],function() {
	// Fix line-endings in the SC5 logo svg
	return gulp.src('styleguide/assets/img/sc5logo.svg')
		.pipe(replace(/\r\n/g,"\n"))
		.pipe(gulp.dest('styleguide/assets/img/'));
});

gulp.task('default', ['static_styleguide:scss','static_styleguide:generate','static_styleguide:applystyles','static_styleguide:cleanup']);
