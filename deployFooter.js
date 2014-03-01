unsafeWindow.addEventListener('load', function() {
    function loadStuff() {
        if (unsafeWindow.global.page.name === 'room') {
            preConnect();
            postConnect();
            unsafeWindow.addMessage('', String.format('<strong>Script {0} loaded.<br>Changelog: {1}<br>Save&Close button in the settings currently doesnt work in Firefox.</strong>', GM_info.script.version, 'https://github.com/Bibbytube/Instasynch-Addons/blob/master/changelog.txt'), '', 'hashtext');
        }
    }
    executeOnce();
    loadStuff();

    var oldLoadRoomObj = global.loadRoomObj;
    unsafeWindow.global.loadRoomObj = function() {
        oldLoadRoomObj();
        loadStuff();
    };

}, false);