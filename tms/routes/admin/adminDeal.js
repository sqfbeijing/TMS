var express = require('express');
var router = express.Router(); 

// 删除用户
router.post("/deleteAUser", function(req, res){
	var User = global.dbHandel.getModel('user');
	var userName = req.body.userName;
	console.log(userName);

	User.remove({name: userName}, function(err, docs){
		console.log(docs);
		console.log("删除用户成功！");
		res.send("ok");
	})
});

//增加用户
router.post("/addAUser", function(req, res){
	var User = global.dbHandel.getModel('user');
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;

	// 先查看是否已存在此账户
	User.findOne({name: userName}, function(err, doc){
		if (doc) {
			// 若存在，则不存储
			console.log("账户已存在。")
			res.send("existedUser");
			return;
		} 
		// 若不存在，则存储
		var user = new User({name: userName, password: userPassword});

		user.save(function(err){
			console.log("存储成功！");
			res.send("ok");
		});
	})
});


// 增加管理员
router.post("/addAdmin", function(req, res){
	var Admin = global.dbHandel.getModel('admin');
	var adminName = req.body.adminName;
	var adminPassword = req.body.adminPassword;

	// 先查看是否已存在此账户
	Admin.findOne({name: adminName}, function(err, doc){
		if (doc) {
			// 若存在，则不存储
			console.log("账户已存在。")
			res.send("existedAdmin");
			return;
		} 
		// 若不存在，则存储
		var admin = new Admin({name: adminName, password: adminPassword});

		admin.save(function(err){
			console.log("存储成功！");
			res.send("ok");
		});
	})
});

// 删除动态
router.post("/deleteAState", function(req, res){
	var Task_state = global.dbHandel.getModel('task_state');
	var stateId = req.body.stateId;
	console.log(stateId);

	Task_state.remove({_id: stateId}, function(err, docs){
		console.log(docs);
		console.log("删除动态成功！");
		res.send("ok");
	})
});

// 删除用户的投诉建议
router.post("/deleteAdvice", function(req, res){
	var User_advice = global.dbHandel.getModel('user_advice');
	var adviceId = req.body.adviceId;

	User_advice.remove({_id: adviceId}, function(err, docs){
		console.log(docs);
		console.log("删除用户建议成功！");
		res.send("ok");
	})
});

module.exports = router;