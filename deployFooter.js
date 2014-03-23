unsafeWindow.addEventListener('load', function() {
    function loadStuff() {
        if (unsafeWindow.global.page.name === 'room') {
            events.fire('onResetVariables');

            events.fire('onPreConnect');

            events.once('onPostConnect', loadAutoComplete);
            events.once('onPostConnect', setPlayerDimension);
            if (isConnected) {
                postConnect();
            } else {
                events.once('onUserlist', postConnect);
            }
            unsafeWindow.addMessage('', String.format('<strong>Script {0} loaded.<br>Changelog: {1}</strong>', GM_info.script.version, 'https://github.com/Bibbytube/Instasynch-Addons/blob/master/changelog.txt'), '', 'hashtext');
        }
    }
    events.bind('onExecuteOnce', loadEventsOnce);
    events.fire('onExecuteOnce');
    loadStuff();
    events.bind('onRoomChange', loadStuff);

}, false);