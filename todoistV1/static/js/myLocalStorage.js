function localStorageInitialization() {
	// 命名
	localStorage.storageName = "myLocalStorage";
	// 下面的两个变量经过反复斟酌发现只能放到函数内部,不能全局,因为全局过后,刷新页面就会使数据库改变,要想获得数据，只能从数据库拿到
	//几种分类方式 json表示
	/********下面是处理arrangement的代码**********/
	var arrangements = {
		"1": {
			"name": "type",
			"arrangement_id": 1
		},
		"2": {
			"name": "time",
			"arrangement_id": 2
		},
		"ids": [1, 2]
	};
	/********按任务类型分类的Projects的代码**********/
	var sortByType = {
		"1": {
			"name": "工作",
			"color": "green",
			"single_task_class": "work",
			"icon_class": "icon-gongzuonan",
			"in_trash": 0,
			"arrangement_id": 1,
			"project_id": 1
		},
		"2": {
			"name": "学习",
			"color": "blue",
			"single_task_class": "study",
			"icon_class": "icon-xuexi",
			"in_trash": 0,
			"arrangement_id": 1,
			"project_id": 2
		},
		"3": {
			"name": "娱乐",
			"color": "orange",
			"single_task_class": "play",
			"icon_class": "icon-yule",
			"in_trash": 0,
			"arrangement_id": 1,
			"project_id": 3
		},
		"4": {
			"name": "出行",
			"single_task_class": "go-out",
			"icon_class": "icon-jiaotongiconplane",
			"in_trash": 0,
			"color": "purple",
			"arrangement_id": 1,
			"project_id": 4
		},
		"ids": [1, 2, 3, 4]
	};
	// 按任务类型分类的所有小任务
	var allClassificationTasks = {
		"1": {
			"name": "完成前端任务",
			"completed": 0,
			"arrangement_id": 1,
			"project_id": 1,
			"task_id": 1
		},
		"2": {
			"name": "写完文档",
			"completed": 0,
			"arrangement_id": 1,
			"project_id": 1,
			"task_id": 2
		},
		"3": {
			"name": "完成工作交接",
			"completed": 0,
			"arrangement_id": 1,
			"project_id": 1,
			"task_id": 3
		},
		"ids": [1, 2, 3]
	};

	// 存到数据库
	localStorage.setItem("arrangements", JSON.stringify(arrangements));
	// 存到数据库
	localStorage.setItem("sortByType", JSON.stringify(sortByType));
	// 存到数据库
	localStorage.setItem("allClassificationTasks", JSON.stringify(allClassificationTasks));
	// alert("存放完毕")
}


// 此方法为全局方法,会改变value的值
//将增加数据项的操作封装起来，参数1为数据库的key如：("sortByType") string类型,参数2为key对应的数据库value,如：(sortByType) object类型；
// 参数3为要增加的一项,object类型, 参数4为需要addValue更新的那个属性如("project_id"),string类型
function addToTail(key, value, addValue, addValueProperty) {
	// 获取最大那个id
	var maxId = value.ids[value.ids.length - 1];
	//***将新增那一项的project_id变为最新！！！
	addValue[addValueProperty] = maxId + 1;
	// 增加这一项,需将属性变为string类型
	value[maxId + 1 + ""] = addValue;
	// 更新ids
	value.ids.push(maxId + 1);
	// 保存最新数据到数据库
	localStorage[key] = JSON.stringify(value);
}

// 若有垃圾箱的点击事件则,移动到垃圾箱的函数。此函数会在每次dom更新后的addTaskTypeHandler函数调用
function moveToTrash() {
	// 若点击垃圾箱图标,则将数据库的垃圾箱标识设置为1，然后重新描绘任务类型的dom
	var $trashIcon = $("main section.left .tasks.accordingto-types .tasks-group .single-task .icon-shanchu");
	$trashIcon.click(function(event) {
		/* Act on the event */
		var tempProjectId = $(this).parent().data("projectId");
		// 将数据库对应的那个项的垃圾箱标识设置为1
		var t1 = JSON.parse(localStorage.getItem("sortByType"));
		t1[tempProjectId + ""].in_trash = 1;
		localStorage.setItem("sortByType", JSON.stringify(t1));
		//重新渲染任务类型版块
		paintTaskType();
		// // 停止事件冒泡，解决bug:当点击垃圾箱时候，会出现右侧面板显示
		event.stopPropagation();
	});
}

