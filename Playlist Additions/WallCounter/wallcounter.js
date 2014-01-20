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
function loadWallCounter() {

    var oldAddVideo = unsafeWindow.addVideo,
        //oldRemoveVideo = removeVideo,
        oldAddMessage = unsafeWindow.addMessage,
        value,
        output;

    //add commands
    commands.set('regularCommands', "printWallCounter", printWallCounter, 'Prints the length of the walls for each user.');
    commands.set('regularCommands', "printMyWallCounter", printMyWallCounter, 'Prints the length of your own wall.');


    //overwrite InstaSynch's addVideo
    unsafeWindow.addVideo = function (vidinfo) {
        resetWallCounter();
        value = wallCounter[vidinfo.addedby];
        if (isBibbyRoom() && value >= 3600 && vidinfo.addedby === thisUsername) {
            output = String.format('Watch out {0} ! You\'re being a faggot by adding more than 1 hour of videos !', thisUsername);
            unsafeWindow.addMessage('', output, '', 'hashtext');
        }
        oldAddVideo(vidinfo);
    };

    /*
     * Commented since this shit isnt working and I have no idea why
     */
    // //overwrite InstaSynch's removeVideo
    // unsafeWindow.removeVideo = function(vidinfo){
    //     var indexOfVid = getVideoIndex(vidinfo);
    //     video = unsafeWindow.playlist[indexOfVid];
    //     value = wallCounter[video.addedby];
    //     value -= video.duration;

    //     if(value > 0){
    //         wallCounter[video.addedby] = value;
    //     }else{
    //         delete wallCounter[video.addedby];
    //     }

    //     oldRemoveVideo(vidinfo);
    // };    

    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        if (username === '' && message === 'Video added successfully.') {
            resetWallCounter();
            message += String.format('WallCounter: [{0}]', unsafeWindow.secondsToTime(wallCounter[thisUsername]));
        }
        oldAddMessage(username, message, userstyle, textstyle);
    };

    //init the wallcounter
    resetWallCounter();
}
var wallCounter = {};

function resetWallCounter() {
    var video,
        value,
        i;
    wallCounter = {};
    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        video = unsafeWindow.playlist[i];
        value = wallCounter[video.addedby];
        value = (value || 0) + video.duration;
        wallCounter[video.addedby] = value;
    }
}

function printWallCounter() {
    resetWallCounter();
    var output = "",
        key,
        strTemp;
    for (key in wallCounter) {
        if (wallCounter.hasOwnProperty(key)) {
            strTemp = '[{0}: {1}]';
            if (wallCounter[key] > 3600) {
                strTemp = "<span style='color:red'>" + strTemp + "</span>";
            }
            output += String.format(strTemp, key, unsafeWindow.secondsToTime(wallCounter[key]));
        }
    }
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

function printMyWallCounter() {
    resetWallCounter();
    var output = "",
        timeToWall = 0,
        i;
    for (i = getActiveVideoIndex(); i < unsafeWindow.playlist.length; i += 1) {
        if (unsafeWindow.playlist[i].addedby.toLowerCase() === thisUsername.toLowerCase()) {
            break;
        } else {
            timeToWall += unsafeWindow.playlist[i].duration;
        }
    }
    output = String.format('[{0}: {1}], {2} till your videos play.', thisUsername, unsafeWindow.secondsToTime(wallCounter[thisUsername] || 0), unsafeWindow.secondsToTime(timeToWall));
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

postConnectFunctions.push(loadWallCounter);