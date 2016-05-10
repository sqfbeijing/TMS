var express = require('express');
var router = express.Router();

router.post("/", function(req, res){
	var obj = {};
	obj.userName = req.session.user.name;
	obj.time = req.body.time;
	obj.timeValue = req.body.timeValue;
	obj.content = req.body.content;
	// 存到数据库
	var User_advice = global.dbHandel.getModel("user_advice");
	var user_advice = new User_advice(obj);

	user_advice.save(function(err){
		if (err) {
			console.log("user_advice表存储出错");
			return;
		}
		console.log("user_advice表存储成功");
		res.send("ok");
	});
});

module.exports = router;