var express = require('express');
var router = express.Router();
var uploadFunc = require("../app").uploadFunc;
var fs = require("fs");
var path = require("path");
// console.log(uploadFunc)

router.post("/avatar", uploadFunc.single("portrait"), function(req, res) {
	// 上传图片
	// console.log(req.file);
	// var tmp_path = "../" + req.file.path;
	// var tmp_path = __dirname + "/../../" + req.file.filename;
	// 注意，这里必须用path.join和dirname。！我也不知道为什么。必须绝对路径
	var tmp_path = path.join(__dirname, "../public/tmp_uploads/" + req.file.filename);
	var newPath = path.join(__dirname, "../public/tmp_uploads/" + req.session.user.name + "_" + req.file.originalname);
	// 这个是发送给前端的path
	var sendPath = "/tmp_uploads/" + req.session.user.name + "_" + req.file.originalname;

	console.log(tmp_path);
	console.log(newPath);
	console.log(sendPath);
	// 将暂存文件夹的图片重命名一下
	fs.rename(tmp_path, newPath, function(err) {
		if (err) {
			console.log(err);
		}
		// 命名完之后，发送给前端
		var img = {
			path: sendPath,
			originalname: req.file.originalname
		};
		res.send(img);
	});
});

router.post("/commitAvatar", function(req, res) {
	// 提交，则从暂存文件夹移动到永久文件夹
	var tmp_path = path.join(__dirname, "../public" + req.body.src);
	var newPath = path.join(__dirname, "../public/images/avatars" + req.body.src.replace("/tmp_uploads", ""));
	// 提交以后，暂存文件夹的图片消失，需要发送新的路径到前端
	var sendPath = "/images/avatars" + req.body.src.replace("/tmp_uploads", "");
	var User_data = global.dbHandel.getModel('user_data');

	// console.log(tmp_path);
	// console.log(newPath);
	// console.log(sendPath);
	// 将暂存文件夹的图片重命名一下
	fs.rename(tmp_path, newPath, function(err) {
		if (err) {
			console.log(err);
		}
		// 命名完之后，保存到数据库，然后发送给前端

		User_data.update({
			username: req.session.user.name
		}, {
			avatar_url: sendPath
		}, function(err, doc) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(doc);
			var img = {
				path: sendPath
			};
			res.send(img);
		})
	});
});

router.post("/updateUserData", function(req, res) {
	var username = req.session.user.name;
	var dataName = req.body.dataName;
	var dataContent = req.body.dataContent;
	var User_data = global.dbHandel.getModel('user_data');

	User_data.findOne({
		username: username
	}, function(err, doc) {
		if (err) {
			console.log(err);
			return;
		}
		// 更新
		doc[dataName] = dataContent;
		doc.save(function(err) {
			if (err) {
				return handleError(err);
			}
			console.log("更新成功");
			res.send("ok");
		})
	})


})
module.exports = router;