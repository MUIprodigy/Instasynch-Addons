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

function loadShuffleCommand(){
    commands.set('modCommands',"shuffle ",shuffle);
}

function shuffle(params){
    var user = params[1],
        i,
        shuffleList = [];
    for (i = getActiveVideoIndex()+1; i<unsafeWindow.playlist.length; i++) {
        if(!user || unsafeWindow.playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            shuffleList.push({i: i, info: unsafeWindow.playlist[i].info});
        }
    }
    var tempInfo,randIndex,newPosition;
    for(i = 0; i< shuffleList.length;i++){
        randIndex = Math.floor(Math.random()*shuffleList.length);
        tempInfo = shuffleList[i].info;
        newPosition = shuffleList[randIndex].i;
        unsafeWindow.sendcmd('move', {info: tempInfo, position: newPosition});
    }
}


preConnectFunctions.push(loadShuffleCommand);
