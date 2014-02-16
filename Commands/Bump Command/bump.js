function loadBumpCommand() {
    commands.set('modCommands', "bump ", bump, 'Bumps a video right under the active video. Parameters: the user to bump.');
}

function bump(params) {
    var user = params[1],
        bumpIndex = -1,
        i;

    if (!user) {
        unsafeWindow.addMessage('', 'No user specified: \'bump [user]', '', 'hashtext');
        return;
    }
    for (i = unsafeWindow.playlist.length - 1; i >= 0; i -= 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            bumpIndex = i;
            break;
        }
    }
    if (bumpIndex === -1) {
        unsafeWindow.addMessage('', "The user didn't add any videos", '', 'hashtext');
    } else {
        unsafeWindow.sendcmd('move', {
            info: unsafeWindow.playlist[bumpIndex].info,
            position: getActiveVideoIndex() + 1
        });
    }
}


preConnectFunctions.push(loadBumpCommand);