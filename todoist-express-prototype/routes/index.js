var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		console.log(2);
		// req.session.error = "请先登录";
		res.redirect("/login.html"); //未登录则重定向到 /login 路径
	} else {
		var user_task = global.dbHandel.getModel('user_task');
		var username = req.session.user.name;

		user_task.findOne({
			"username": username
		}, "types username", function(err, user_task) {
			if (err) return handleError(err);
			if (!user_task) {
				console.log("查不到" + user_task);
				return;
			}
			if (user_task) {
				console.log("查到了");
			}

			res.render('index', {
				user: {
					name: req.session.user.name,
					age: 23
				},
				user_task: {
					types: user_task.types
				}
			});
		})
	}
});


/* GET home page. */
router.get("/index.html", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		console.log(2);
		// req.session.error = "请先登录";
		res.redirect("/login.html"); //未登录则重定向到 /login 路径
	} else {
		var user_task = global.dbHandel.getModel('user_task');
		var username = req.session.user.name;

		user_task.findOne({
			"username": username
		}, "types username", function(err, user_task) {
			if (err) return handleError(err);
			if (!user_task) {
				console.log("查不到" + user_task);
				return;
			}
			if (user_task) {
				console.log("查到了");
			}

			res.render('index', {
				user: {
					name: req.session.user.name
				},
				user_task: {
					types: user_task.types
				}
			});
		})
	}
});


module.exports = router;