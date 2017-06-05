AppScope.Task = class {
    constructor(id, value, status, isChecked) {
        this._id = id;
        this._value = value;
        this._status = status;
        this._isChecked = isChecked;
    }

    set id(nId) {
        this._id = nId;
    }

    get id() {
        return this._id;
    }

    set value(sValue) {
        this._value = sValue;
    }

    get value() {
        return this._value;
    }

    set status(oStatus) {
        this._status = oStatus;
    }

    get status() {
        return this._status;
    }

    set isChecked(bool) {
        this._isChecked = bool;
    }

    get isChecked() {
        return this._isChecked;
    }

    fromJSON(json) {
        this.id = json.id;
        this.value = json.value;
        this.status = new AppScope.TaskStatusEnum().getByCode(json.status);
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