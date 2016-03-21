var express = require('express');
var router = express.Router();

//注销页面
router.post("/", function(req, res) {
	//先去掉session
	delete req.session.user;
	res.send("logoutSuccess");
});


module.exports = router;