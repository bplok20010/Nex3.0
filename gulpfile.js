var gulp = require('gulp');
//var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// 语法检查
var base = 'src/nex/';
var dist = 'src/nex';
gulp.task('default', function () {
	//console.log( jshint() );
    return gulp.src([
			base + 'Base.js',//基础库
			base + 'Nex.js', //Nex库
			base + '/core/Base.js', //类核心
			base + '/core/Class.js',//继承核心
			base + 'EventObject.js',//事件类
			base + 'ComponentManager.js',//实例管理
			base + 'AbstractComponent.js',//
			base + 'Loader.js',//加载器
			base + '/util/SubmitForm.js',//Ajax
			base + 'Ajax.js',//Ajax
			base + 'Component.js',
			//base + 'Separator.js',
		])
		//.pipe(uglify())
        .pipe(concat('Nex.core.js'))
		.pipe(gulp.dest(dist))
		.pipe(uglify())
		.pipe(rename('Nex.core.min.js'))
        .pipe(gulp.dest(dist));
});
gulp.task('form', function () {
	return gulp.src([
			base + '/form/Manager.js',
			base + '/util/Validate.js',
			base + '/mixins/DropDown.js',
			base + '/form/AbstractForm.js',
			base + '/form/Display.js',
			base + '/form/Text.js',
			base + '/form/Trigger.js',
			base + '/form/Select.js',
			base + '/form/Textarea.js',
			base + '/form/Hidden.js',
			base + '/form/Password.js',
			base + '/form/ComboBox.js',
			base + '/form/Radio.js',
			base + '/form/Checkbox.js',
			base + '/form/SingleCheckbox.js',
		])
		//.pipe(uglify())
        .pipe(concat('Form.js'))
		.pipe(gulp.dest(dist))
		.pipe(uglify())
		.pipe(rename('Form.min.js'))
        .pipe(gulp.dest(dist));
});
gulp.task('loader', function () {
	return gulp.src([
			base + '/require.js',
			base + '/Loader2.js',
		])
		//.pipe(uglify())
        .pipe(concat('nexLoader.js'))
		.pipe(gulp.dest(dist))
		.pipe(uglify())
		.pipe(rename('nexLoader.min.js'))
        .pipe(gulp.dest(dist));
});
/*
// 合并文件之后压缩代码
gulp.task('minify', function (){
     return gulp.src('src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);*/