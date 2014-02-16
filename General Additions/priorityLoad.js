function loadPreConnectionPrePriorityScripts() {
    executeFunctions([
        loadNewLoadUserlist,
        loadGeneralStuff,
        loadCommandLoader,
        loadSettingsLoader,
        loadBigPlaylist,
        loadNewLoadUserlist,
        loadEvents,
        loadControlBar
    ]);
}

function loadPreConnectionPostPriorityScripts() {
    if (preConnectFunctions.lastIndexOf(loadPreConnectionPostPriorityScripts) !== preConnectFunctions.length - 1) {
        preConnectFunctions.push(loadPreConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([loadPriorityEvents]);
}

function loadPostConnectionPrePriorityScripts() {
    executeFunctions([]);
}

function loadPostConnectionPostPriorityScripts() {
    if (postConnectFunctions.lastIndexOf(loadPostConnectionPostPriorityScripts) !== postConnectFunctions.length - 1) {
        postConnectFunctions.push(loadPostConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([loadAutoComplete]);
}
preConnectFunctions.splice(0, 0, loadPreConnectionPrePriorityScripts);
preConnectFunctions.push(loadPreConnectionPostPriorityScripts);

postConnectFunctions.splice(0, 0, loadPostConnectionPrePriorityScripts);
postConnectFunctions.push(loadPostConnectionPostPriorityScripts);