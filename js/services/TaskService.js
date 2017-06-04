AppScope.TaskService = (() => {
    "use strict";
    let storage;
    let selectMode = false;

    const Task = AppScope.Task;
    const TaskStatusEnum = AppScope.TaskStatusEnum;
    const TaskLibrary = AppScope.TaskLibrary;
    const TaskLocalStorage = AppScope.TaskLocalStorage;
    const LocationService = AppScope.LocationService;

    // set storage object
    function initialize() {
        if (AppScope.config.storage === "serverApi") {
            storage = AppScope.ServerApi;
        } else {
            storage = TaskLocalStorage;
        }
    }

    // create task container (HTML element)
    function createTaskContainer(otask) {
        let checked = "";
        let selected = "";
        if (otask.status.label === "Completed") {
            checked = "checked";
        }
        if (otask.isChecked === true) {
            selected = " selected_item";
        }
        return "<li data-task-id='" + otask.id + "' data-task-status='" + otask.status.label + "'><div class='well well-sm" + selected + "'><div class='checkbox no-top-bottom-margin'><label><input type='checkbox' " + checked + ">" + otask.value + "</label></div></div></li>";
    }

    // produce content for task list
    function getTaskListContent() {
        let content = "";
        let tasks = storage.getAll();
        console.log(tasks);
        $.each(tasks, (ignore, taskObj) => {
            content += createTaskContainer(taskObj);
        });

        return content;
    }

    // add task container to list
    function addTaskToList(taskDescription) {
        const taskId = getUniqueNumber();
        const task = new Task(
            taskId,
            taskDescription,
            TaskStatusEnum.ACTIVE_TASK,
            false
        );

        storage.saveTask(task); // ???

        return createTaskContainer(task);
    }

    // show/hide buttons for tasks completing/decompleting tasks
    function showCompleteButton() {
        let btnComplete = $("#btn-complete");
        if (LocationService.getFilterValue() !== "completed" && selectMode) {
            btnComplete.removeClass("hide");
        } else {
            btnComplete.addClass("hide");
        }

        let btnDecomplete = $("#btn-uncomplete");
        if (LocationService.getFilterValue() === "completed" && selectMode) {
            btnDecomplete.removeClass("hide");
        } else {
            btnDecomplete.addClass("hide");
        }
    }

    // select/deselect tasks (need for multiselection)
    function selectTask(taskContainer) {
        let taskDiv = taskContainer.find(".well");
        if (!taskDiv.hasClass("selected_item")) {
            TaskLibrary.addSelected(taskContainer);
            storage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", true);
            selectMode = true;
        } else {
            TaskLibrary.removeSelected(taskContainer);
            storage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", false);
            if (!TaskLibrary.getSelectedCount()) {
                selectMode = false;
            }
        }
        taskDiv.toggleClass("selected_item");
        showCompleteButton();
    }

    // select all tasks
    function selectAllTasks() {
        let taskList = $("#list").find("li");
        $.each(taskList, (ignore, task) => {
            if ($(task).attr("style") !== "display: none") {
                TaskLibrary.addSelected(task);
                let taskDiv = $(task).find(".well");
                taskDiv.addClass("selected_item");
            }
        });
        selectMode = true;
        showCompleteButton();
    }

    // deselect all tasks
    function deselectAllTasks() {
        let taskList = $("#list").find("li");
        $.each(taskList, (ignore, task) => {
            let taskDiv = $(task).find(".well");
            taskDiv.removeClass("selected_item");
        });
        TaskLibrary.clearSelected();
        selectMode = false;
        showCompleteButton();
    }

    // change task status
    function changeTaskStatus(taskContainer) {
        const status = taskContainer.attr("data-task-status");
        let newStatus;

        if (status === "Active") {
            newStatus = TaskStatusEnum.COMPLETED_TASK;
        } else {
            newStatus = TaskStatusEnum.ACTIVE_TASK;
        }
        storage.changeTaskAttr(
            taskContainer.attr("data-task-id"),
            "status",
            TaskStatusEnum.COMPLETED_TASK
        );
        taskContainer.attr("data-task-status", newStatus.label);
    }

    // change tasks status to competed
    function completeTasks() {
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            storage.changeTaskAttr(
                $(taskContainer).attr("data-task-id"),
                "status",
                TaskStatusEnum.COMPLETED_TASK
            );
            $(taskContainer).attr("data-task-status", TaskStatusEnum.COMPLETED_TASK.label);
            $(taskContainer).find(".well").removeClass("selected_item");
            $(taskContainer).find("input").prop("checked", true);
        });
    }

    // change tasks status to active
    function uncompleteTasks() {
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            storage.changeTaskAttr(
                $(taskContainer).attr("data-task-id"),
                "status",
                TaskStatusEnum.ACTIVE_TASK
            );
            $(taskContainer).attr("data-task-status", TaskStatusEnum.ACTIVE_TASK.label);
            $(taskContainer).find("input").prop("checked", false);
        });
    }

    // Remove selected tasks
    function removeTasks() {
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            storage.removeTask($(taskContainer).attr("data-task-id"));
            $(taskContainer).remove();
        });
        TaskLibrary.clearSelected();
        selectMode = false;
        showCompleteButton();
    }

    // Execute appropriate functions for filtering and selecting
    function groupActions(action) {
        switch (action) {
        case "show-active":
            LocationService.setHash("filter=active");
            useFilter("active");
            storage.saveFilter("active");
            break;
        case "show-completed":
            LocationService.setHash("filter=completed");
            useFilter("completed");
            storage.saveFilter("completed");
            break;
        case "select-all":
            selectAllTasks();
            break;
        case "deselect-all":
            deselectAllTasks();
            break;
        case "remove-selected":
            removeTasks();
            break;
        }
    }

    // filter user task list
    function useFilter(filter) {
        filter = LocationService.getFilterValue();
        let taskList = $("#list").find("li");
        switch (filter) {
        case "active":
        case "completed":
            $.each(taskList, (ignore, v) => {
                if ($(v).attr("data-task-status").toLowerCase() === filter) {
                    $(v).show();
                } else {
                    $(v).hide();
                }
            });
            break;
        }
        deselectAllTasks();
    }

    // get unique number for task id
    function getUniqueNumber() {
        let date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
                + date.getMilliseconds() * Math.pow(10, 3)
                + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    // produce content for popover window ('More'/'Actions' menu)
    // decide what items will be shown
    function getPopoverContent() {
        let showObj = {
            showActive: "",
            showCompleted: "",
            selectAll: "",
            deselectAll: "",
            removeSelected: ""
        };

        let hide = "class='hide'";

        switch (LocationService.getFilterValue()) {
        case "active":
            showObj.showActive = hide;
            break;
        case "completed":
            showObj.showCompleted = hide;
            break;
        }

        let len = $(".list-unstyled")
            .find("li")
            .filter(() => {
                return $(this).attr("style") !== "display: none;";
            }).length;

        if (len === 0) {
            showObj.selectAll = hide;
        } else {
            showObj.selectAll = TaskLibrary.isAllSelected()
                ? hide
                : "";
        }
        if (!selectMode) {
            showObj.deselectAll = hide;
            showObj.removeSelected = hide;
        }

        let content = $("<ul class='list-unstyled' id='group-action-panel'><li " + showObj.showActive + "><a href='#' data-action='show-active'>Show active</a></li><li " + showObj.showCompleted + "><a href='#' data-action='show-completed'>Show completed</a></li><li " + showObj.selectAll + "><a href='#' data-action='select-all'>Select all</a></li><li " + showObj.deselectAll + "><a href='#' data-action='deselect-all'>Deselect all</a></li><li " + showObj.removeSelected + "><a href='#' data-action='remove-selected'>Remove task(s)</a></li></ul>");

        content.on("click", "li", (e) => {
            e.preventDefault();
            let action = $(e.target).attr("data-action");
            groupActions(action);
        });

        return content;
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList,
        getUniqueNumber: getUniqueNumber,
        getPopoverContent: getPopoverContent,
        getTaskListContent: getTaskListContent,
        selectTask: selectTask,
        selectAllTasks: selectAllTasks,
        changeTaskStatus: changeTaskStatus,
        completeTasks: completeTasks,
        uncompleteTasks: uncompleteTasks,
        groupActions: groupActions,
        useFilter: useFilter
    };
})();