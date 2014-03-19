function loadBumpCommand() {
    commands.set('modCommands', "bump ", bump, 'Bumps a video right under the active video. Parameters: the user to bump, the position to bump to, a url to bump.');
    events.bind('onAddVideo', function(vidinfo) {
        if (videoInfoEquals(vidinfo.info, bumpInfo)) {
            unsafeWindow.global.sendcmd('move', {
                info: vidinfo.info,
                position: bumpTo || getActiveVideoIndex() + 1
            });
            bumpInfo = undefined;
            bumpTo = undefined;
        }
    });

}

function bump(params) {
    var user,
        bumpIndex = -1,
        bumpUrl,
        i,
        activeIndex = getActiveVideoIndex();

    for (i = 1; i < params.length; i += 1) {
        if (isUsername(params[i])) {
            user = params[i];
        } else if (!bumpInfo && (bumpInfo = urlParser.parse(params[i]))) {
            bumpUrl = params[i];
        } else {
            bumpTo = parseInt(params[i], 10);
            if (unsafeWindow.isNaN(bumpTo)) {
                bumpTo = activeIndex + 1;
            } else {
                bumpTo = Math.min(bumpTo, unsafeWindow.playlist.length - 1);
            }
        }
    }
    if (!user && !bumpInfo) {
        unsafeWindow.addMessage('', 'Nothing found to bump: \'bump [user]? [url]? [position]?', '', 'hashtext');
        return;
    }
    for (i = unsafeWindow.playlist.length - 1; i >= 0; i -= 1) {
        if (videoInfoEquals(unsafeWindow.playlist[i].info, bumpInfo) ||
            (user && unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase())) {
            bumpIndex = i;
            break;
        }
    }
    if (bumpIndex === -1) {
        if (!bumpInfo) {
            unsafeWindow.addMessage('', "The user didn't add any videos", '', 'hashtext');
        }
    } else {
        if (!bumpTo && bumpIndex < activeIndex) {
            bumpTo = activeIndex;
        }
        unsafeWindow.global.sendcmd('move', {
            info: unsafeWindow.playlist[bumpIndex].info,
            position: bumpTo || activeIndex + 1
        });
        bumpTo = undefined;
        bumpInfo = undefined;
    }
    if (bumpInfo) {
        unsafeWindow.global.sendcmd('add', {
            URL: bumpUrl
        });
    }
}

var bumpTo,
    bumpInfo;
events.bind('onExecuteOnce', loadBumpCommand);