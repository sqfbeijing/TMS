// 通用页面注销按钮
$(function() {
	var $logOutBtn = $(".topbar .content-logout .logOutBtn");

	$logOutBtn.click(function(event) {
		$.ajax({
			url: '/admin/logout',
			type: 'post',
			success: function(res) {
				if (res === "ok") {
					window.location.href = "/admin";
				}
			}
		})

	});

	// 左侧菜单的点击变换三角形和slideDown效果
	var $menuListHeads = $(".main-menu-singleMenu .menu-head");
	var $menuListContents = $(".main-menu-singleMenu li");

	$menuListHeads.click(function(event) {
		// 若没有显示
		if (!$(this).hasClass('active')) {
			$(this).siblings().slideDown(function() {
				$(this).siblings(".menu-head").addClass('active').find('.iconfont').removeClass('icon-xiangyou').addClass('icon-xiangxia');
			});
		} else {
			// 若已经显示内容
			$(this).siblings().slideUp(function() {
				$(this).siblings('.menu-head').removeClass('active').find('.iconfont').removeClass('icon-xiangxia').addClass('icon-xiangyou');
			});
		}
	});
})