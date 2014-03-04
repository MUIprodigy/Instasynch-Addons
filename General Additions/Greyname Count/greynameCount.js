function loadGreynameCount() {

    function setViewerCount() {
        $('#viewercount').html(String.format('{0}/{1}', blacknamesCount, greynamesCount));
    }

    events.bind('onAddUser', setViewerCount);
    events.bind('onRemoveUser', setViewerCount);

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