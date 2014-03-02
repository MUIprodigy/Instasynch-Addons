function loadExecuteOncePrePriorityScripts() {
    executeFunctions([
        loadNewLoadUserlist,
        loadGeneralStuff,
        loadCommandLoaderOnce,
        loadSettingsLoader,
        loadBigPlaylistOnce,
        loadEventsOnce
    ]);
}

function loadExecuteOncePostPriorityScripts(index) {
    if (index !== executeOnceFunctions.length - 1 && executeOnceFunctions[executeOnceFunctions.length - 1] !== loadExecuteOncePostPriorityScripts) {
        executeOnceFunctions.push(loadExecuteOncePostPriorityScripts);
        return;
    }
    if (executeOnceFunctions.indexOf(loadExecuteOncePostPriorityScripts) !== executeOnceFunctions.length - 1) {
        executeOnceFunctions.splice(executeOnceFunctions.indexOf(loadExecuteOncePostPriorityScripts), 1);
    }
    executeFunctions([loadPriorityEvents]);
}

function loadPreConnectionPrePriorityScripts() {
    executeFunctions([
        loadBigPlaylist,
        loadControlBar,
        loadEvents
    ]);
}

function loadPreConnectionPostPriorityScripts(index) {
    if (index !== preConnectFunctions.length - 1 && preConnectFunctions[preConnectFunctions.length - 1] !== loadPreConnectionPostPriorityScripts) {
        preConnectFunctions.push(loadPreConnectionPostPriorityScripts);
        return;
    }
    if (preConnectFunctions.indexOf(loadPreConnectionPostPriorityScripts) !== preConnectFunctions.length - 1) {
        preConnectFunctions.splice(preConnectFunctions.indexOf(loadPreConnectionPostPriorityScripts), 1);
    }
    executeFunctions([]);
}

function loadPostConnectionPrePriorityScripts() {
    executeFunctions([]);
}

function loadPostConnectionPostPriorityScripts(index) {
    if (index !== postConnectFunctions.length - 1 && postConnectFunctions[postConnectFunctions.length - 1] !== loadPostConnectionPostPriorityScripts) {
        postConnectFunctions.push(loadPostConnectionPostPriorityScripts);
        return;
    }
    if (postConnectFunctions.indexOf(loadPostConnectionPostPriorityScripts) !== postConnectFunctions.length - 1) {
        postConnectFunctions.splice(postConnectFunctions.indexOf(loadPostConnectionPostPriorityScripts), 1);
    }
    executeFunctions([loadAutoComplete]);
}
preConnectFunctions.splice(0, 0, loadPreConnectionPrePriorityScripts);
preConnectFunctions.push(loadPreConnectionPostPriorityScripts);

postConnectFunctions.splice(0, 0, loadPostConnectionPrePriorityScripts);
postConnectFunctions.push(loadPostConnectionPostPriorityScripts);

executeOnceFunctions.splice(0, 0, loadExecuteOncePrePriorityScripts);
executeOnceFunctions.push(loadExecuteOncePostPriorityScripts);