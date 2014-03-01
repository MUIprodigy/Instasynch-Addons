function loadGreynameCount() {

    function setViewerCount() {
        $('#viewercount').html(String.format('{0}/{1}', blacknamesCount, greynamesCount));
    }

    events.bind('onAddUser', setViewerCount);
    events.bind('onRemoveUser', setViewerCount);
    setViewerCount();
}

executeOnceFunctions.push(loadGreynameCount);