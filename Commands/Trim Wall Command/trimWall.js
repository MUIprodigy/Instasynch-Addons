function loadTrimWallCommand() {
    commands.set('modCommands', "trimWall ", trimWall, 'Trims a wall of a user to the timelimit with 1 hour as standard timelimit. Possible parameters: timelimit in minutes.');
}

function trimWall(params) {
    if (!params[1]) {
        unsafeWindow.addMessage('', 'No user specified: \'trimWall [user] [maxMinutes]', '', 'hashtext');
        return;
    }
    resetWallCounter();
    var user = params[1],
        maxTimeLimit = params[2] ? parseInt(params[2], 10) * 60 : 60 * 60,
        currentTime = wallCounter[user],
        videos = [],
        i;

    if (currentTime < maxTimeLimit) {
        unsafeWindow.addMessage('', 'The wall is smaller than the timelimit', '', 'hashtext');
        return;
    }
    //get all Videos for the user
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            videos.push({
                info: unsafeWindow.playlist[i].info,
                duration: unsafeWindow.playlist[i].duration
            });
        }
    }

    function compareVideos(a, b) {
        return b.duration - a.duration;
    }
    // function rmVideo(index, vidinfo){
    //     setTimeout(
    //         function(){
    //             sendcmd('remove', {info: vidinfo});
    //         }, 
    //         (index+1) * 750);
    // }
    //sort the array so we will get the longest first
    videos.sort(compareVideos);

    for (i = 0; i < videos.length && currentTime > maxTimeLimit; i += 1) {
        currentTime -= videos[i].duration;
        // rmVideo(i,videos[i].info);
        //delay via commandFloodProtect.js
        unsafeWindow.global.sendcmd('remove', {
            info: videos[i].info
        });
    }
}

executeOnceFunctions.push(loadTrimWallCommand);
