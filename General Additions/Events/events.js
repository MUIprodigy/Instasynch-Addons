var events = new(function() {
    var listeners = {};

    this.bind = function(eventName, callback, preOld) {
        if (listeners[eventName] === undefined) {
            listeners[eventName] = [];
        }
        listeners[eventName].push({
            callback: callback,
            preOld: preOld | false
        });
    };
    this.unbind = function(eventName, callback) {
        var i;
        if (listeners[eventName] !== undefined) {
            for (i = 0; i < listeners[eventName].length; i += 1) {
                if (listeners[eventName][i].callback === callback) {
                    listeners[eventName].splice(i, 1);
                    i -= 1;
                }
            }
        }
    };
    this.fire = function(eventName, parameters, preOld) {
        var i;
        preOld = preOld | false;
        if (listeners[eventName] === undefined) {
            return;
        }
        for (i = 0; i < listeners[eventName].length; i += 1) {
            if (!(listeners[eventName][i].preOld ^ preOld)) {
                try {
                    listeners[eventName][i].callback.apply(this, parameters);
                } catch (err) {
                    logError(listeners[eventName][i].callback, err);
                }
            }
        }
    };
})(),
    currentPlayer = '',
    blacknamesCount = 0,
    greynamesCount = 0,
    modsCount = 0;

