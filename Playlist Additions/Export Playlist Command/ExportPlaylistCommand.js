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
function loadExportPlaylist() {
    commands.set('regularCommands', "exportPlaylist ", exportPlaylist, 'Exports the playlist to the clipboard. Optional Parameters: title duration addedby thumbnail all xml');
}


function exportPlaylist(params) {
    var rawOutput = '',
        xmlOutput = $('<playlist>'),
        videoxml = '',
        i = 0,
        options = 1,
        line = '',
        xml = false;

    for (i = 1; i < params.length; i += 1) {
        switch (params[i].toLowerCase()) {
        case 'title':
            options = options | 2;
            break;
        case 'duration':
            options = options | 4;
            break;
        case 'addedby':
            options = options | 8;
            break;
        case 'thumbnail':
            options = options | 16;
            break;
        case 'all':
            options = options | 31;
            break;
        case 'xml':
            xml = true;
            break;
        }
    }

    for (i = 0; i < unsafeWindow.playlist.length; i += 1) {
        line = '';
        videoxml = $('<video>');
        line += getUrlOfInfo(unsafeWindow.playlist[i].info);
        videoxml.append($('<url>').text(line));
        if ((options & 2) !== 0) { //title
            line += " " + unsafeWindow.playlist[i].title;
            videoxml.append($('<title>').text(unsafeWindow.playlist[i].title));
        }
        if ((options & 4) !== 0) { //duration
            line += " " + unsafeWindow.playlist[i].duration;
            videoxml.append($('<duration>').text(unsafeWindow.playlist[i].duration));
        }
        if ((options & 8) !== 0) { //addedby
            line += " " + unsafeWindow.playlist[i].addedby;
            videoxml.append($('<addedby>').text(unsafeWindow.playlist[i].addedby));
        }
        if ((options & 16) !== 0) { //thumbnail
            line += " " + unsafeWindow.playlist[i].info.thumbnail;
            videoxml.append($('<thumbnail>').text(unsafeWindow.playlist[i].info.thumbnail));
        }
        xmlOutput.append(videoxml);
        rawOutput += line + '\n';
    }
    if (xml) {
        rawOutput = $('<div>').append(xmlOutput.clone()).remove().html();
        //format the xml
        rawOutput = rawOutput.replace(/(<\/?video>)/g, '\n\t\$1');
        rawOutput = rawOutput.replace(/((<url>)|(<title>)|(<addedby>)|(<duration>)|(<thumbnail>))/g, '\n\t\t\$1');
        rawOutput = rawOutput.replace(/(<\/playlist>)/g, '\n\$1');
    }

    GM_setClipboard(rawOutput, 'text');
    unsafeWindow.addMessage('', 'Playlist has been copied to the clipboard', '', 'hashtext');
}

preConnectFunctions.push(loadExportPlaylist);
