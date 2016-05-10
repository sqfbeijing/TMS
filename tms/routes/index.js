var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		// console.log(2);
		// req.session.error = "请先登录";
		// res.redirect("/login.html"); //未登录则重定向到 /login 路径
		res.render('sign');
	} else {
		var user_task = global.dbHandel.getModel('user_task');
		var username = req.session.user.name;
		// 去找头像
		var User_data = global.dbHandel.getModel('user_data');
		User_data.findOne({
			"username": username
		}, function(err, user_data) {
			if (err) return handleError(err);
			// 找到头像
			var avatar_url = user_data.avatar_url;
			// 找任务
			user_task.findOne({
				"username": username
			}, "types username", function(err, user_task) {
				if (err) return handleError(err);
				if (!user_task) {
					console.log("查不到" + user_task);
					res.render("index", {
						user: {
							name: req.session.user.name
						},
					// 随便放些空的数组，解决添加用户任务为空的问题
					user_task: {
						types: []
					},
					title: "首页",
					avatar_url: avatar_url
				});
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
					},
					title: "首页",
					avatar_url: avatar_url
				});
			})
		})
	}
});


/* GET home page. */
router.get("/index.html", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		// console.log(2);
		// req.session.error = "请先登录";
		// res.redirect("/login.html"); //未登录则重定向到 /login 路径
		res.render('sign');
	} else {
		var user_task = global.dbHandel.getModel('user_task');
		var username = req.session.user.name;
		// 去找头像
		var User_data = global.dbHandel.getModel('user_data');
		User_data.findOne({
			"username": username
		}, function(err, user_data) {
			if (err) return handleError(err);
			// 找到头像
			var avatar_url = user_data.avatar_url;
			// 找任务
			user_task.findOne({
				"username": username
			}, "types username", function(err, user_task) {
				if (err) return handleError(err);
				if (!user_task) {
					console.log("查不到" + user_task);
					res.render("index", {
						user: {
							name: req.session.user.name
						},
					// 随便放些空的数组，解决添加用户任务为空的问题
					user_task: {
						types: []
					},
					title: "首页",
					avatar_url: avatar_url
				});
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
					},
					title: "首页",
					avatar_url: avatar_url
				});
			})
		})
	}
});



/* GET home page. */
// router.get("/index.html", function(req, res) {
// 	if (!req.session.user) { //到达/home路径首先判断是否已经登录
// 		// console.log(2);
// 		// req.session.error = "请先登录";
// 		// res.redirect("/login.html"); //未登录则重定向到 /login 路径
// 		res.render('sign');
// 	} else {
// 		var user_task = global.dbHandel.getModel('user_task');
// 		var username = req.session.user.name;

// 		user_task.findOne({
// 			"username": username
// 		}, "types username", function(err, user_task) {
// 			if (err) return handleError(err);
// 			if (!user_task) {
// 				console.log("查不到" + user_task);
// 				res.render("index", {
// 					user: {
// 						name: req.session.user.name
// 					},
// 					// 随便放些空的数组，解决添加用户任务为空的问题
// 					user_task: {
// 						types: []
// 					}
// 				});
// 				return;
// 			}
// 			if (user_task) {
// 				console.log("查到了");
// 			}

// 			res.render('index', {
// 				user: {
// 					name: req.session.user.name
// 				},
// 				user_task: {
// 					types: user_task.types
// 				},
// 				title: "首页"
// 			});
// 		})
// 	}
// });


module.exports = router;