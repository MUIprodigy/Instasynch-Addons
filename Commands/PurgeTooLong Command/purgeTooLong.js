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
function loadPurgeTooLongCommand() {
    commands.set('modCommands', "purgeTooLong ", purgeTooLong, 'Removes all videos over the timelimit with 1 hour as the standard timelimit. Parameters: timelimit in minutes.');
}

function purgeTooLong(params) {
    var maxTimeLimit = params[1] ? parseInt(params[1], 10) * 60 : 60 * 60,
        videos = [],
        i;

    //get all Videos longer than maxTimeLimit
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].duration >= maxTimeLimit) {
            videos.push({
                info: unsafeWindow.playlist[i].info,
                duration: unsafeWindow.playlist[i].duration
            });
        }
    }

    function compareVideos(a, b) {
        return b.duration - a.duration;
    }
    videos.sort(compareVideos);

    for (i = 0; i < videos.length; i += 1) {
        unsafeWindow.sendcmd('remove', {
            info: videos[i].info
        });
    }
}

preConnectFunctions.push(loadPurgeTooLongCommand);