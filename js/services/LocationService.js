AppScope.LocationService = (() => {
    "use strict";
    // set URL hash value
    function setHash(sValue) {
        if (typeof sValue !== "string" || sValue.length === 0) {
            throw new Error(`Argument ${sValue} is not 'String' or length = 0`);
        }
        location.hash = sValue;
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
})();