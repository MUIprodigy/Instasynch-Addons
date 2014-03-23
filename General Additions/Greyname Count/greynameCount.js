function loadGreynameCountOnce() {
    events.bind('onAddUser', setViewerCount);
    events.bind('onRemoveUser', setViewerCount);
}

function setViewerCount() {
    $('#viewercount').html(String.format('{0}/{1}', blacknamesCount, greynamesCount));
}

function loadGreynameCount() {
    blacknamesCount = greynamesCount = modsCount = 0;
    for (i = 0; i < unsafeWindow.users.length; i += 1) {
        countUser(unsafeWindow.users[i], true);
    }
    setViewerCount();
}
events.bind('onDisconnect', function() {
    blacknamesCount = greynamesCount = modsCount = 0;
});
events.bind('onPostConnect', loadGreynameCount);
events.bind('onExecuteOnce', loadGreynameCountOnce);