var lib = {};

lib.getTime = function(){
	// 获取此时时间
	var tempDate = new Date();
	var y = tempDate.getFullYear();
	var mon = tempDate.getMonth() + 1;
	var d = tempDate.getDate();
	var h = tempDate.getHours();
	var min = tempDate.getMinutes();
	var s = tempDate.getSeconds();
	var time = y + "年" + mon + "月" + d + "日" + h + "时" + min + "分" + s + "秒";
	return time;
}

// 获取此时时间的Number类型
lib.getTimeValue = function(){
	var tempDate = new Date();
	var timeValue = tempDate.getTime();
	return timeValue;
}

// 数组按照数值从小到大排序，得到一个排序后的数组
lib.sort = function(arr) {
	arr.sort(function(a, b){
		// 若a < b ， 则a 放在前面
		return a - b;
	});
	return arr;
}
// // 有next
// lib.initUserTask = function(next) {

// }

// // 一个用户创建完成之后，需要初始化
// // 例如： 初始化任务，资料，头像
// lib.initUser = function(){

// }

module.exports = lib;