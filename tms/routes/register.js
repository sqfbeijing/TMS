var express = require('express');
var router = express.Router();

/* GET register page. */
router.route("/").post(function(req, res) {
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
					// 存头像
					var User_data = global.dbHandel.getModel('user_data');
					var new_user_data = new User_data;

					new_user_data.avatar_url = "/images/avatars/system/default.jpg";
					new_user_data.age = 20;
					new_user_data.email = "empty";
					new_user_data.live_place = "empty";
					new_user_data.mobile_phone_number = "empty";
					new_user_data.nickname = "empty";
					new_user_data.signature = "empty";
					new_user_data.sex = "empty";
					new_user_data.username = uname;

					new_user_data.save(function(err){
						if (err) {
							console.log('save failed');
							res.send(500);
						} else {
							console.log('存储成功初始user_data成功!');
							res.send("success");
						}
					});
				}
			});
		}
	});

}
});
});


module.exports = router;