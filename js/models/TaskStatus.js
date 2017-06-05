AppScope.TaskStatus = class {
    constructor(code, label) {
        this._code = code;
        this._label = label;
    }

    set code(sCode) {
        this._code = sCode;
    }

    get code() {
        return this._code;
    }

    set label(sLabel) {
        this._label = sLabel;
    }

    get label() {
        return this._label;
    }
};
