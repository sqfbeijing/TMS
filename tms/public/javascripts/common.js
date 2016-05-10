// 此js文件应用到前台所有页面,如注销等功能的实现
// 需要放到jquery文件后面

// 库函数对象，公用函数
var Library = {};

Library.getTime = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var time = year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
	return time;
};

Library.getTimeValue = function() {
	var date = new Date();
	var timeValue = date.getTime();
	return timeValue;
}

$(function() {
	//注销按钮
	$(".logoutBtn").click(function(event) {
		$.ajax({
			url: '/userLogout.html',
			type: 'post',
			success: function(data) {
				if (data) {
					if (data === "logoutSuccess") {
						// 去首页
						window.location.href = "/index.html";
					}
				} else {
					alert("404  未返回数据");
				}
			}
		});
	});
	// 头部鼠标移动到用户名，显示列表
	$(".top-header .user").hover(function() {
		$(this).addClass("on").find('.tab').show();
	}, function() {
		$(this).removeClass("on").find('.tab').hide();
	});

	// 点击tab里面的选项，则跳转
	$(".top-header .user").on('click', '.tab .myPage', function(event) {
		location.href = "/myPage.html";
	});

	// 搜索任务名按钮 有毒！弹窗两次！
	$(".top-header .left span.searchBtn").click(function(event) {
		var text = $.trim($(this).parents(".top-header").find('.searchInput').val());

		if (text === '') {
			alert("不能为空！");
			return;
		}
		// 跳转到新页面
		window.location.href = "/searchTaskName.html?taskName=" + text;
	});

	 // 按回车键也可以搜索
	$(".top-header .searchInput").keydown(function(event) {
		if (event.keyCode === 13) {
			$(this).parents(".top-header").find('.searchBtn').click();
		}
	});
	// 页面一加载，聚焦到搜索框
	$(".top-header .searchInput").focus();
})