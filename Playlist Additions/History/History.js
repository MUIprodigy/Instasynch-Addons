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

function loadHistory(){
    commands.set('regularCommands',"history",printHistory);
	var oldPlayVideo = unsafeWindow.playVideo;
	unsafeWindow.playVideo = function(vidinfo, time, playing) {
		oldPlayVideo(vidinfo,time,playing);
		//Keep the last 9 videos
		if (history.length === 9){
			history.shift();	
		}
		history.push([vidinfo,unsafeWindow.playlist[unsafeWindow.getVideoIndex(vidinfo)].title]);
	};
}

function printHistory(){
	closeResults();
	var output = "Last ten videos played : \n",
		html = [],
		thumbnail,
		link;
		
	for (i=0; i<history.length; i++){
	
		switch(history[i][0].provider){
            case 'youtube': link = 'http://www.youtube.com/watch?v=' + history[i][0].id ;break;
            case 'vimeo': link = 'http://vimeo.com/' + history[i][0].id ;break;
            default: continue;
        }
		
		thumbnail = "<img style='height:90px;width:120px' src='" + history[i][0].thumbnail + "'>";
		
		html.push("<div onmouseover='showTitle(this)' onmouseout='hideTitle(this)'><div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px;z-index:2;cursor:pointer;'  onClick='openInNewTab(\""+link+"\")'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + history[i][1] +  "</span></div></div>");		
	}
	$(html.join('')).appendTo("#searchResults");
	
	divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
	divresults.style.display = "block";
	divremove.style.display = "block";
}

// closes the results and empties it
function closeResults(){
    $("#searchResults").empty();
    divresults.style.display = "none";
    divremove.style.display = "none";
}
				
var history = [];
preConnectFunctions.push(loadHistory);

