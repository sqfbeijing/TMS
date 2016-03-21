var express = require('express');
var router = express.Router();

/* GET register page. */
router.route("/").get(function(req, res) { // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("register", {
		title: 'User register'
	});
}).post(function(req, res) {
	//这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
var User = global.dbHandel.getModel('user');
var uname = req.body.uname;
var upassword = req.body.upassword;
User.findOne({
	name: uname
	}, function(err, doc) { // 同理 /login 路径的处理方式
		if (err) {
			res.send(500);
			req.session.error = '网络异常错误！';
			console.log(err);
		} else if (doc) {
			req.session.error = '用户名已存在！';
			res.send("isExistedUserName");
		} else {
			// 增加到数据库
			var newUser = new User();
			newUser.name = uname;
			newUser.password = upassword;

			newUser.save(function(err) { //存储  
				if (err) {
					console.log('save failed');
					res.send(500);
				} else {
					console.log('存储成功!');
					res.send("success");
				}
			});
			// 增加完了一个用户，还应当增加此用户对应的任务信息表，不然index.html无法渲染数据到页面
			var User_task = global.dbHandel.getModel('user_task');
			var new_user_task = new User_task();
			new_user_task.username = uname;
			new_user_task.types = [
			{type_name: "工作", tasks: []},
			{type_name: "学习", tasks: []},
			{type_name: "娱乐", tasks: []},
			];
			new_user_task.save(function(err) { //存储  
				if (err) {
					console.log('save failed');
					res.send(500);
				} else {
					console.log('存储成功初始usertask成功!');
				}
			});
		}
	});
});


module.exports = router;