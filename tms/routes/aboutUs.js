var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
		if (!req.session.user) { //到达/home路径首先判断是否已经登录
		res.redirect("/sign.html"); //未登录则重定向到 /login 路径
	} else {
		// 去找头像
		var User_data = global.dbHandel.getModel('user_data');
		User_data.findOne({
			"username": req.session.user.name
		}, function(err, user_data) {
			if (err) return handleError(err);
			// 找到头像
			var avatar_url = user_data.avatar_url;

			res.render("aboutUs", {
				user: {
					name: req.session.user.name
				},
				title: "联系我们",
				avatar_url: avatar_url
			});
		} );
	}
});

module.exports = router;