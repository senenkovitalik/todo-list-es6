AppScope.TaskService = (() => {
    "use strict";
    const Task = AppScope.Task;
    const TaskStatusEnum = AppScope.TaskStatusEnum;
    const TaskLibrary = AppScope.TaskLibrary;
    const TaskLocalStorage = AppScope.TaskLocalStorage;
    const LocationService = AppScope.LocationService;

    let storage;
    let selectMode = false;

    // set storage object
    function initialize() {
        storage = (AppScope.config.storage === "serverApi")
            ? AppScope.ServerApi
            : TaskLocalStorage;
    }

    // create task container (HTML element)
    function createTaskContainer(oTask) {
        if (!(oTask instanceof Task)) {
            throw new Error("Arguments is not of type 'Task'");
        }
        let checked = "";
        let selected = "";
        if (oTask.status.label === "Completed") {
            checked = "checked";
        }
        if (oTask.isChecked === true) {
            selected = "selected_item";
        }
        return `<li data-task-id='${oTask.id}' data-task-status='${oTask.status.label}'><div class='well well-sm ${selected}'><div class='checkbox no-top-bottom-margin'><label><input type='checkbox' ${checked}>${oTask.value}</label></div></div></li>`;
    }

    // produce content for task list
    function getTaskListContent() {
        let sContent = "";
        let arrTasks = storage.getAll();
        $.each(arrTasks, (ignore, oTask) => {
            sContent += createTaskContainer(oTask);
        });

        return sContent;
    }

    // add task container to list
    function addTaskToList(sTaskName) {
        if (typeof sTaskName !== "string" || sTaskName.length === 0) {
            throw new Error("Argument is not string or length = 0");
        }
        const taskId = getUniqueNumber();
        const task = new Task(
            taskId,
            sTaskName,
            new TaskStatusEnum().getByCode("ACTIVE_TASK"),
            false
        );

        storage.saveTask(task);

        return createTaskContainer(task);
    }

    // show/hide buttons for tasks completing/decompleting tasks
    function showCompleteButton() {
        const filterValue =LocationService.getFilterValue();
        let btnComplete = $("#btn-complete");
        let btnUncomplete = $("#btn-uncomplete");

        (filterValue !== "completed" && selectMode)
            ? btnComplete.removeClass("hide")
            : btnComplete.addClass("hide");

        (filterValue === "completed" && selectMode)
            ? btnUncomplete.removeClass("hide")
            : btnUncomplete.addClass("hide");
    }

    // select/deselect tasks (need for multiselection)
    function selectTask(liTaskContainer) {
        if (liTaskContainer.prop("tagName") !== "LI") {
            throw new Error("Argument is not HTML li");
        }

        let taskDiv = liTaskContainer.find(".well");

        if (!taskDiv.hasClass("selected_item")) {
            TaskLibrary.addSelected(liTaskContainer);
            selectMode = true;
        } else {
            TaskLibrary.removeSelected(liTaskContainer);
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
        if (taskContainer.prop("tagName") !== "LI") {
            throw new Error("Argument is not HTML li");
        }

        const status = taskContainer.attr("data-task-status");
        let newStatus = (status === "Active")
            ? new TaskStatusEnum().getByCode("COMPLETED_TASK")
            : new TaskStatusEnum().getByCode("ACTIVE_TASK");

        storage.changeTaskAttr(
            parseInt(taskContainer.attr("data-task-id")),
            "status",
            newStatus
        );
        taskContainer.attr("data-task-status", newStatus.label);
    }

    // change tasks status to competed
    function completeTasks() {
        const taskStatus = new TaskStatusEnum().getByCode("COMPLETED_TASK");
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            let tc = $(taskContainer);
            storage.changeTaskAttr(
                parseInt(tc.attr("data-task-id")),
                "status",
                taskStatus
            );
            tc.attr("data-task-status", taskStatus.label);
            tc.find(".well").removeClass("selected_item");
            tc.find("input").prop("checked", true);
        });
    }

    // change tasks status to active
    function uncompleteTasks() {
        const taskStatus = new TaskStatusEnum().getByCode("ACTIVE_TASK");
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            let tc = $(taskContainer);
            storage.changeTaskAttr(
                parseInt(tc.attr("data-task-id")),
                "status",
                taskStatus
            );
            tc.attr("data-task-status", taskStatus.label);
            tc.find("input").prop("checked", false);
        });
    }

    // Remove selected tasks
    function removeTasks() {
        $.each(TaskLibrary.getSelected(), (ignore, taskContainer) => {
            let tc = $(taskContainer);
            storage.removeTask(tc.attr("data-task-id"));
            tc.remove();
        });
        TaskLibrary.clearSelected();
        selectMode = false;
        showCompleteButton();
    }

    // Execute appropriate functions for filtering and selecting
    function groupActions(sAction) {
        if (typeof sAction !== "string" || sAction.length === 0) {
            throw new Error("Argument is not string or length = 0");
        }
        switch (sAction) {
        case "show-active":
            LocationService.setHash("filter=active");
            useFilter();
            storage.saveFilter("active");
            break;
        case "show-completed":
            LocationService.setHash("filter=completed");
            useFilter();
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
    function useFilter() {
        const sFilter = LocationService.getFilterValue();
        let taskList = $("#list").find("li");

        switch (sFilter) {
        case "active":
        case "completed":
            $.each(taskList, (ignore, v) => {
                if ($(v).attr("data-task-status").toLowerCase() === sFilter) {
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
        const showObj = {
            showActive: "",
            showCompleted: "",
            selectAll: "",
            deselectAll: "",
            removeSelected: ""
        };

        const hide = "class='hide'";

        switch (LocationService.getFilterValue()) {
        case "active":
            showObj.showActive = hide;
            break;
        case "completed":
            showObj.showCompleted = hide;
            break;
        }

        let len = $(".list-unstyled").find("li").filter(() => {
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

        const content = $("<ul class='list-unstyled' id='group-action-panel'><li " + showObj.showActive + "><a href='#' data-action='show-active'>Show active</a></li><li " + showObj.showCompleted + "><a href='#' data-action='show-completed'>Show completed</a></li><li " + showObj.selectAll + "><a href='#' data-action='select-all'>Select all</a></li><li " + showObj.deselectAll + "><a href='#' data-action='deselect-all'>Deselect all</a></li><li " + showObj.removeSelected + "><a href='#' data-action='remove-selected'>Remove task(s)</a></li></ul>");

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