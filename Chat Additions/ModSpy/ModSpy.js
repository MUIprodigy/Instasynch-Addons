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

function loadModSpy(){
	//load settings
	modSpy = settings.get('ModSpy',false);
	
	//add command
    commands.set('addOnSettings',"ModSpy",toggleModSpy);

	// Overwriting console.log
	var oldLog = console.log, 
		oldMoveVideo = unsafeWindow.moveVideo,
		filterList = [
			/^Resynch requested\.\./,
			/cleaned the playlist/,
			/Using HTML5 player is not recomended\./
		],
		filter,
		i;

	console.log = function (message) {
		// We don't want the cleaning messages in the chat (Ok in the console) .
		if (modSpy && message && message.match)
		{
			filter = false;
			for (i = 0; i < filterList.length; i++) {
				if(message.match(filterList[i])){
					filter = true;
					break;
				}
			}
			if(!filter){
				if (message.match(/ moved a video/g) && bumpCheck)
				{
					message = message.replace("moved","bumped");
					bumpCheck = false;
				}
				unsafeWindow.addMessage('', message, '','hashtext');   
			}
		}
		oldLog.apply(console,arguments);
	};

	// Overwriting moveVideo to differentiate bump and move
	unsafeWindow.moveVideo = function(vidinfo, position) {
		var oldPosition = unsafeWindow.getVideoIndex(vidinfo);
		oldMoveVideo(vidinfo,position);
		
		if ( Math.abs(getActiveVideoIndex()-position) <= 10 && Math.abs(oldPosition-position) > 10){ // "It's a bump ! " - Amiral Ackbar
			bumpCheck = true;
		}
	};

}	
function toggleModSpy(){
	modSpy = !modSpy; 
	settings.set('ModSpy',modSpy);
}
var modSpy = false,
	bumpCheck = false;

preConnectFunctions.push(loadModSpy);
