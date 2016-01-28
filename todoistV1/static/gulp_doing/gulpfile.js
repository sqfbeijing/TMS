var gulp = require('gulp');
var less = require('gulp-less');
var csso = require('gulp-csso');
var csscomb = require('gulp-csscomb'); 

// 编译less生成css
gulp.task('gulp_less', function() {
	gulp.src('./making/*.less')
	.pipe(less()) 
    //下面这句什么意思？自动补全插件没有。会让less编译出错的！
    // .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./making'));
});
 //压缩css为1行
 gulp.task('csso', function () {
 	return gulp.src('./making/*.css')
 	.pipe(csso())
 	.pipe(gulp.dest('./making/csso'));
 }); 
// 梳理css为自己想要的样式
gulp.task('csscomb', function() {
	return gulp.src('./making/*.css')
	.pipe(csscomb())
	.pipe(gulp.dest('./making/csscomb'));
});
// 输入"gulp"的默认任务
gulp.task('default', function(){  
	gulp.watch(['./making/*.less','./making/*.js'], ['gulp_less', "csscomb"]);    
});