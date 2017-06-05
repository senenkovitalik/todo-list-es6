AppScope.TaskLibrary = (() => {
    "use strict";
    let arrSelectedTasks = [];
    let nTaskCount = 0;  // task amount in LS

    // add task container(HTML element li) that user select to arr
    function addSelected(liTaskContainer) {
        if (liTaskContainer.prop("tagName") !== "LI") {
            throw new Error("Argument is not a HTML li");
        }
        if ($.inArray(liTaskContainer, arrSelectedTasks)) {
            arrSelectedTasks.push(liTaskContainer);
        }
    }

    // remove task container(HTML element li) that user deselect from arr
    function removeSelected(liTaskContainer) {
        if (liTaskContainer.prop("tagName") !== "LI") {
            throw new Error("Argument is not a HTML li");
        }
        const index = $.inArray(liTaskContainer, arrSelectedTasks);
        if (index) {
            arrSelectedTasks.splice(index, 1);
        }
    }

    // clear arr of selected tasks
    function clearSelected() {
        arrSelectedTasks = [];
    }

    // get arr of selected tasks
    function getSelected() {
        return arrSelectedTasks;
    }

    // get task number that user select
    function getSelectedCount() {
        return arrSelectedTasks.length;
    }

    // set number of tasks loaded from LS
    // may change after add/del tasks
    function setTasksCount(count) {
        nTaskCount = count;
    }

    // check if all tasks that was load was select
    function isAllSelected() {
        return (getSelectedCount() === nTaskCount);
    }

    return {
        addSelected: addSelected,
        removeSelected: removeSelected,
        clearSelected: clearSelected,
        getSelected: getSelected,
        getSelectedCount: getSelectedCount,
        setTasksCount: setTasksCount,
        isAllSelected: isAllSelected
    };
})();