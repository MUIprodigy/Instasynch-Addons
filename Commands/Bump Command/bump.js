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
