var express = require('express');
var router = express.Router();

// 删除用户
router.post("/deleteAUser", function(req, res) {
	var User = global.dbHandel.getModel('user');
	var userName = req.body.userName;
	console.log(userName);

	User.remove({
		name: userName
	}, function(err, docs) {
		console.log(docs);
		console.log("删除用户成功！");
		res.send("ok");
	})
});

//增加用户
router.post("/addAUser", function(req, res) {
	var User = global.dbHandel.getModel('user');
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;

	// 先查看是否已存在此账户
	User.findOne({
		name: userName
	}, function(err, doc) {
		if (doc) {
			// 若存在，则不存储
			console.log("账户已存在。")
			res.send("existedUser");
			return;
		} else {
			// 若不存在，则存储
			var user = new User({
				name: userName,
				password: userPassword
			});

			user.save(function(err) { //存储  
				if (err) {
					console.log('save failed');
					res.send(500);
				} else {
					console.log('存储成功!');
					// 增加完了一个用户，还应当增加此用户对应的任务信息表，不然index.html无法渲染数据到页面
					var User_task = global.dbHandel.getModel('user_task');
					var new_user_task = new User_task();
					new_user_task.username = userName;
					new_user_task.types = [{
						type_name: "工作",
						tasks: []
					}, {
						type_name: "学习",
						tasks: []
					}, {
						type_name: "娱乐",
						tasks: []
					}, ];
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
							new_user_data.username = userName;

							new_user_data.save(function(err) {
								if (err) {
									console.log('save failed');
									res.send(500);
								} else {
									console.log('存储成功初始user_data成功!');
									res.send("ok");
								}
							});
						}
					});
				}
			});
		}

	})
});


// 增加管理员
router.post("/addAdmin", function(req, res) {
	var Admin = global.dbHandel.getModel('admin');
	var adminName = req.body.adminName;
	var adminPassword = req.body.adminPassword;

	// 先查看是否已存在此账户
	Admin.findOne({
		name: adminName
	}, function(err, doc) {
		if (doc) {
			// 若存在，则不存储
			console.log("账户已存在。")
			res.send("existedAdmin");
			return;
		}
		// 若不存在，则存储
		var admin = new Admin({
			name: adminName,
			password: adminPassword
		});

		admin.save(function(err) {
			console.log("存储成功！");
			res.send("ok");
		});
	})
});

// 删除动态
router.post("/deleteAState", function(req, res) {
	var Task_state = global.dbHandel.getModel('task_state');
	var stateId = req.body.stateId;
	console.log(stateId);

	Task_state.remove({
		_id: stateId
	}, function(err, docs) {
		console.log(docs);
		console.log("删除动态成功！");
		res.send("ok");
	})
});

// 删除用户的投诉建议
router.post("/deleteAdvice", function(req, res) {
	var User_advice = global.dbHandel.getModel('user_advice');
	var adviceId = req.body.adviceId;

	User_advice.remove({
		_id: adviceId
	}, function(err, docs) {
		console.log(docs);
		console.log("删除用户建议成功！");
		res.send("ok");
	})
});

module.exports = router;