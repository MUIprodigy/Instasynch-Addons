function loadWallCounter() {

    var oldAddMessage = unsafeWindow.addMessage,
        value,
        output;

    //add commands
    commands.set('regularCommands', "printWallCounter", printWallCounter, 'Prints the length of the walls for each user.');
    commands.set('regularCommands', "printMyWallCounter", printMyWallCounter, 'Prints the length of your own wall.');

    events.bind('onAddVideo', function(vidinfo) {
        resetWallCounter();
        value = wallCounter[vidinfo.addedby];
        if (vidinfo.addedby === thisUsername) {
            unsafeWindow.addMessage('', String.format('Video added successfully. WallCounter: [{0}]', unsafeWindow.secondsToTime(value)), '', 'hashtext');
            if (isBibbyRoom() && value >= 3600) {
                output = String.format('Watch out {0} ! You\'re being a faggot by adding more than 1 hour of videos !', thisUsername);
                unsafeWindow.addMessage('', output, '', 'hashtext');
            }
        }
    });

    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        if (!(username === '' && message === 'Video added successfully.')) {
            oldAddMessage(username, message, userstyle, textstyle);
        }
    };

    events.unbind('onPostConnect', loadWallCounter);
    /*
     * Commented since this shit isnt working and I have no idea why
     */
    // //overwrite InstaSynch's removeVideo
    // unsafeWindow.removeVideo = function(vidinfo){
    //     var indexOfVid = getVideoIndex(vidinfo);
    //     video = unsafeWindow.playlist[indexOfVid];
    //     value = wallCounter[video.addedby];
    //     value -= video.duration;

    //     if(value > 0){
    //         wallCounter[video.addedby] = value;
    //     }else{
    //         delete wallCounter[video.addedby];
    //     }

    //     oldRemoveVideo(vidinfo);
    // };    
}
var wallCounter = {};

function resetWallCounter() {
    var video,
        value,
        i;
    wallCounter = {};
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        video = unsafeWindow.playlist[i];
        value = wallCounter[video.addedby];
        value = (value || 0) + video.duration;
        wallCounter[video.addedby] = value;
    }
}

function printWallCounter() {
    resetWallCounter();
    var output = "",
        key,
        strTemp;
    for (key in wallCounter) {
        if (wallCounter.hasOwnProperty(key)) {
            strTemp = '[{0}: {1}]';
            if (wallCounter[key] > 3600) {
                strTemp = "<span style='color:red'>" + strTemp + "</span>";
            }
            output += String.format(strTemp, key, unsafeWindow.secondsToTime(wallCounter[key]));
        }
    }
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

function printMyWallCounter() {
    resetWallCounter();
    var output = "",
        timeToWall = 0,
        i;
    for (i = Math.max(getActiveVideoIndex(), 0); i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === thisUsername.toLowerCase()) {
            break;
        }
        timeToWall += unsafeWindow.playlist[i].duration;
    }
    output = String.format('[{0}: {1}], {2} till your videos play.', thisUsername, unsafeWindow.secondsToTime(wallCounter[thisUsername] || 0), unsafeWindow.secondsToTime(timeToWall));
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

events.bind('onResetVariables', function() {
    wallCounter = {};
});
events.bind('onPostConnect', loadWallCounter);