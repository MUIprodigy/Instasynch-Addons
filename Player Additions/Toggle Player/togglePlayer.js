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
    'name': 'PlayerActive',
    'data': {
        'label': 'Videoplayer active',
        'title': '\'togglePlayer command',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadTogglePlayer() {
    //add the command
    commands.set('regularCommands', "togglePlayer", function () {
        togglePlayer();
        toggleSetting();
    }, 'Turns the embedded player on and off.');

    onSettingsOpen.push(function () {
        oldPlayerActive = GM_config.get('PlayerActive');
    });

    onSettingsSave.push(function () {
        if (oldPlayerActive !== GM_config.get('PlayerActive')) {
            togglePlayer();
            oldPlayerActive = GM_config.get('PlayerActive');
        }
    });
    //toggle the player once if the stored setting was false
    if (!GM_config.get('PlayerActive')) {
        setTimeout(unsafeWindow.video.destroyPlayer, 1500);
    }

    var oldPlayVideo = unsafeWindow.playVideo;
    unsafeWindow.playVideo = function (vidinfo, time, playing) {
        if (GM_config.get('PlayerActive')) {
            oldPlayVideo(vidinfo, time, playing);
        } else {
            var indexOfVid = unsafeWindow.getVideoIndex(vidinfo),
                addedby = unsafeWindow.playlist[indexOfVid].addedby,
                title = trimTitle(unsafeWindow.playlist[indexOfVid].title, 240);
            if (indexOfVid > -1) {
                $('.active').removeClass('active');
                if (GM_config.get('BigPlaylist')) {
                    $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                    $('#slider').slider('option', 'max', unsafeWindow.playlist[indexOfVid].duration);
                    $('#sliderDuration').html('/' + unsafeWindow.secondsToTime(unsafeWindow.playlist[indexOfVid].duration));
                } else {
                    $($('#ulPlay').children('li')[indexOfVid]).addClass('active');
                }
                $('#vidTitle').html(String.format('{0}<div class=\'via\'> via {1}</div>', title, addedby));
            }
        }
    };
}
var oldPlayerActive;

function togglePlayer() {
    if (!GM_config.get('PlayerActive')) {
        unsafeWindow.video.destroyPlayer();
    } else {
        unsafeWindow.sendcmd('reload', null);
    }
}

function toggleSetting() {
    GM_config.set('PlayerActive', !GM_config.get('PlayerActive'));
    GM_config.save();
}

var playerActive = true;

postConnectFunctions.push(loadTogglePlayer);