var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		// res.redirect("/login.html"); //未登录则重定向到 /login 路径
		res.render('sign');
		return;
	} 
	// 若登录，则渲染
	var Task_state = global.dbHandel.getModel('task_state');
	var username = req.session.user.name;
		// 去找头像
		var User_data = global.dbHandel.getModel('user_data');
		User_data.findOne({
			"username": username
		}, function(err, user_data) {
			if (err) return handleError(err);
		// 找到头像
		var avatar_url = user_data.avatar_url;
		Task_state.find(function (err, task_states) {
			if (err) return console.error(err);
		// 拿到task_states数组，这个数组是task_states表里面的所有的文档

		console.log(task_states);
		res.render('taskCircle', {
			user: {
				name: req.session.user.name,
			},
			task_states: task_states,
			title: "任务圈",
			avatar_url: avatar_url
		});
	})
	});


	});

module.exports = router;