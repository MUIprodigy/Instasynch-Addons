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
        callback: function (id, user) {
            lastUser = user;
        }
    });
    unsafeWindow.console.log = function (message) {
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
        'callback': function (vidinfo, position, oldPosition) {
            if (Math.abs(getActiveVideoIndex() - position) <= 10 && Math.abs(oldPosition - position) > 10) { // "It's a bump ! " - Amiral Ackbar
                bumpCheck = true;
            }
        }
    });
}
var bumpCheck = false;

preConnectFunctions.push(loadModSpy);