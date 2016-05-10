var express = require('express');
var router = express.Router();
// 存放聊天室用户名的对象
var userNames = {};
// 进入这个页面的当前用户名
var userName = "";
// 存放聊天室用户头像路径的对象
var userAvatars = {};
// 进入这个页面的当前用户头像url
var userAvatar = "";
//聊天室
router.get("/", function(req, res) {
	if (!req.session.user) {
		res.redirect("/sign.html");
		return;
	}
	userName = req.session.user.name;
	// 去找头像
	var User_data = global.dbHandel.getModel('user_data');
	User_data.findOne({
		"username": userName
	}, function(err, user_data) {
		if (err) return handleError(err);
		// 找到头像
		 userAvatar = user_data.avatar_url;
		res.render("chatRoom.ejs", {
			user: {
				name: req.session.user.name
			},
			title: "聊天室",
			avatar_url: user_data.avatar_url
		});
	});
});

// 这个地方出了bug,只要有人刷新页面，获取的是最新的那个人名
// 改为：增加userNames对象
exports.chatSocket = function(server) {
	var io = require("socket.io")(server);

	io.on("connection", function(socket) {
		// console.log(socket.id);
		// 只要有个人连接了聊天室，就把这个人名存到聊天室的人名对象里面去
		userNames[socket.id] = userName;
		// 头像
		userAvatars[socket.id] = userAvatar;

		// console.log("断点3" + userAvatars);
		// 设置当前的用户名
		var personName = userNames[socket.id];
		// 设置当前的用户头像
		var personAvatar = userAvatars[socket.id];
		// console.log("断点2" + personAvatar);
		// console.log(socket.userName);
		console.log("用户" + personName + "已连接");
		// 让除了当前用户的其他用户知道有人来了此聊天室
		socket.broadcast.emit("join", {
			personName: personName
		});
		socket.on('disconnect', function() {
			console.log("用户" + personName + "断开了连接");
			socket.broadcast.emit("leave", {
				personName: personName
			});
		});

		socket.on('message', function(msg) {
			console.log(personName + 'say message: ' + msg);
			var time = require("../lib.js").getTime();
			// console.log("断点1，此用户头像" + personAvatar);

			//发送这个信息到所有人
			io.emit("message", {
				personName: personName,
				personAvatar: personAvatar,
				msg: msg,
				time: time
			});

			// // 测试sort
			// var sort = require("../lib.js").sort;

			// var arr = [];
			// for (var i = 0; i < 100000; i++) {
			// 	arr.push(Math.random().toFixed(5) * 100000);
			// }
			// console.log(sort(arr));
		});
	})
};

exports.chatRoom = router;
// 用户名传出去
// exports.person = person;
// exports.chatSocket = chatSocket;