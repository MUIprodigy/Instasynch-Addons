function loadExecuteOncePrePriorityScripts() {
    executeFunctions([
        loadNewLoadUserlist,
        loadGeneralStuff,
        loadCommandLoader,
        loadSettingsLoader,
        loadBigPlaylistOnce,
        loadEvents
    ]);
}

function loadExecuteOncePostPriorityScripts() {
    if (executeOnceFunctions.lastIndexOf(loadExecuteOncePostPriorityScripts) !== executeOnceFunctions.length - 1) {
        executeOnceFunctions.push(loadExecuteOncePostPriorityScripts);
        return;
    }
    executeFunctions([loadPriorityEvents]);
}

function loadPreConnectionPrePriorityScripts() {
    executeFunctions(resetVariables);
    executeFunctions([
        loadBigPlaylist,
        loadControlBar
    ]);
}

function loadPreConnectionPostPriorityScripts() {
    if (preConnectFunctions.lastIndexOf(loadPreConnectionPostPriorityScripts) !== preConnectFunctions.length - 1) {
        preConnectFunctions.push(loadPreConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([]);
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

executeOnceFunctions.splice(0, 0, loadExecuteOncePrePriorityScripts);
executeOnceFunctions.push(loadExecuteOncePostPriorityScripts);