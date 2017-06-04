var AppScope = window.AppScope || {};

AppScope.TaskLocalStorage = (function () {
    "use strict";
    var TASKS_KEY = AppScope.localStorageConstants.TASK_LIST;
    var FILTER = AppScope.localStorageConstants.FILTER;
    var Task = AppScope.Task;
    var TaskLibrary = AppScope.TaskLibrary;

    // get all tasks
    function getAll() {
        try {
            var taskListStringified = localStorage.getItem(TASKS_KEY).trim();
            var taskList = JSON.parse(taskListStringified);

            var list = [];

            taskList = Array.isArray(taskList) ? taskList : [taskList];

            $.each(taskList, function (ignore, task) {
                list.push(new Task().fromJSON(task));
            });
            TaskLibrary.setTasksCount(list.length);

            return list;
        } catch (e) {
            return [];
        }
    }

    // save all tasks
    function saveAll(taskList) {
        var arr = [];
        $.each(taskList, function (i, task) {
            arr.push(task.toJSON());
        });
        localStorage.setItem(TASKS_KEY, JSON.stringify(arr));
        TaskLibrary.setTasksCount(arr.length);
    }

    // save task
    function saveTask(task) {
        var taskList = getAll();
        taskList.push(task);
        saveAll(taskList);
    }

    // remove task
    function removeTask(taskId) {
        var taskList = getAll();
        var index = findTask(taskId);
        if (index !== null) {
            taskList.splice(index, 1);
            saveAll(taskList);
        }
    }

    // remove all tasks
    function removeAll() {
        localStorage.setItem(TASKS_KEY, []);
    }

    // change task attr
    function changeTaskAttr(taskId, attr, value) {
        var index = findTask(taskId);
        var taskList = getAll();
        var task = taskList[index];
        switch (attr) {
            case "value":
                task.value = value;
                break;
            case "status":
                task.status = value;
                break;
            case "isChecked":
                task.isChecked = value;
                break;
            default:
                console.log("Attr" + attr + " not found!!!");
        }
        saveAll(taskList);
    }

    // return task index
    function findTask(taskId) {
        var taskList = getAll();
        var index = null;
        $.each(taskList, function (i, task) {
            if (parseInt(taskId) === task.id) {
                index = i;
                return false;
            }
        });
        return index;
    }

    // get filter value from LS
    function getFilter() {
        return localStorage.getItem(FILTER);
    }

    // save filter value to LS
    function saveFilter(filter) {
        localStorage.setItem(FILTER, filter);
    }

    return {
        getAll: getAll,
        saveAll: saveAll,
        saveTask: saveTask,
        removeTask: removeTask,
        removeAll: removeAll,
        changeTaskAttr: changeTaskAttr,
        getFilter: getFilter,
        saveFilter: saveFilter
    };
}());