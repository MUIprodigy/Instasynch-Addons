unsafeWindow.addEventListener('load', function() {
    function loadStuff() {
        if (unsafeWindow.global.page.name === 'room') {
            events.fire('onResetVariables');
            //events.bind('onPreConnect',);
            events.fire('onPreConnect');
            events.bind('onPostConnect', loadAutoComplete);
            if (isConnected) {
                events.fire('onPostConnect');
            } else {
                events.bind('onUserlist', postConnect);
            }
            unsafeWindow.addMessage('', String.format('<strong>Script {0} loaded.<br>Changelog: {1}<br>Save&Close button in the settings currently doesnt work in Firefox.</strong>', GM_info.script.version, 'https://github.com/Bibbytube/Instasynch-Addons/blob/master/changelog.txt'), '', 'hashtext');
        }
    }
    events.bind('onExecuteOnce', loadEventsOnce);
    events.fire('onExecuteOnce');
    loadStuff();
    var oldLoadRoomObj = unsafeWindow.global.loadRoomObj;
    unsafeWindow.global.loadRoomObj = function() {
        oldLoadRoomObj();
        loadStuff();
    };

}, false);