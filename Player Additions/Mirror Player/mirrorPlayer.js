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
setField({
    'name': 'AutomaticPlayerMirror',
    'data': {
        'label': 'Automatic player mirror',
        'title': 'Mirros the player when the title contains something like [Mirrored]',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadMirrorPlayer() {
    commands.set('regularCommands', "mirrorPlayer", toggleMirrorPlayer, 'Mirrors the embedded player.');

    //appening the class until we got our css files
    //http://stackoverflow.com/a/3434665
    var oldPlayVideo = unsafeWindow.playVideo,
        indexOfVid,
        title;
    GM_addStyle('.mirror { ' +
        '-moz-transform: scaleX(-1); /* Gecko */ ' +
        '-o-transform: scaleX(-1); /* Operah */ ' +
        '-webkit-transform: scaleX(-1); /* webkit */ ' +
        'transform: scaleX(-1); /* standard */ ' +
        'filter: FlipH; /* IE 6/7/8 */' +
        '}');


    unsafeWindow.playVideo = function (vidinfo, time, playing) {
        indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
        title = unsafeWindow.playlist[indexOfVid].title;
        if (containsMirrored(title)) {
            if (!isPlayerMirrored) {
                toggleMirrorPlayer();
            }
        } else if (isPlayerMirrored) {
            toggleMirrorPlayer();
        }
        oldPlayVideo(vidinfo, time, playing);
    };

    //checking the current video after loading the first time
    if (unsafeWindow.playlist.length !== 0) {
        setTimeout(function () {
            if (unsafeWindow.playlist && unsafeWindow.playlist[getActiveVideoIndex()] && containsMirrored(unsafeWindow.playlist[getActiveVideoIndex()].title)) {
                toggleMirrorPlayer();
            }
        }, 2500);
    }
}

function containsMirrored(title) {
    if (!GM_config.get('AutomaticPlayerMirror')) {
        return false;
    }
    var found = false,
        words = [
            'mirrored',
            'mirror'
        ],
        i;
    for (i = 0; i < words.length; i += 1) {
        if (title.toLowerCase().indexOf(words[i]) !== -1) {
            found = true;
            break;
        }
    }
    return found;
}

var isPlayerMirrored = false;


function toggleMirrorPlayer() {
    $('#media > :first-child').toggleClass('mirror');
    isPlayerMirrored = !isPlayerMirrored;
}

postConnectFunctions.push(loadMirrorPlayer);