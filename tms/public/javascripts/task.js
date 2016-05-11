// 此文件用于： 登陆后的首页，处理任务的事件

$(function() {
    //此页面函数库
    function refreshPage() {
        window.location.href = "/index.html";
    }

    function sendTaskStateToDb(state) {
        $.ajax({
            url: '/indexDeal/sendTaskStateToDb',
            type: "post",
            data: state,
            success: function(res) {
                if (res === "ok") {
                    console.log("sendTaskStateToDb成功！");
                }
            }
        })
    }

    function sendActionToDb(obj) {
        // obj 是这样:
        // {
        //     action: "modifyTypeName",
        //     taskContent: "newName11",
        //     typeName: "工作",
        //     taskName: "完成前端"
        // }
        var result;
        $.ajax({
            url: '/indexDeal/sendActionToDb',
            type: "post",
            data: obj,
            success: function(res) {
                if (res) {
                    result = res;
                    if (res === "OK") {
                        console.log("sendActionToDb成功！");
                        // // 若是主页的添加任务，则添加完之后直接刷新页面
                        // if (obj.action === "addTask") {
                        //     refreshPage();
                        // }
                    } else if (res === "existedTaskName") {
                        // 若是主页的添加任务
                        if (obj.action === "addTask") {
                            alert("已存在的任务名！");
                        }
                    }
                } else {
                    alert("ajax失败！");
                }
            }
        });
        return result;
    }

    // taskContentView的代码
    // 编辑按钮
    $(".taskContentView .edit").click(function(event) {
        $(this).parents(".taskContentView").find('.view-content').removeClass('db').addClass('dn');
        $(this).parents(".taskContentView").find('.edit-content').removeClass('dn').addClass('db');
        var words = $.trim($(this).parents(".taskContentView").find('.view-content').text());

        $(this).parents(".taskContentView").find('.edit-content textarea').val(words);
        $(this).parents(".taskContentView").find('.edit-content textarea').focus();
    });
    //取消按钮
    $(".taskContentView .edit-content .cancle").click(function(event) {
        $(this).parents(".taskContentView").find('.edit-content').removeClass('db').addClass('dn');
        $(this).parents(".taskContentView").find('.view-content').removeClass('dn').addClass('db');
    });

    // 点击编辑任务内容的保存按钮
    $(".taskContentView .edit-content .save").click(function(event) {
        // 渲染前端
        var words = $(this).siblings("textarea").val();
        $(this).parents(".taskContentView").find('.view-content').text(words);
        $(this).parents(".taskContentView").find('.edit-content').removeClass('db').addClass('dn');
        $(this).parents(".taskContentView").find('.view-content').removeClass('dn').addClass('db');
        // 获取任务类型
        var typeName = $(this).parents(".taskContentView").find('.typeName').text();
        var taskName = $(this).parents(".taskContentView").find('.taskName').text();
        var taskContent = words;
        // 将新的内容发送到后端
        var obj = {
            action: "modifyTaskContent",
            taskContent: taskContent,
            typeName: typeName,
            taskName: taskName
        };

        sendActionToDb(obj);
    });

    // 删除任务类型
    $(".taskTypes").on('click', '.taskType-item .delete', function(event) {
        var t = confirm("删除此任务类型后，此类型中的所有任务将被清空且不能恢复,确定吗？")

        if (t === false) {
            return;
        }
        var index = $(this).parent().index();
        var typeName = $(this).siblings('.name').text();
        var obj = {
            action: "deleteType",
            typeName: typeName
        };

        // 发到后端
        sendActionToDb(obj);
        // // 改前端
        // $(".task-panel").eq(index).remove();
        // $(this).parent().remove(); 
        refreshPage();
    });

    // 点击修改，则出现修改框
    $(".taskTypes").on('click', '.taskType-item .edit', function(event) {
        $(this).siblings('.modifyBlock').removeClass('dn');
    });

    // 点击修改旁边的取消，则隐藏
    $(".taskTypes").on('click', '.taskType-item .modifyBlock .cancle', function(event) {
        $(this).parent().addClass('dn');
    });
    // 点击修改旁边的保存
    $(".taskTypes").on('click', '.taskType-item .modifyBlock .save', function(event) {
        var typeName = $(this).parent().siblings('.name').text();
        var newTypeName = $.trim($(this).siblings('.editText').val());
        var $list = $(this).parents(".taskTypes").find('ul li.taskType-item');

        if (newTypeName === "") {
            alert("类型名字不能为空！");
            return;
        }
        if (newTypeName.length > 9) {
            alert("类型名字长度不能超过9!");
            return;
        }
        // 前端判断是否添加了相同的类型名字
        for (var i = 0; i < $list.length; i++) {
            var tmpText = $.trim($list.eq(i).find('.name').text());

            if (newTypeName === tmpText) {
                alert("不能修改为已存在的的类型名字！");
                $(this).siblings("input").val("");
                return;
            }
        }
        var obj = {
            action: "modifyTypeName",
            typeName: typeName,
            newTypeName: newTypeName
        };
        // 发到后端
        sendActionToDb(obj);
        // // 改dom
        // $(this).parents(".taskType-item").find('span.name').text(newTypeName);
        // $(this).parents(".modifyBlock").addClass('dn');
        // // 右侧欢迎块变动
        // var $spans = $(".welcomeWords .needDo .task .typeName");
        // for (var i = 0; i < $spans.length; i++) {
        //     if ($.trim($spans.eq(i).text()) === typeName) {
        //         $spans.eq(i).text(newTypeName);
        //     }
        // }
        refreshPage();
    });

$(".task-panel").on('click', '.edit', function(event) {
    $(this).siblings('.modifyBlock').removeClass('dn');
});
    // 面板上修改部分的函数
    //点击取消，则隐藏修改框
    $(".task-panel").on('click', '.modifyBlock .cancle', function(event) {
        $(this).parent().addClass('dn');
    });
    // 点击保存
    $(".task-panel").on('click', '.modifyBlock .save', function(event) {
        var taskName = $(this).parents("li").find('.taskName').text();
        var words = $.trim($(this).siblings('.editText').val());
        var $list = $(this).parents(".task-panel").find('.taskItems li');

        if (words === "") {
            alert("任务名字不能为空！");
            return;
        }
        if (words.length > 9) {
            alert("任务名字长度不能超过9!");
            return;
        }
        // 前端判断是否修改成了已存在的任务名
        for (var i = 0; i < $list.length; i++) {
            var tmpText = $.trim($list.eq(i).find('.taskName').text());

            if (words === tmpText) {
                alert("不能修改为已存在的任务名！");
                $(this).siblings("input").val("");
                return;
            }
        }

        $(this).parents("li").find('.taskName').text(words);
        $(this).parent().addClass('dn');
        $(this).siblings('input').val("");
        // 发送到后端
        var typeName = $(this).parents(".task-panel").find('.typeName').text();
        var obj = {
            action: "modifyTaskName",
            typeName: typeName,
            taskName: taskName,
            newTaskName: words
        };
        sendActionToDb(obj);
                // 右侧欢迎块变动
                var $spans = $(".welcomeWords .needDo .task .taskName");
                for (var i = 0; i < $spans.length; i++) {
                    if ($.trim($spans.eq(i).text()) === taskName) {
                        $spans.eq(i).text(words);
                    }
                }
            });
    // 面板上增加任务部分的函数
    $(".task-panel .addBlock button.add").click(function(event) {
        $(this).siblings('.addBlock-inner').removeClass('dn');
    });
    $(".task-panel .addBlock .addBlock-inner .cancle").click(function(event) {
        $(this).parent().addClass('dn');
    });
    // 确认
    $(".task-panel .addBlock .addBlock-inner .confirm").click(function(event) {
        var taskName = $.trim($(this).siblings('input').val());
        var typeName = $(this).parents(".task-panel").find('.typeName').text();
        var $list = $(this).parents(".task-panel").find('.taskItems li');

        if (taskName === "") {
            alert("任务名不能为空！");
            return;
        }
        if (taskName.length > 9) {
            alert("任务名长度不能超过9!");
            return;
        }
        // 前端判断是否添加了相同的任务名字
        for (var i = 0; i < $list.length; i++) {
            var tmpText = $.trim($list.eq(i).find('.taskName').text());

            if (taskName === tmpText) {
                alert("不能添加相同的的任务名！");
                $(this).siblings("input").val("");
                return;
            }
        }
        var obj = {
            action: "addTask",
            typeName: typeName,
            taskName: taskName,
        };
        // 将状态信息入库
        // 时间
        var tempDate = new Date();
        var y = tempDate.getFullYear();
        var mon = tempDate.getMonth() + 1;
        var d = tempDate.getDate();
        var h = tempDate.getHours();
        var min = tempDate.getMinutes();
        var s = tempDate.getSeconds();


        var time = y + "年" + mon + "月" + d + "日" + h + "时" + min + "分" + s + "秒";
        var timeValue = tempDate.getTime();
        // userName涉及安全问题，需要后端来写入，然后再传到数据库
        var userName = "";
        // comments也是后端写了一个空数组,因为ajax不传json的话就不能传数组
        var action = "发布了";
        var praiseCount = 0;
        var commentCount = 0;
        var state = {
            time: time,
            timeValue: timeValue,
            userName: userName,
            action: action,
            taskName: taskName,
            praiseCount: praiseCount,
            commentCount: commentCount
        };
        sendTaskStateToDb(state);
        sendActionToDb(obj);
        // 改dom
        var $new_li = $('<li>' +
            '<span class="taskName">' + taskName + '</span>' +
            ' <button class="finish">完成</button>' +
            ' <button class="seeContent">查看详情</button>' +
            ' <button class="edit">修改</button>' +
            '<div class="modifyBlock dn">' +
            '<input type="text" class="editText">' +
            '<button class="save">保存</button>' +
            '<button class="cancle">取消</button>' +
            '</div>' +
            '</li>');
        $new_li.appendTo($(this).parents(".task-panel").find('ul.taskItems'));
        $(this).parents(".addBlock").find('input').val("");
        $(this).parents(".addBlock-inner").addClass('dn');
        // 添加欢迎块对应的那个div
        var needCount = parseInt($(".welcomeWords .needDo .title .count").text());
        var $newTask = $(' <div class="task"><i class="iconfont icon-renwudiaodu"></i>' +
            '<span class="taskName">' + taskName +
            '</span>' +
            '(<span class="typeName">' + typeName +
                '</span>)' +
        '</div>');
        $newTask.appendTo('.welcomeWords .needDo .tasks');
        needCount++;
        $(".welcomeWords .needDo .title .count").text(needCount + "");
    });
    // 点击完成
    $(".task-panel").on('click', 'li .finish', function(event) {
        var taskName = $(this).parents("li").find('.taskName').text();
        var typeName = $(this).parents(".task-panel").find('.typeName').text();
        var obj = {
            action: "completeTask",
            typeName: typeName,
            taskName: taskName,
        };
        // 将状态信息入库
        // 时间
        var tempDate = new Date();
        var y = tempDate.getFullYear();
        var mon = tempDate.getMonth() + 1;
        var d = tempDate.getDate();
        var h = tempDate.getHours();
        var min = tempDate.getMinutes();
        var s = tempDate.getSeconds();
        var time = y + "年" + mon + "月" + d + "日" + h + "时" + min + "分" + s + "秒";
        var timeValue = tempDate.getTime();
        // userName涉及安全问题，需要后端来写入，然后再传到数据库
        var userName = "";
        // comments也是后端写了一个空数组,因为ajax不传json的话就不能传数组
        var action = "完成了";
        var praiseCount = 0;
        var commentCount = 0;
        var state = {
            time: time,
            timeValue: timeValue,
            userName: userName,
            action: action,
            taskName: taskName,
            praiseCount: praiseCount,
            commentCount: commentCount
        };
        sendTaskStateToDb(state);

        sendActionToDb(obj);
        // 修改完成的数目
        var completeCount = parseInt($(this).parents("ul").siblings('.completedTasks').find(".count").text());
        completeCount++;
        $(this).parents("ul").siblings('.completedTasks').find(".count").text(completeCount + "");
        // 增加元素到completedTasks
        var newCompletedTask = $('<li><span class="name">' + taskName + '</span></li>');
        newCompletedTask.appendTo($(this).parents("ul").siblings('.completedTasks').find('.items'));
        $(this).parent().remove();
        // 移除欢迎块对应的那个div
        var $welcomeTasks = $(".welcomeWords .needDo .task");
        var needCount = parseInt($(".welcomeWords .needDo .title .count").text());
        var finishedCount = parseInt($(".welcomeWords .finished  .count").text());

        for (var i = 0; i < $welcomeTasks.length; i++) {
            var tmp_typeName = $.trim($welcomeTasks.eq(i).find('.typeName').text());
            var tmp_taskName = $.trim($welcomeTasks.eq(i).find('.taskName').text());
            console.log(tmp_typeName)
            console.log(tmp_taskName)
            console.log(taskName)
            console.log(taskName)
            if (tmp_typeName === typeName && tmp_taskName === taskName) {
                $welcomeTasks.eq(i).remove();
                needCount--;
                finishedCount++;
                $(".welcomeWords .needDo .title .count").text("" + needCount);
                $(".welcomeWords .finished  .count").text("" + finishedCount);
            }
        }
    });

    // 点击关闭详情
    $(".taskContentView .closeView").click(function(event) {
        /* Act on the event */
        $(".taskContentView").addClass('dn');
        $(".welcomeWords").removeClass('dn');
    });
    // 点击显示任务面板 

    $(".taskTypes").on('click', '.taskType-item .show', function(event) {
        var index = $(this).parent().index();
        $(".task-wrapper").addClass('on');
        $(".task-panel").eq(index).addClass("on").siblings().removeClass('on');
        event.stopPropagation();
    });
    // 点击非面板部分，则关闭面板
    $("body").click(function(event) {
        $(".task-wrapper").removeClass('on');
    });
    $(".task-wrapper").click(function(event) {
        event.stopPropagation();
    });

    //点击查看已完成的任务
    $(".completedTasks .see").click(function(event) {
        $(this).siblings('.items').toggleClass('on');
    });
    // 点击 查看详情 显示详情
    $(".task-panel").on('click', '.seeContent', function(event) {
        var type_name = $(this).parents(".task-panel").find('.title .typeName').text();
        var task_name = $(this).siblings('.taskName').text();
        var getWords = "";

        // 渲染类型名字和任务名字
        $(".taskContentView .typeName").text(type_name);
        $(".taskContentView .taskName").text(task_name);
        // ajax获取任务详情到显示的div
        $.ajax({
            url: '/indexDeal/getTaskContentFromDb',
            type: "post",
            data: {
                type_name: type_name,
                task_name: task_name
            },
            success: function(data) {
                if (data) {
                    getWords = data;

                    if ($.trim(getWords) === "") {
                        $(".taskContentView .view-content").text("暂无详情!");
                    } else {
                        $(".taskContentView .view-content").text(getWords);
                    }
                    $(".welcomeWords").addClass('dn');
                    $(".taskContentView").removeClass('dn');
                    // 隐藏面板
                    $(".task-wrapper").removeClass('on');
                } else {
                    alert("ajax失败！");
                }
            }
        });
    });
    // 点击清空已完成
    $(".completedTasks .delete").click(function(event) {
        /* Act on the event */
        var r = window.confirm("此操作会删除已完成的数据，并且不可恢复，确定吗？");

        if (r === false) {
            return;
        }
        var typeName = $(this).parents(".task-panel").find('.title .typeName').text();
        var obj = {
            action: "emptyFinishedTask",
            typeName: typeName
        };
        // 发到后端
        sendActionToDb(obj);
        $(this).siblings('.items').find('li').remove();
        $(this).parents(".completedTasks").find('.count').text("0");
    });
    //任务类型部分的代码
    // 增加任务类型
    $(".taskTypes .addType .addBtn").click(function(event) {
        var typeName = $.trim($(this).siblings('.typeText').val());
        var $list = $(".taskType-item");

        if ($list.length === 10) {
            alert("类型名字不能超过10种！");
            return;
        }
        if (typeName === "") {
            alert("类型名字不能为空！");
            return;
        }
        if (typeName.length > 9) {
            alert("类型名字长度不能超过9!");
            return;
        }
        // 前端判断是否添加了相同的类型名字
        for (var i = 0; i < $list.length; i++) {
            var tmpText = $.trim($list.eq(i).find('.name').text());

            if (typeName === tmpText) {
                alert("不能添加相同的类型名字！");
                $(this).siblings("input").val("");
                return;
            }
        }

        var obj = {
            action: "addType",
            typeName: typeName
        };

        // 发到后端
        sendActionToDb(obj);
        // // 生成新的li
        // var $new_li = $(' <li class="taskType-item">' +
        //     '<i class="iconfont icon-tag"></i>' +
        //     ' <span class="name">' + typeName + '</span>' +
        //     ' <button class="show">查看</button>' +
        //     ' <button class="delete">删除</button>' +
        //     ' <button class="edit">修改</button>' +
        //     '<span class="modifyBlock dn">' +
        //     '<input type="text" class="tac editText">' +
        //     '<button class="save">保存</button>' +
        //     '<button class="cancle">取消</button>' +
        //     '</span>' +
        //     '</li>');
        // $new_li.appendTo('.main .taskTypes ul');

        // 由于动态生成任务面板的代码很麻烦，所以刷新页面
        refreshPage();
    });
})