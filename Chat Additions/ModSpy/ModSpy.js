setField({
    'name': 'ModSpy',
    'data': {
        'label': 'ModSpy (mod actions will be shown in the chat)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadModSpy() {
    // Overwriting console.log
    var oldLog = unsafeWindow.console.log,
        filterList = [
            /^Resynch requested\.\./,
            /cleaned the playlist/,
            /Using HTML5 player is not recomended\./
        ],
        filter,
        i,
        lastUser;
    onRemoveUser.push({
        callback: function(id, user) {
            lastUser = user;
        }
    });
    unsafeWindow.console.log = function(message) {
        // We don't want the cleaning messages in the chat (Ok in the console) .
        if (GM_config.get('ModSpy') && message && message.match) {
            filter = false;
            for (i = 0; i < filterList.length; i += 1) {
                if (message.match(filterList[i])) {
                    filter = true;
                    break;
                }
            }
            if (!filter) {
                if (message.match(/ moved a video/g) && bumpCheck) {
                    message = message.replace("moved", "bumped");
                    bumpCheck = false;
                } else if (message.match(/has (banned)|(kicked) a user\./)) {
                    message = message.replace(/a user/, lastUser.username);
                }
                unsafeWindow.addMessage('', message, '', 'hashtext');
            }
        }
        oldLog.apply(unsafeWindow.console, arguments);
    };
    onMoveVideo.push({
        'callback': function(vidinfo, position, oldPosition) {
            if (Math.abs(getActiveVideoIndex() - position) <= 10 && Math.abs(oldPosition - position) > 10) { // "It's a bump ! " - Amiral Ackbar
                bumpCheck = true;
            }
        }
    });
}
var bumpCheck = false;
resetVariables.push(function() {
    bumpCheck = false;
});
executeOnceFunctions.push(loadModSpy);