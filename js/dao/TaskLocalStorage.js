AppScope.TaskLocalStorage = (function () {
    "use strict";
    const TASKS_KEY = AppScope.localStorageConstants.TASK_LIST;
    const FILTER = AppScope.localStorageConstants.FILTER;
    const Task = AppScope.Task;
    const TaskLibrary = AppScope.TaskLibrary;

    // get all tasks
    function getAll() {
        try {
            const taskListStringified = localStorage.getItem(TASKS_KEY).trim();
            const taskList = JSON.parse(taskListStringified);

            let taskArray = Array.isArray(taskList) ? taskList : [taskList];
            let list = [];

            $.each(taskArray, function (ignore, task) {
                let t = new Task();
                t.fromJSON(task);
                list.push(t);
            });
            console.log(list);
            TaskLibrary.setTasksCount(list.length);

            return list;
        } catch (e) {
            return [];
        }
    }

    // save all tasks
    function saveAll(taskList) {
        let arr = [];
        $.each(taskList, (i, task) => {
            arr.push(task.toJSON());
        });
        localStorage.setItem(TASKS_KEY, JSON.stringify(arr));
        TaskLibrary.setTasksCount(arr.length);
    }

    // save task
    function saveTask(task) {
        let taskList = getAll();
        taskList.push(task);
        saveAll(taskList);
    }

    // remove task
    function removeTask(taskId) {
        let taskList = getAll();
        const index = findTask(taskId);
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
        const index = findTask(taskId);
        let taskList = getAll();
        let task = taskList[index];
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
        let taskList = getAll();
        let index = null;
        $.each(taskList, (i, task) => {
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