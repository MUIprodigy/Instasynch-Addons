/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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
        oldRemoveUser = unsafeWindow.removeUser;

    unsafeWindow.playVideo = function (vidinfo, time, playing) {
        var indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
        fireEvents(onPlayVideo, [vidinfo, time, playing, indexOfVid], true);
        oldPlayVideo(vidinfo, time, playing);
        fireEvents(onPlayVideo, [vidinfo, time, playing, indexOfVid], false);
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
    };

    unsafeWindow.moveVideo = function (vidinfo, position) {
        var oldPosition = unsafeWindow.getVideoIndex(vidinfo);
        fireEvents(onMoveVideo, [vidinfo, position, oldPosition], true);
        oldMoveVideo(vidinfo, position);
        fireEvents(onMoveVideo, [vidinfo, position, oldPosition], false);
    };


    unsafeWindow.addUser = function (user, css, sort) {
        fireEvents(onAddUser, [user, css, sort], true);
        oldAddUser(user, css, sort);
        fireEvents(onAddUser, [user, css, sort], false);
    };

    unsafeWindow.removeUser = function (id) {
        var user = unsafeWindow.users[getIndexOfUser(id)];
        fireEvents(onRemoveUser, [id, user], true);
        oldRemoveUser(id);
        fireEvents(onRemoveUser, [id, user], false);
    };


}

function loadPriorityEvents() {
    var oldAddMessage = unsafeWindow.addMessage,
        oldCreatePoll = unsafeWindow.createPoll;

    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        fireEvents(onAddMessage, [username, message, userstyle, textstyle], true);
        oldAddMessage(username, message, userstyle, textstyle);
        fireEvents(onAddMessage, [username, message, userstyle, textstyle], false);
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
    onMoveVideo = [],
    onPlayerChange = [],
    onPlayVideo = [],
    onAddMessage = [],
    onPlayerReady = [],
    onRemoveUser = [],
    onAddUser = [],
    onCreatePoll = [];