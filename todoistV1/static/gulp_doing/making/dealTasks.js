/**
 *此js文件主要用于操作面板的显示
 *还有增加任务类型，增加普通任务
 *此文件需要放到localStorage.js后面：因为此js会有数据库操作
 */

// 增加删除任务
$(function() {
	var $typeAddBlock = $("main section.left .tasks.accordingto-types .single-task.add-task");
	var $typeEnterBlock = $("main section.left .tasks.accordingto-types .single-task.enter-task");
	var $typeEnterConfirmButton = $("main section.left .tasks.accordingto-types .single-task.enter-task button.confirm");
	var $typeEnterCancelButton = $("main section.left .tasks.accordingto-types .single-task.enter-task button.cancel");
	var $typeEnterInput = $("main section.left .tasks.accordingto-types .single-task.enter-task input");
	var $typeSingleTaskBlock = $("main section.left .tasks.accordingto-types .tasks-group .single-task");
	// 点击添加任务，则输入框
	$typeAddBlock.click(function(event) {
		/* Act on the event */
		$(this).hide();
		$typeEnterBlock.show();
		$typeEnterInput.focus();
	});
	// 点击取消按钮则隐藏输入框，显示原来样子
	$typeEnterCancelButton.click(function(event) {
		/* Act on the event */
		// 清空input的值防止下次显示
		$typeEnterInput.val("");
		$typeAddBlock.show();
		$typeEnterBlock.hide();
	});
	//点击确定需要的操作
	$typeEnterConfirmButton.click(function(event) {
		/* Act on the event */
		var enterValue = $typeEnterInput.val();
		// 若输入为空或者全为空格
		if (enterValue.replace(/\s/g, "").length === 0) {
			enterValue = "未命名";
		}
		var tempAddValue = {
			"name": enterValue,
			"color": "green",
			"single_task_class": "moren",
			"icon_class": "icon-15",
			"in_trash": 0,
			"arrangement_id": 1,
			"project_id": -1
		};

		var tempValue = JSON.parse(localStorage.sortByType);
		//新增类型到数据库
		addToTail("sortByType", tempValue, tempAddValue, "project_id");
		//照数据库渲染一下
		paintTaskType();
		// 清空input的值防止下次显示
		$typeEnterInput.val("");
		$typeAddBlock.show();
		$typeEnterBlock.hide();

	});
});