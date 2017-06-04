var AppScope = window.AppScope || {};

AppScope.TaskLibrary = (function () {
    "use strict";
    var selectedTasks = [];
    var taskCount = 0;  // task amount in LS

    // add task container(HTML element li) that user select to arr
    function addSelected(task) {
        if ($.inArray(task, selectedTasks)) {
            selectedTasks.push(task);
        }
    }

    // remove task container(HTML element li) that user deselect from arr
    function removeSelected(task) {
        var index = $.inArray(task, selectedTasks);
        if (index) {
            selectedTasks.splice(index, 1);
        }
    }

    // clear arr of selected tasks
    function clearSelected() {
        selectedTasks = [];
    }

    // get arr of selected tasks
    function getSelected() {
        return selectedTasks;
    }

    // get task number that user select
    function getSelectedCount() {
        return selectedTasks.length;
    }

    // set number of tasks loaded from LS
    // may change after add/del tasks
    function setTasksCount(count) {
        taskCount = count;
    }

    // check if all tasks that was load was select
    function isAllSelected() {
        return (getSelectedCount() === taskCount);
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
}());