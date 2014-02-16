function loadRemoveLast() {
    commands.set('modCommands', "removeLast ", removeLast, 'Removes the last video of a user. Parameters: the user.');
}

// Remove the last video from the user 
function removeLast(params) {
    if (!params[1]) {
        unsafeWindow.addMessage('', 'No user specified: \'removeLast [user]', '', 'hashtext');
        return;
    }
    var user = params[1],
        removeIndex = -1,
        i;

    // Look for the user last added video
    for (i = unsafeWindow.playlist.length - 1; i >= 0; i -= 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            removeIndex = i;
            break;
        }
    }

    if (removeIndex === -1) {
        unsafeWindow.addMessage('', "The user didn't add any video", '', 'hashtext');
    } else {
        unsafeWindow.sendcmd('remove', {
            info: unsafeWindow.playlist[removeIndex].info
        });
    }
}

preConnectFunctions.push(loadRemoveLast);