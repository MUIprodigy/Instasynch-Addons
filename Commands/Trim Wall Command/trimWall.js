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
function loadTrimWallCommand() {
    commands.set('modCommands', "trimWall ", trimWall, 'Trims a wall of a user to the timelimit with 1 hour as standard timelimit. Possible parameters: timelimit in minutes.');
}

function trimWall(params) {
    if (!params[1]) {
        unsafeWindow.addMessage('', 'No user specified: \'trimWall [user] [maxMinutes]', '', 'hashtext');
        return;
    }
    resetWallCounter();
    var user = params[1],
        maxTimeLimit = params[2] ? parseInt(params[2], 10) * 60 : 60 * 60,
        currentTime = wallCounter[user],
        videos = [],
        i;

    if (currentTime < maxTimeLimit) {
        unsafeWindow.addMessage('', 'The wall is smaller than the timelimit', '', 'hashtext');
        return;
    }
    //get all Videos for the user
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()) {
            videos.push({
                info: unsafeWindow.playlist[i].info,
                duration: unsafeWindow.playlist[i].duration
            });
        }
    }

    function compareVideos(a, b) {
        return b.duration - a.duration;
    }
    // function rmVideo(index, vidinfo){
    //     setTimeout(
    //         function(){
    //             sendcmd('remove', {info: vidinfo});
    //         }, 
    //         (index+1) * 750);
    // }
    //sort the array so we will get the longest first
    videos.sort(compareVideos);

    for (i = 0; i < videos.length && currentTime > maxTimeLimit; i += 1) {
        currentTime -= videos[i].duration;
        // rmVideo(i,videos[i].info);
        //delay via commandFloodProtect.js
        unsafeWindow.sendcmd('remove', {
            info: videos[i].info
        });
    }
}

preConnectFunctions.push(loadTrimWallCommand);