function handlePanel() {
	//此函数事件也应该放到初始化事件里面
	var $taskPanel = $("main .right .task-items");
	var $taskTypeSwitches = $("main .left .tasks-group .single-task");

	// typePanels.push($taskPanel);
	// 此动画暂存所在方向来解决bug,初始是靠左边的
	var runPosition = "left";
	$taskTypeSwitches.click(function(event) {
		var project_id = $(this).data("projectId");
		if ($taskPanel.position().left == "-200") {
			$taskPanel.attr('data-project-id', project_id + "");
			// 渲染面板
			paintPanelTasks("allClassificationTasks", 1, parseInt(project_id));
			// 绑定事件
			addTaskPanelHandler();
		}
		// 指定终点所在的方向
		runPosition = runPosition == "right" ? "left" : "right";
		if (runPosition == "left") {
			$taskPanel.stop().animate({
				left: "-200px"
			}, 300, "linear");
		} else if (runPosition == "right") {
			$taskPanel.stop().animate({
				left: "0px"
			}, 300, "linear");
		}
	});
}

//按照数据库渲染taskType
function paintTaskType() {
	var $tasks_group = $("main section.left .tasks.accordingto-types .tasks-group");
	var $old_single_task = $("main section.left .tasks.accordingto-types .tasks-group .single-task");

	// 没在垃圾箱内的任务类型
	var useableTaskTypes = [];
	// 包括垃圾箱内的对象
	var allTaskTypes = JSON.parse(localStorage.getItem("sortByType"));
	//获得未在垃圾箱的任务类型
	for (var i = 0, count = allTaskTypes.ids.length; i < count; i++) {
		if (allTaskTypes[i + 1 + ""].in_trash === 0) {
			useableTaskTypes.push(allTaskTypes[i + 1 + ""]);
		}
	}
	//移除原有的html
	$old_single_task.detach();
	// 生成html,所有的task连成一串
	var innerHtmlWords = "";
	for (var i = 0; i < useableTaskTypes.length; i++) {
		//此处不难但很长很绕 ,注意data-project-id 主要是用来操作数据库和html的接口,还有垃圾箱的操作
		var temp = "<div class='single-task " + useableTaskTypes[i].single_task_class + "'" +
			"data-project-id='" + useableTaskTypes[i].project_id + "'>" +
			"<i class='iconfont " + useableTaskTypes[i].icon_class + "'></i> " +
			useableTaskTypes[i].name +
			"<i class='iconfont icon-shanchu'></i></div>";
		innerHtmlWords += temp;
	}

	$tasks_group.append(innerHtmlWords);
	addTaskTypeHandler();
}
// 按照数据库渲染右侧任务面板上的dom,参数1为数据库的key,string类型;参数2为arrangement_id,number类型;参数3为project_id,number类型;
function paintPanelTasks(key, arrangementId, projectId) {
	// 获得key对应的数据，并解析为object形式
	var taskDatas = JSON.parse(localStorage.getItem(key));
	var unfinishedTasks = [];
	var $unfinishedTasksGroup = $("main section.right .task-items ul .unfinished-tasks");
	for (var i = 0, traversalTimes = taskDatas.ids.length; i < traversalTimes; i++) {
		// 定义临时的对象,不难但不容易分辨
		var tempObject = taskDatas[taskDatas.ids[i] + ""];
		// 未完成&&符合排序id&&符合项目id；选取所有"arrangement_id" 为arrangementId, "project_id": projectId, "completed": 0的放到这个数组
		if (tempObject.completed === 0 && tempObject.arrangement_id == arrangementId && tempObject.project_id == projectId) {
			unfinishedTasks.push(tempObject);
		}
	}
	//具体操作dom
	// $unfinishedTasksGroup.html("");
	var innerHtmlWords = "";
	for (var i = 0; i < unfinishedTasks.length; i++) {
		var temp = "<li data-task-id='" + unfinishedTasks[i].task_id + "'><i class='iconfont switch icon-yuanquan'></i> " + unfinishedTasks[i].name + "</li>";
		innerHtmlWords += temp;
	}
	$unfinishedTasksGroup.html(innerHtmlWords);
	//右侧面板更新后，需要为新的dom绑定事件
	finishATask();
}

