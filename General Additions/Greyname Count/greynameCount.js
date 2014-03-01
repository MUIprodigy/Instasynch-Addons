function loadGreynameCount() {

    function setViewerCount() {
        $('#viewercount').html(String.format('{0}/{1}', blacknamesCount, greynamesCount));
    }
    onAddUser.push({
        callback: setViewerCount
    });
    onRemoveUser.push({
        callback: setViewerCount
    });
    setViewerCount();
}

executeOnceFunctions.push(loadGreynameCount);