function loadEventsOnce() {
    var oldAddMessage = unsafeWindow.addMessage,
        oldCreatePoll = unsafeWindow.createPoll,
        oldAddVideo = unsafeWindow.addVideo,
        oldRequestPartialPage = unsafeWindow.global.requestPartialPage,
        oldPlayVideo = unsafeWindow.playVideo,
        oldMoveVideo = unsafeWindow.moveVideo,
        oldAddUser = unsafeWindow.addUser,
        oldRemoveUser = unsafeWindow.removeUser,
        oldSkips = unsafeWindow.skips,
        oldMakeLeader = unsafeWindow.makeLeader,
        oldLoadUserlist = unsafeWindow.loadUserlist,
        i,
        oldPoll = {
            title: ''
        };

    unsafeWindow.loadUserlist = function(userlist) {
        events.fire('onUserlist', [userlist], true);
        oldLoadUserlist(userlist);
        events.fire('onUserlist', [userlist], false);
    };

    unsafeWindow.global.requestPartialPage = function(name, room, back) {
        events.fire('onChangeRoom', [name, room, back], true);
        oldRequestPartialPage(name, room, back);
        events.fire('onChangeRoom', [name, room, back], false);
    };
    unsafeWindow.global.onConnecting = function() {
        events.fire('onConnecting', [], false);
    };
    unsafeWindow.global.onConnected = function() {
        events.fire('onConnect', [], false);
    };
    unsafeWindow.global.onReconnecting = function() {
        events.fire('onReconnecting', [], false);
    };
    unsafeWindow.global.onDisconnect = function() {
        events.fire('onDisconnect', [], false);
    };

    unsafeWindow.playVideo = function(vidinfo, time, playing) {
        if (currentPlayer !== vidinfo.provider) {
            events.fire('onPlayerChange', [currentPlayer, vidinfo.provider], true);
        }
        var indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
        events.fire('onPlayVideo', [vidinfo, time, playing, indexOfVid], true);
        oldPlayVideo(vidinfo, time, playing);
        if (currentPlayer !== vidinfo.provider) {
            events.fire('onPlayerChange', [currentPlayer, vidinfo.provider], false);
            switch (vidinfo.provider) {
                case 'youtube':
                    var oldAfterReady = $.tubeplayer.defaults.afterReady;
                    $.tubeplayer.defaults.afterReady = function(k3) {
                        events.fire('onPlayerReady', [currentPlayer, vidinfo.provider], false);
                        oldAfterReady(k3);
                    };
                    break;
                case 'vimeo':
                    $f($('#vimeo')[0]).addEvent('ready', function() {
                        events.fire('onPlayerReady', [currentPlayer, vidinfo.provider], false);
                    });
                    break;
            }
            currentPlayer = vidinfo.provider;
        }
        events.fire('onPlayVideo', [vidinfo, time, playing, indexOfVid], false);
    };

    unsafeWindow.moveVideo = function(vidinfo, position) {
        var oldPosition = unsafeWindow.getVideoIndex(vidinfo);
        events.fire('onMoveVideo', [vidinfo, position, oldPosition], true);
        oldMoveVideo(vidinfo, position);
        events.fire('onMoveVideo', [vidinfo, position, oldPosition], false);
    };

    function countUser(user, increment) {
        var val = increment ? 1 : -1;
        if (user.loggedin) {
            if (parseInt(user.permissions, 10) > 0) {
                modsCount += val;
            }
            blacknamesCount += val;
        } else {
            greynamesCount += val;
        }
    }
    if (isConnected) {
        for (i = 0; i < unsafeWindow.users.length; i += 1) {
            countUser(unsafeWindow.users[i], true);
        }
    }
    unsafeWindow.addUser = function(user, css, sort) {
        countUser(user, true);
        events.fire('onAddUser', [user, css, sort], true);
        oldAddUser(user, css, sort);
        events.fire('onAddUser', [user, css, sort], false);
    };

    unsafeWindow.removeUser = function(id) {
        var user = unsafeWindow.users[getIndexOfUser(id)];
        countUser(user, false);
        events.fire('onRemoveUser', [id, user], true);
        oldRemoveUser(id);
        events.fire('onRemoveUser', [id, user], false);
    };
    events.bind('onConnect', function() {
        modsCount = blacknamesCount = greynamesCount = 0;
        $('#tablePlaylistBody').empty();
    });
    unsafeWindow.skips = function(skips, skipsNeeded) {
        events.fire('onSkips', [skips, skipsNeeded], true);
        oldSkips(skips, skipsNeeded);
        events.fire('onSkips', [skips, skipsNeeded], false);
    };
    unsafeWindow.makeLeader = function(userId) {
        events.fire('onMakeLeader', [userId], true);
        oldMakeLeader(userId);
        events.fire('onMakeLeader', [userId], false);
    };

    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        events.fire('onAddMessage', [username, message, userstyle, textstyle], true);
        oldAddMessage(username, message, userstyle, textstyle);
        events.fire('onAddMessage', [username, message, userstyle, textstyle], false);
    };

    function pollEquals(oldPoll, newPoll) {
        if (oldPoll.title === newPoll.title && oldPoll.options.length === newPoll.options.length) {
            for (i = 0; i < newPoll.options.length; i += 1) {
                if (oldPoll.options[i].option !== newPoll.options[i].option) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    unsafeWindow.createPoll = function(poll) {
        if (!pollEquals(oldPoll, poll)) {
            events.fire('onCreatePoll', [poll], true);
        }
        oldCreatePoll(poll);
        if (!pollEquals(oldPoll, poll)) {
            events.fire('onCreatePoll', [poll], false);
        }
        oldPoll = poll;
    };

    unsafeWindow.addVideo = function(vidinfo) {
        events.fire('onAddVideo', [vidinfo], true);
        oldAddVideo(vidinfo);
        events.fire('onAddVideo', [vidinfo], false);
    };
}

function loadEvents() {
    var oldPlayerDestroy = unsafeWindow.video.destroyPlayer;

    unsafeWindow.video.destroyPlayer = function() {
        events.fire('onPlayerDestroy', [], true);
        oldPlayerDestroy();
        events.fire('onPlayerDestroy', [], false);
        currentPlayer = '';
    };

    $("#chat input").bindFirst('keypress', function(event) {
        events.fire('onInputKeypress', [event, $("#chat input").val()], false);
    });
}

resetVariables.push(function() {
    currentPlayer = '';
    blacknamesCount = 0;
    greynamesCount = 0;
    modsCount = 0;
});