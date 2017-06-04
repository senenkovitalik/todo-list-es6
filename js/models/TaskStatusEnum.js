var AppScope = window.AppScope || {};

AppScope.TaskStatusEnum = (function () {
    "use strict";
    var TaskStatus = function (code, label) {
        this.code = code;
        this.label = label;
    };

    var ACTIVE_TASK = new TaskStatus("ACTIVE_TASK", "Active");
    var COMPLETED_TASK = new TaskStatus("COMPLETED_TASK", "Completed");

    function getByCode(code) {
        if (this.hasOwnProperty(code)) {
            return this[code];
        } else {
            throw new Error("Task Code is not found");
        }
    }

    return {
        ACTIVE_TASK: ACTIVE_TASK,
        COMPLETED_TASK: COMPLETED_TASK,
        getByCode: getByCode
    };
}());