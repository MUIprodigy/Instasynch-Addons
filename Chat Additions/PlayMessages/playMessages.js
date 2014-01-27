/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  fugXD, Bibbytube

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

setField({
    'name': 'PlayMessages',
    'data': {
        'label': 'PlayMessages',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadPlayMessages() {
    onPlayVideo.push({
        callback: function (vidinfo, time, playing, indexOfVid) {
            if (GM_config.get('PlayMessages')) {
                unsafeWindow.addMessage('', 'Now playing: ' + trimTitle(unsafeWindow.playlist[indexOfVid].title, 240), '', 'hashtext');
            }
        }
    });
}

postConnectFunctions.push(loadPlayMessages);
