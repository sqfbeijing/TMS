var express = require('express');
var router = express.Router();

router.post("/addAComment", function(req, res) {
	var Task_state = global.dbHandel.getModel('task_state');
	var username = req.session.user.name;
	var obj = req.body;
	var stateId = obj.stateId;
	// 添加信息到obj里
	obj.speakUserName = username;
	obj.reply = [];

	Task_state.findById(stateId, function(err, doc) {
		if (err) {
			console.log(err);
			return;
		}
		// console.log("doc是" + doc);
		doc.comments.push(obj);
		doc.commentCount++;
		doc.save(function(err) {
			if (err) {
				console.log(err);
				return;
			}
			// console.log("新doc" + doc);
			res.send("ok");
		})
	});
});

router.post("/addAReply", function(req, res) {
	var Task_state = global.dbHandel.getModel('task_state');
	var username = req.session.user.name;
	var stateId = req.body.stateId;
	var commentId = req.body.commentId;
	var obj = {};
	// 添加信息到obj里
	obj.time = req.body.time;
	obj.timeValue = req.body.timeValue;
	obj.speakUserName = username;
	obj.content = req.body.content;

	Task_state.findById(stateId, function(err, doc) {
		if (err) {
			console.log(err);
			return;
		}
		doc.comments.forEach(function(elem, index, array) {
			// console.log("commentId是" + commentId)
			// console.log("数据库id" + elem._id)
			// console.log("数据库id2" + elem.id)
			if (elem.id === commentId) {
				// console.log("就是这个评论");
				elem.reply.push(obj);
				// push之后。保存
				doc.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					// console.log("新doc" + doc);
					res.send("ok");
				})
			} else {
				console.log("未找到对应的id");
			}
		});
	});
});


module.exports = router;