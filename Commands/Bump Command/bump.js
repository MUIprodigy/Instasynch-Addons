function loadBumpCommand() {
    commands.set('modCommands', "bump ", bump, 'Bumps a video right under the active video. Parameters: the user to bump, the position to bump to.');
}

function bump(params) {

    var user,
        bumpIndex = -1,
        bumpTo,
        i;
    if (params.length === 2) {
        if (isUsername(params[1])) {
            user = params[1];
        }
        bumpTo = getActiveVideoIndex() + 1;
    } else {
        for (i = 1; i < params.length; i += 1) {
            if (isUsername(params[i])) {
                user = params[i];
            } else {
                bumpTo = parseInt(params[i], 10);
                if (unsafeWindow.isNaN(bumpTo)) {
                    bumpTo = getActiveVideoIndex() + 1;
                } else {
                    bumpTo = min(bumpTo, unsafeWindow.playlist.length - 1);
                }
            }
        }
    }
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
        unsafeWindow.global.sendcmd('move', {
            info: unsafeWindow.playlist[bumpIndex].info,
            position: bumpTo
        });
    }
}

events.bind('onExecuteOnce', loadBumpCommand);