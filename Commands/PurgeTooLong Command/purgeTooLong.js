function loadPurgeTooLongCommand() {
    commands.set('modCommands', "purgeTooLong ", purgeTooLong, 'Removes all videos over the timelimit with 1 hour as the standard timelimit. Parameters: timelimit in minutes.');
}

function purgeTooLong(params) {
    var maxTimeLimit = params[1] ? parseInt(params[1], 10) * 60 : 60 * 60,
        videos = [],
        i;

    //get all Videos longer than maxTimeLimit
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].duration >= maxTimeLimit) {
            videos.push({
                info: unsafeWindow.playlist[i].info,
                duration: unsafeWindow.playlist[i].duration
            });
        }
    }

    function compareVideos(a, b) {
        return b.duration - a.duration;
    }
    videos.sort(compareVideos);

    for (i = 0; i < videos.length; i += 1) {
        unsafeWindow.sendcmd('remove', {
            info: videos[i].info
        });
    }
}

preConnectFunctions.push(loadPurgeTooLongCommand);