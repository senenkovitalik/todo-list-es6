// AppScope.TaskStatusEnum = (() => {
//     "use strict";
//     const TaskStatus = function (code, label) {
//         this.code = code;
//         this.label = label;
//     };
//
//     const ACTIVE_TASK = new TaskStatus("ACTIVE_TASK", "Active");
//     const COMPLETED_TASK = new TaskStatus("COMPLETED_TASK", "Completed");
//
//     function getByCode(code) {
//         if (this.hasOwnProperty(code)) {
//             return this[code];
//         } else {
//             throw new Error("Task Code is not found");
//         }
//     }
//
//     return {
//         ACTIVE_TASK: ACTIVE_TASK,
//         COMPLETED_TASK: COMPLETED_TASK,
//         getByCode: getByCode
//     };
// })();

class TaskStatus {
    constructor(code, label) {
        this.code = code;
        this.label = label;
    }
}

AppScope.TaskStatusEnum = class {
    constructor() {
        this.ACTIVE_TASK = new TaskStatus("ACTIVE_TASK", "Active");
        this.COMPLETED_TASK = new TaskStatus("COMPLETED_TASK", "Completed");
    }

    getByCode(code) {
        if (this.hasOwnProperty(code)) {
            return this[code];
        } else {
            throw new Error("Task Code is not found");
        }
    }
};