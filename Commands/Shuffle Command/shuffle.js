function loadShuffleCommand() {
    commands.set('modCommands', "shuffle ", shuffle, 'Shuffles the playlist or a wall of a user (prepare for spam combined with ModSpy). Possible parameters: the user');
}

function shuffle(params) {
    var user = params[1],
        i,
        shuffleList = [],
        tempInfo,
        randIndex,
        newPosition;

    for (i = getActiveVideoIndex() + 1; i < unsafeWindow.playlist.length; i += 1) {
        if (!user || unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            shuffleList.push({
                i: i,
                info: unsafeWindow.playlist[i].info
            });
        }
    }
    for (i = 0; i < shuffleList.length; i += 1) {
        randIndex = Math.floor(Math.random() * shuffleList.length);
        tempInfo = shuffleList[i].info;
        newPosition = shuffleList[randIndex].i;
        unsafeWindow.sendcmd('move', {
            info: tempInfo,
            position: newPosition
        });
    }
}

executeOnceFunctions.push(loadShuffleCommand);