var express = require('express');
var router = express.Router();
/* GET home page. */
router.get("/", function(req, res) {
	if (!req.session.user) { //到达/home路径首先判断是否已经登录
		res.redirect("/sign.html"); //未登录则重定向到 /login 路径
		return;
	} 
	var taskName = req.query.taskName;
	var User_task = global.dbHandel.getModel('user_task');
	var username = req.session.user.name;
		// 去找头像
		var User_data = global.dbHandel.getModel('user_data');
		User_data.findOne({
			"username": username
		}, function(err, user_data) {
			if (err) return handleError(err);
		// 找到头像
		var avatar_url = user_data.avatar_url;

		User_task.findOne({username: username}, function (err, doc) {
			if (err) return console.error(err);

		// 拿到这个用户的userTask数组
		console.log(doc);
		var types = doc.types;
		console.log(Array.isArray(types));
		// console.log("类型"+ types);
		console.log("类型"+ types);
		// 进行字符串匹配
		// 定义结果数组
		var result = [];
		types.forEach(function(item, index, arr){
			item.tasks.forEach(function(task, index2, arr2) {
				var tmp = {
					taskName: task.name,
					content: task.content,
					complete: task.complete,
					typeName: item.type_name
				};
				if (task.name === taskName) {
					result.push(tmp);
				} else {
					// 若不是刚好完全相同的任务名，搜索的任务名是数据库任务名的一部分或者数据库任务名是搜索的任务名的一部分
					if (task.name.indexOf(taskName) !== -1 || taskName.indexOf(task.name) !== -1) {
						result.push(tmp);
					}
				}
			});
		});
		console.log("打印结果")
		console.log(result);
		res.render("searchTaskName", {
			title: "搜索任务",
			user: {
				name: req.session.user.name
			},
			searchTaskName: taskName,
			searchResult: result,
			avatar_url: avatar_url
		});
	});
	});
});

module.exports = router;