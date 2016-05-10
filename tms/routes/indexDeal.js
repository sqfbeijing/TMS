var express = require('express');
var router = express.Router();

// 首页根据任务类型和任务名返回任务详情
router.post("/getTaskContentFromDb", function(req, res) {
	var type_name = req.body.type_name;
	var task_name = req.body.task_name;
	var user_task = global.dbHandel.getModel('user_task');
	var username = req.session.user.name;

	user_task.findOne({
		"username": username
	}, "types username ", function(err, user_task) {
		if (err) return handleError(err);
		if (!user_task) {
			console.log("查不到" + user_task);
			return;
		}
		if (user_task) {
			var arr = user_task.types;

			arr.forEach(function(item) {
				if (item.type_name === type_name) {
					item.tasks.forEach(function(item) {
						if (item.name === task_name) {
							res.send(item.content);
						}
					});
				}
			});
		}
	})

});

// 处理user_task表
router.post("/sendActionToDb", function(req, res) {
	var action = req.body.action;
	var typeName = req.body.typeName;
	var taskName = req.body.taskName;
	var username = req.session.user.name;
	if (req.body.taskName) {
		var taskName = req.body.taskName;
	}
	if (req.body.taskContent) {
		var taskContent = req.body.taskContent;
	}
	if (req.body.newTaskName) {
		var newTaskName = req.body.newTaskName;
	}
	if (req.body.newTypeName) {
		var newTypeName = req.body.newTypeName;
	}
	var user_task = global.dbHandel.getModel('user_task');

	user_task.findOne({
		"username": username
	}, "types username ", function(err, user_task) {
		if (err) {
			return handleError(err);
		}
		if (!user_task) {
			console.log("查不到" + user_task);
			return;
		}
		var arr = user_task.types;
		// 更改任务的详情
		if (action === "modifyTaskContent") {
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					item.tasks.forEach(function(item) {
						if (item.name === taskName && item.complete === false) {
							item.content = taskContent;
						}
					});
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("modifyTaskContent 成功");
				res.send("OK");
			});
		}

		// 更改任务名
		if (action === "modifyTaskName") {
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					item.tasks.forEach(function(item) {
						if (item.name === taskName && item.complete === false) {
							item.name = newTaskName;
						}
					});
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("modifyTaskName 成功");
				res.send("OK");
			});
		}
		// 完成任务
		if (action === "completeTask") {
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					item.tasks.forEach(function(item) {
						if (item.name === taskName && item.complete === false) {
							item.complete = true;
						}
					});
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("completeTask 成功");
				res.send("OK");
			});
		}
		// 增加任务
		if (action === "addTask") {
			// var states = "";
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					var newTask = {
						complete: false,
						content: " ",
						name: taskName
					};
					// 此处有问题
					// item.tasks.forEach(function(item) {
					// 	if (item.name === taskName && item.complete === false) {
					// 		states = "existedTaskName";
					// 		res.send("existedTaskName");
					// 	}
					// });
					// 若不存在相同名字的任务名
					// if (states !== "existedTaskName") {
						item.tasks.push(newTask);
					// }
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("addTask 成功");
				console.log("232");
				res.send("OK");
			});
		}

		if (action === "emptyFinishedTask") {
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					item.tasks.forEach(function(item, index, array) {
						if (item.complete === true) {
							// splice方法删除数组中的元素
							array.splice(index, 1);
						}
					});
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("emptyFinishedTask 成功");
				res.send("OK");
			});
		}
		// 增加任务类型
		if (action === "addType") {
			var states = "";

			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					states = "existedTypeName";
				}
			});
			if (states === "existedTypeName") {
				console.log("已存在的任务类型名，不入库");
				res.send("existedTypeName");
			} else {
				var temp = {
					tasks: [],
					type_name: typeName
				};

				arr.push(temp);
				//保存新的到数据库
				user_task.types = arr;
				user_task.save(function(err) {
					if (err) return handleError(err);
					console.log("addType 成功");
					res.send("OK");
				});
			}
		}
		// 删除任务类型
		if (action === "deleteType") {
			arr.forEach(function(item, index, array) {
				if (item.type_name === typeName) {
					// 删除这个类型及其子任务
					array.splice(index, 1);
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("deleteType 成功");
				res.send("OK");
			});
		}
		// 更改任务类型名
		if (action === "modifyTypeName") {
			arr.forEach(function(item) {
				if (item.type_name === typeName) {
					item.type_name = newTypeName;
				}
			});
			//保存新的到数据库
			user_task.types = arr;
			user_task.save(function(err) {
				if (err) return handleError(err);
				console.log("modifyTypeName 成功");
				res.send("OK");
			});
		}
	});
});

// 任务生成状态请求
router.post("/sendTaskStateToDb", function(req, res) {

	// console.log(req.body);
	var userName = req.session.user.name;
	var comments = [];
	var obj = req.body;
	obj.userName = userName;
	obj.comments = comments;
	// 保存obj到数据库
	var Task_state = global.dbHandel.getModel('task_state');
	// 初始化doc
	var task_state = new Task_state(obj);
	task_state.save(function (err, data) {
		if (err){
			console.log(err);
		} else {
			console.log('Saved : ', data );
			res.send("ok");
		}
	});
});


module.exports = router;