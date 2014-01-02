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

function loadExportPlaylist(){
    commands.set('regularCommands',"exportPlaylist",exportPlaylist);
}


function exportPlaylist(){
    var output='',
        i;

    for (i = 0; i < unsafeWindow.playlist.length; i++) {
        switch(unsafeWindow.playlist[i].info.provider){
            case 'youtube': output+='http://youtu.be/';break;
            case 'vimeo':output+='http://vimeo.com/';break;
            default: continue;
        }
        output += unsafeWindow.playlist[i].info.id+'\n ';
    }
    unsafeWindow.prompt ("Copy to clipboard: Ctrl+C, Enter", output);
}
preConnectFunctions.push(loadExportPlaylist);
