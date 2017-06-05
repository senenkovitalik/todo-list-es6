AppScope.TaskStatusEnum = class {
    constructor() {
        this.ACTIVE_TASK = new AppScope.TaskStatus("ACTIVE_TASK", "Active");
        this.COMPLETED_TASK = new AppScope.TaskStatus("COMPLETED_TASK", "Completed");
    }

    getByCode(code) {
        switch (code) {
        case "ACTIVE_TASK":
            return this.ACTIVE_TASK;
            break;
        case "COMPLETED_TASK":
            return this.COMPLETED_TASK;
            break;
        default:
            throw new Error("Task Code is not found");
        }
    }
};