// 渲染完之后,所有的dom要重新绑定事件函数
function addTaskTypeHandler() {
	//解决重新渲染之后hover无效的bug
	var $typeSingleTaskBlock = $("main section.left .tasks.accordingto-types .tasks-group .single-task");
	// 移动鼠标，任务类型会toggle显示垃圾箱
	$typeSingleTaskBlock.hover(function() {
		$(this).toggleClass('hover');
		moveToTrash();
	}, function() {
		$(this).toggleClass('hover');
	});

	// 点击任务类型块,toggle背景为白色
	$typeSingleTaskBlock.click(function(event) {
		/* Act on the event */
		$(this).toggleClass("clicked").siblings().removeClass('clicked');
	});
	// 右侧panel的动画
	handlePanel();
	// 右侧panel上的事件组绑定
	// addTaskPanelHandler();
}
// // 任务面板上的全部事件
function addTaskPanelHandler() {
	addATask();
	finishATask();
}

// 任务面板的添加任务函数
function addATask() {
	var $addBlock = $("main section.right .task-items li.add-a-task");
	var $enterBlock = $("main section.right .task-items li.enter");
	var $input = $("main section.right .task-items li.enter input");
	var $taskEnterCancelButton = $("main section.right .task-items li.enter button.cancel");
	var $taskEnterConfirmButton = $("main section.right .task-items li.enter button.confirm");
	$addBlock.click(function(event) {
		/* Act on the event */
		$(this).hide();
		$enterBlock.show();
		$input.focus();
	});
	// 点击取消按钮则隐藏输入框，显示原来样子
	$taskEnterCancelButton.click(function(event) {
		/* Act on the event */
		// 清空input的值防止下次显示
		$input.val("");
		$addBlock.show();
		$enterBlock.hide();
	});
	//点击确定需要的操作
	$taskEnterConfirmButton.unbind().click(function(event) {
		/* Act on the event */
		var $input = $("main section.right .task-items li.enter input");
		var enterValue = $input.val();
		var project_id = $("main section.right article.task-items").attr('data-project-id');
		// 若输入为空或者全为空格
		if (enterValue.replace(/\s/g, "").length === 0) {
			enterValue = "未命名";
		}
		var tempAddValue = {
			"name": enterValue,
			"completed": 0,
			"arrangement_id": 1,
			"project_id": parseInt(project_id),
			"task_id": -1
		};
		var tempValue = JSON.parse(localStorage.allClassificationTasks);
		// 添加任务到数据库
		addToTail("allClassificationTasks", tempValue, tempAddValue, "task_id");
		//按照数据库渲染一下
		paintPanelTasks("allClassificationTasks", 1, parseInt(project_id));
		// 清空input的值防止下次显示
		$input.val("");
		$addBlock.show();
		$enterBlock.hide();
	});
}

function finishATask() {
	var $finishIconSwitch = $("main section.right article.task-items .unfinished-tasks i.iconfont.switch");
	$finishIconSwitch.hover(function() {
		/* Stuff to do when the mouse enters the element */
		$(this).removeClass('icon-yuanquan').addClass('icon-icon');
	}, function() {
		/* Stuff to do when the mouse leaves the element */
		$(this).removeClass('icon-icon').addClass('icon-yuanquan');
	});
	$finishIconSwitch.click(function(event) {
		/* 获取此任务的taskid */
		var taskId = $(this).parent().attr('data-task-id');
		var tempObject = JSON.parse(localStorage.getItem("allClassificationTasks"));
		var projectId = tempObject[taskId + ""].project_id;
		tempObject[taskId + ""].completed = 1;
		// 更新数据库
		localStorage.allClassificationTasks = JSON.stringify(tempObject);
		// 更新dom
		paintPanelTasks("allClassificationTasks", 1, projectId);
	});
}

//若浏览器里面没有数据库,则生成一个数据库
if (!localStorage.storageName) {
	localStorageInitialization();
}
// 需要在刷新页面执行的函数
paintTaskType();
// localStorage.clear();
