AppScope.Task = class {
    constructor(id, value, status, isChecked) {
        this.id = id;
        this.value = value;
        this.status = status;
        this.isChecked = isChecked;
    }

    fromJSON(json) {
        this.id = json.id;
        this.value = json.value;
        this.status = new AppScope.TaskStatusEnum.getByCode(json.status);
        this.isChecked = Boolean(json.isChecked);
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            value: this.value,
            status: this.status.code,
            isChecked: this.isChecked
        };
    }
};