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
        match;
    events.bind('onRemoveUser', function(id, user) {
        if (lastAction) {
            unsafeWindow.addMessage('', String.format('{0} has {1} {2}', actiontaker, lastAction, user.username), '', 'hashtext');
            lastAction = undefined;
            actiontaker = undefined;
        }
    });
    events.bind('onMoveVideo', function(vidinfo, position, oldPosition) {
        if (Math.abs(getActiveVideoIndex() - position) <= 10 && Math.abs(oldPosition - position) > 10) { // "It's a bump ! " - Amiral Ackbar
            bumpCheck = true;
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
                } else if ((match = message.match(/([^\s]+) has banned a user\./))) {
                    lastAction = 'banned';
                    actiontaker = match[1];
                } else if ((match = message.match(/([^\s]+) has kicked a user\./))) {
                    lastAction = 'kicked';
                    actiontaker = match[1];
                }
                if (!lastAction) {
                    unsafeWindow.addMessage('', message, '', 'hashtext');
                }
            }
        }
        oldLog.apply(unsafeWindow.console, arguments);
    };
}
var bumpCheck = false,
    lastAction,
    actiontaker;
events.bind('onResetVariables', function() {
    bumpCheck = false;
});
events.bind('onExecuteOnce', loadModSpy);