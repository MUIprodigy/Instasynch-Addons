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

function loadExecuteOncePostPriorityScripts() {
    if (executeOnceFunctions.indexOf(loadExecuteOncePostPriorityScripts) !== executeOnceFunctions.length - 1) {
        executeOnceFunctions.splice(executeOnceFunctions.indexOf(loadExecuteOncePostPriorityScripts), 1);
        executeOnceFunctions.push(loadExecuteOncePostPriorityScripts);
        return;
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

function loadPreConnectionPostPriorityScripts() {
    if (preConnectFunctions.indexOf(loadPreConnectionPostPriorityScripts) !== preConnectFunctions.length - 1) {
        preConnectFunctions.splice(preConnectFunctions.indexOf(loadPreConnectionPostPriorityScripts), 1);
        preConnectFunctions.push(loadPreConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([]);
}

function loadPostConnectionPrePriorityScripts() {
    executeFunctions([]);
}

function loadPostConnectionPostPriorityScripts() {
    if (postConnectFunctions.indexOf(loadPostConnectionPostPriorityScripts) !== postConnectFunctions.length - 1) {
        postConnectFunctions.splice(postConnectFunctions.indexOf(loadPostConnectionPostPriorityScripts), 1);
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