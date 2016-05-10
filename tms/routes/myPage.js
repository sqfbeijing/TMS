var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		res.redirect("/sign.html"); //未登录则重定向到 /login 路径
		return;
	}
	// 查用户信息
	var User_data = global.dbHandel.getModel('user_data');

	User_data.findOne({
		username: req.session.user.name
	}, function(err, doc) {
		if (err) { //错误就返回给原post处（login.html) 状态码为500的错误
		res.send(500);
		console.log(err);
	} else if (!doc) {
		console.log("查询不到");
	} else if (doc) {
		res.render("myPage", {
			user: {
				name: req.session.user.name
			},
			title: "我的主页",
			data: doc,
			avatar_url: doc.avatar_url
		})
	}
})
});

module.exports = router;