var AppScope = window.AppScope || {};

AppScope.LocationService = (function () {
    "use strict";
    // set URL hash value
    function setHash(value) {
        location.hash = value;
    }

    // get URL hash value
    function getHash() {
        return location.hash;
    }

    // get filter value from URL hash
    function getFilterValue() {
        return getHash().substring(8);
    }

    return {
        setHash: setHash,
        getHash: getHash,
        getFilterValue: getFilterValue
    };
}());