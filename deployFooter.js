unsafeWindow.addEventListener('load', function() {
    function loadStuff() {
        if (unsafeWindow.global.page.name === 'room') {
            events.fire('onResetVariables');
            //events.bind('onPreConnect',);
            events.fire('onPreConnect');
            events.unbind('onPostConnect', loadAutoComplete);
            events.bind('onPostConnect', loadAutoComplete);
            if (isConnected) {
                events.fire('onPostConnect');
            } else {
                events.bind('onUserlist', postConnect);
            }
            unsafeWindow.addMessage('', String.format('<strong>Script {0} loaded.<br>Changelog: {1}</strong>', GM_info.script.version, 'https://github.com/Bibbytube/Instasynch-Addons/blob/master/changelog.txt'), '', 'hashtext');
        }
    }
    events.bind('onExecuteOnce', loadEventsOnce);
    events.fire('onExecuteOnce');
    loadStuff();
    events.bind('onRoomChange', loadStuff);

}, false);