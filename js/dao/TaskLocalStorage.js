AppScope.TaskLocalStorage = (() => {
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
                list.push(new Task().fromJSON(task));
            });
            TaskLibrary.setTasksCount(list.length);

            return list;
        } catch (e) {
            console.log(e.message);
            return [];
        }
    }

    // save all tasks
    function saveAll(arrTaskList) {
        let arr = [];
        $.each(arrTaskList, (i, oTask) => {
            arr.push(oTask.toJSON());
        });
        localStorage.setItem(TASKS_KEY, JSON.stringify(arr));
        TaskLibrary.setTasksCount(arr.length);
    }

    // save task
    function saveTask(oTask) {
        if (!(oTask instanceof Task)) {
            throw new Error("Argument is not instance of 'Task'");
        }
        let taskList = getAll();
        taskList.push(oTask);
        saveAll(taskList);
    }

    // remove task
    function removeTask(nTaskId) {
        if (typeof nTaskId !== "number") {
            throw new Error("Argument is not 'Number'");
        }
        let taskList = getAll();
        const index = findTask(nTaskId);
        if (index) {
            taskList.splice(index, 1);
            saveAll(taskList);
        }
    }

    // remove all tasks
    function removeAll() {
        localStorage.setItem(TASKS_KEY, []);
    }

    // change task attr
    function changeTaskAttr(nTaskId, sAttr, mixValue) {
        if (typeof nTaskId !== "number") {
            throw new Error(`Argument ${nTaskId} is not 'Number'`);
        }

        if (typeof sAttr !== "string" || sAttr.length === 0) {
            throw new Error(`Argument ${sAttr} is not 'String' or length = 0`);
        }

        if (typeof mixValue === "string" && mixValue.length !== 0) {
        } else if (mixValue instanceof AppScope.TaskStatus) {
        } else if (typeof mixValue === "boolean") {
        } else {
            throw new Error(`Argument ${mixValue} is not of allowed types (String, TaskStatus, Boolean)`);
        }

        const nIndex = findTask(nTaskId);
        let arrTaskList = getAll();
        let oTask = arrTaskList[nIndex];

        switch (sAttr) {
            case "value":
                oTask.value = mixValue;
                break;
            case "status":
                oTask.status = mixValue;
                break;
            case "isChecked":
                oTask.isChecked = mixValue;
                break;
            default:
                console.log("Attr" + sAttr + " not found!!!");
        }
        saveAll(arrTaskList);
    }

    // return task index
    function findTask(nTaskId) {
        if (typeof nTaskId !== "number") {
            throw new Error(`Argument ${nTaskId} is not 'Number'`);
        }
        let arrTaskList = getAll();
        let nIndex = -1;
        $.each(arrTaskList, (i, oTask) => {
            if (nTaskId === oTask.id) {
                nIndex = i;
                return false;
            }
        });
        return nIndex;
    }

    // get filter value from LS
    function getFilter() {
        return localStorage.getItem(FILTER) || "active";
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
})();