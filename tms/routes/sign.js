var express = require('express');
var router = express.Router();

//登录注册页面
router.get("/", function(req, res) {
	res.render("sign.ejs", {
	});
});


module.exports = router;