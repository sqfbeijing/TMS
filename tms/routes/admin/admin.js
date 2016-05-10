var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	res.render("admin/admin", {
		admin: {
			name: req.session.admin.name
		}
	});
});

// 登录页面
router.get('/login.html', function(req, res, next) {
	res.render("admin/login.ejs");
});

router.route("/login.html").post(function(req, res) { // 从此路径检测到post方式则进行post数据的处理操作
	//get User info
	//这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
var User = global.dbHandel.getModel('admin');
	var uname = req.body.uname; //获取post上来的 data数据中 uname的值
	User.findOne({
		name: uname
	}, function(err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
		if (err) { //错误就返回给原post处（login.html) 状态码为500的错误
		res.send(500);
		console.log(err);
		} else if (!doc) { //查询不到用户名匹配信息，则用户名不存在
			res.send("wrongUser"); //	状态码返回404
		} else {
			if (req.body.upassword != doc.password) { //查询到匹配用户名的信息，但相应的password属性不匹配
				res.send("wrongPassword");
			} else { //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				// 开启会话
				req.session.admin = doc;
				// res.sendStatus(200);
				res.send("correct");
			}
		}
	});
});

// 注销
router.post('/logout', function(req, res) {
	//先去掉session
	delete req.session.admin;
	res.send("ok");
});
// 查看用户账户页面
router.get("/userAccount.html", function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	// 若是分页的请求
	if (req.query.page) {
		var page = parseInt(req.query.page);

		// 从数据库拿取user表里的所有文档，发送到ejs
		var User = global.dbHandel.getModel('user');

		User.find({}, function(err, doc) {
			if (err) {
				console.log("报错");
				return;
			}
			// 默认渲染的页面是第1页
			res.render("admin/userAccount.ejs", {
				users: doc,
				admin: req.session.admin,
				showPageNumber: page
			});
		})
	} else {
		// 若不是分页请求，则显示默认的第一页
		// 从数据库拿取user表里的所有文档，发送到ejs
		var User = global.dbHandel.getModel('user');

		User.find({}, function(err, doc) {
			if (err) {
				console.log("报错");
				return;
			}
			// 默认渲染的页面是第1页
			res.render("admin/userAccount.ejs", {
				users: doc,
				admin: req.session.admin,
				showPageNumber: 1
			});
		})
	}
})

// 查看用户账户页面
router.get("/adminAccount.html", function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	// 若是分页的请求
	if (req.query.page) {
		var page = parseInt(req.query.page);

		// 从数据库拿取user表里的所有文档，发送到ejs
		var Admin = global.dbHandel.getModel('admin');

		Admin.find({}, function(err, doc) {
			if (err) {
				console.log("报错");
				return;
			}
			// 默认渲染的页面是第1页
			res.render("admin/adminAccount.ejs", {
				admins: doc,
				admin: req.session.admin,
				showPageNumber: page
			});
		})
	} else {
		// 若不是分页请求，则显示默认的第一页
		var Admin = global.dbHandel.getModel('admin');

		Admin.find({}, function(err, doc) {
			if (err) {
				console.log("报错");
				return;
			}
			// 默认渲染的页面是第1页
			res.render("admin/adminAccount.ejs", {
				admins: doc,
				admin: req.session.admin,
				showPageNumber: 1
			});
		})
	}
})

// 查看任务圈状态页面
router.get("/taskCircleState.html", function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}

	// 若是分页的请求
	if (req.query.page) {
		var page = parseInt(req.query.page);

		// 从数据库拿取user表里的所有文档，发送到ejs
		var Task_state = global.dbHandel.getModel('task_state');

		Task_state.find({}, function(err, docs) {
			if (err) {
				console.log("报错");
				return;
			}
			//按照时间排序
			docs.sort(function(a, b) {
				// 若1 < 2 ，则返回负数， 1在前面
				return a.timeValue - b.timeValue;
			});
			// 默认渲染的页面是第1页
			res.render("admin/taskCircleState.ejs", {
				states: docs,
				admin: req.session.admin,
				showPageNumber: page
			});
		})
	} else {
		// 若不是分页请求，则显示默认的第一页
		var Task_state = global.dbHandel.getModel('task_state');

		Task_state.find({}, function(err, docs) {
			if (err) {
				console.log("报错");
				return;
			}
			//按照时间排序
			docs.sort(function(a, b) {
				// 若1 < 2 ，则返回负数， 1在前面
				return a.timeValue - b.timeValue;
			});
			// 默认渲染的页面是第1页
			res.render("admin/taskCircleState.ejs", {
				states: docs,
				admin: req.session.admin,
				showPageNumber: 1
			});
		})
	}
})

// 用户反馈页面
router.get("/userAdvice.html", function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}

	// 若是分页的请求
	if (req.query.page) {
		var page = parseInt(req.query.page);

		// 从数据库拿取user_advice表里的所有文档，发送到ejs
		var User_advice = global.dbHandel.getModel('user_advice');

		User_advice.find({}, function(err, docs) {
			if (err) {
				console.log("报错");
				return;
			}
			//按照时间排序
			docs.sort(function(a, b) {
				// 若1 < 2 ，则返回负数， 1在前面
				return a.timeValue - b.timeValue;
			});
			// 默认渲染的页面是第1页
			res.render("admin/userAdvice.ejs", {
				advices: docs,
				admin: req.session.admin,
				showPageNumber: page
			});
		})
	} else {
		// 从数据库拿取user_advice表里的所有文档，发送到ejs
		var User_advice = global.dbHandel.getModel('user_advice');

		User_advice.find({}, function(err, docs) {
			if (err) {
				console.log("报错");
				return;
			}
			//按照时间排序
			docs.sort(function(a, b) {
				// 若1 < 2 ，则返回负数， 1在前面
				return a.timeValue - b.timeValue;
			});
			// 默认渲染的页面是第1页
			res.render("admin/userAdvice.ejs", {
				advices: docs,
				admin: req.session.admin,
				showPageNumber: 1
			});
		})
	}
});

// 增加用户账户页面
router.get('/addAUser.html', function(req, res, next) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	res.render("admin/addAUser.ejs", {
		admin: req.session.admin
	});
});
// 增加管理员账户页面
router.get('/addAdmin.html', function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	res.render("admin/addAdmin.ejs", {
		admin: req.session.admin
	});
});

// 查看用户详细资料页面
router.get('/seeSingleUserData.html', function(req, res) {
	if (!req.session.admin) {
		res.redirect("/admin/login.html");
		return;
	}
	var username = req.query.userName;
	// 查表
	var User_data = global.dbHandel.getModel("user_data");

	User_data.findOne({
		username: username
	}, function(err, doc) {
		if (err) {
			console.log("查询出错");
		}
		res.render("admin/seeSingleUserData.ejs", {
			admin: req.session.admin,
			userData: doc
		})
	});
});
module.exports = router;