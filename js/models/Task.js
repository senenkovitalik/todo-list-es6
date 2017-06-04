var AppScope = window.AppScope || {};

AppScope.Task = function (id, value, status, isChecked) {
    "use strict";
    this.id = id;
    this.value = value;
    this.status = status; // Enum <TaskStatus.js>
    this.isChecked = isChecked;
};

AppScope.Task.prototype = {
    fromJSON: function (json) {
        "use strict";
        this.id = json.id;
        this.value = json.value;
        this.status = AppScope.TaskStatusEnum.getByCode(json.status);
        this.isChecked = Boolean(json.isChecked);

        return this;
    },

    toJSON: function () {
        "use strict";
        return {
            id: this.id,
            value: this.value,
            status: this.status.code,
            isChecked: this.isChecked
        };
    }
};