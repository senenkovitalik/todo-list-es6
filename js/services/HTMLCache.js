AppScope.HTMLCache = (() => {
    let oNodes = {};

    function getNodes() {
        return oNodes;
    }

    function setNodes(oHTMLNodes) {
        oNodes = oHTMLNodes;
    }

    return {
        getNodes: getNodes,
        setNodes: setNodes
    }
})();