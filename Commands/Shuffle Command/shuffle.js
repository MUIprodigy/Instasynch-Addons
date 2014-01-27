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
function loadShuffleCommand() {
    commands.set('modCommands', "shuffle ", shuffle, 'Shuffles the playlist or a wall of a user (prepare for spam combined with ModSpy). Possible parameters: the user');
}

function shuffle(params) {
    var user = params[1],
        i,
        shuffleList = [],
        tempInfo,
        randIndex,
        newPosition;

    for (i = getActiveVideoIndex() + 1; i < unsafeWindow.playlist.length; i += 1) {
        if (!user || unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            shuffleList.push({
                i: i,
                info: unsafeWindow.playlist[i].info
            });
        }
    }
    for (i = 0; i < shuffleList.length; i += 1) {
        randIndex = Math.floor(Math.random() * shuffleList.length);
        tempInfo = shuffleList[i].info;
        newPosition = shuffleList[randIndex].i;
        unsafeWindow.sendcmd('move', {
            info: tempInfo,
            position: newPosition
        });
    }
}

preConnectFunctions.push(loadShuffleCommand);
