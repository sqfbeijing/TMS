var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		res.redirect("/login.html"); //未登录则重定向到 /login 路径
		return;
	} 
	// 若登录，则渲染
	var Task_state = global.dbHandel.getModel('task_state');
	var username = req.session.user.name;

	Task_state.find(function (err, task_states) {
		if (err) return console.error(err);
		// 拿到task_states数组，这个数组是task_states表里面的所有的文档

		console.log(task_states);
		res.render('taskCircle', {
			user: {
				name: req.session.user.name,
			},
			task_states: task_states
		});
	})
});

module.exports = router;