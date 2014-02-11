/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  Bibbytube

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/

function loadEvents() {
    var oldPlayVideo = unsafeWindow.playVideo,
        oldMoveVideo = unsafeWindow.moveVideo,
        oldAddUser = unsafeWindow.addUser,
        oldRemoveUser = unsafeWindow.removeUser,
        oldPlayerDestroy = unsafeWindow.video.destroyPlayer,
        oldSkips = unsafeWindow.skips;
    unsafeWindow.playVideo = function (vidinfo, time, playing) {
        if (currentPlayer !== vidinfo.provider) {
            fireEvents(onPlayerChange, [currentPlayer, vidinfo.provider], true);
        }
        var indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
        fireEvents(onPlayVideo, [vidinfo, time, playing, indexOfVid], true);
        oldPlayVideo(vidinfo, time, playing);
        if (currentPlayer !== vidinfo.provider) {
            fireEvents(onPlayerChange, [currentPlayer, vidinfo.provider], false);
            switch (vidinfo.provider) {
            case 'youtube':
                var oldAfterReady = $.tubeplayer.defaults.afterReady;
                $.tubeplayer.defaults.afterReady = function (k3) {
                    fireEvents(onPlayerReady, [currentPlayer, vidinfo.provider], false);
                    oldAfterReady(k3);
                };
                break;
            case 'vimeo':
                $f($('#vimeo')[0]).addEvent('ready', function () {
                    fireEvents(onPlayerReady, [currentPlayer, vidinfo.provider], false);
                });
                break;
            }
            currentPlayer = vidinfo.provider;
        }
        fireEvents(onPlayVideo, [vidinfo, time, playing, indexOfVid], false);
    };

    unsafeWindow.moveVideo = function (vidinfo, position) {
        var oldPosition = unsafeWindow.getVideoIndex(vidinfo);
        fireEvents(onMoveVideo, [vidinfo, position, oldPosition], true);
        oldMoveVideo(vidinfo, position);
        fireEvents(onMoveVideo, [vidinfo, position, oldPosition], false);
    };

    function countUser(user, increment) {
        var val = (increment) ? 1 : -1;
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
        for (var i = 0; i < unsafeWindow.users.length; i++) {
            countUser(unsafeWindow.users[i], true);
        }
    }
    unsafeWindow.addUser = function (user, css, sort) {
        countUser(user, true);
        fireEvents(onAddUser, [user, css, sort], true);
        oldAddUser(user, css, sort);
        fireEvents(onAddUser, [user, css, sort], false);
    };

    unsafeWindow.removeUser = function (id) {
        var user = unsafeWindow.users[getIndexOfUser(id)];
        countUser(user, false);
        fireEvents(onRemoveUser, [id, user], true);
        oldRemoveUser(id);
        fireEvents(onRemoveUser, [id, user], false);
    };
    onConnect.push({
        callback: function () {
            modsCount = blacknamesCount = greynamesCount = 0;
            $('#tablePlaylistBody').empty();
        }
    });
    unsafeWindow.video.destroyPlayer = function () {
        fireEvents(onPlayerDestroy, [], true);
        oldPlayerDestroy();
        fireEvents(onPlayerDestroy, [], false);
        currentPlayer = '';
    };
    unsafeWindow.skips = function (skips, skipsNeeded) {
        fireEvents(onSkips, [skips, skipsNeeded], true);
        oldSkips(skips, skipsNeeded);
        fireEvents(onSkips, [skips, skipsNeeded], false);
    };
}

function loadPriorityEvents() {
    var oldAddMessage = unsafeWindow.addMessage,
        oldCreatePoll = unsafeWindow.createPoll;

    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        fireEvents(onAddMessage, [username, message, userstyle, textstyle], true);
        oldAddMessage(username, message, userstyle, textstyle);
        fireEvents(onAddMessage, [username, message, userstyle, textstyle], false);

        if (username === '') {
            if (userstyle === '' && textstyle === 'hashtext') {
                if (message === 'Connecting..') {
                    fireEvents(onConnecting, [], false);
                } else if (message === 'Connection Successful!') {
                    fireEvents(onConnect, [], false);
                }
            } else if (userstyle === 'system-msg') {
                if (message === 'Reconnecting...') {
                    fireEvents(onReconnecting, [], false);
                }
            }
        }
    };
    unsafeWindow.createPoll = function (poll) {
        fireEvents(onCreatePoll, [poll], true);
        oldCreatePoll(poll);
        fireEvents(onCreatePoll, [poll], false);
    };
}

function fireEvents(listeners, parameters, preOld) {
    var i;
    for (i = 0; i < listeners.length; i += 1) {
        //listeners[i].preOld = listeners[i].preOld || false;
        if (!(listeners[i].preOld ^ preOld)) {
            try {
                listeners[i].callback.apply(this, parameters);
            } catch (err) {
                logError(listeners[i].callback.name, err);
            }
        }
    }
}

var currentPlayer = '',
    blacknamesCount = 0,
    greynamesCount = 0,
    modsCount = 0,
    onMoveVideo = [],
    onPlayerChange = [],
    onPlayVideo = [],
    onAddMessage = [],
    onPlayerReady = [],
    onRemoveUser = [],
    onAddUser = [],
    onCreatePoll = [],
    onPlayerDestroy = [],
    onSkips = [],
    onConnecting = [],
    onConnect = [],
    onReconnecting = [];