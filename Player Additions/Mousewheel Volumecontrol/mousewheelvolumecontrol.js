/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube
    Copyright (C) 2014  fugXD, filtering duplicate events, scroll speed dependent volume adjustments

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
    'name': 'MouseWheelVolumecontrol',
    'data': {
        'label': 'Mousewheel volume control of the player (no ff atm)',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadMouseWheelVolumecontrol() {
    //TODO: find firefox fix, mousescroll event doesnt fire while over youtube player

    //prevent the site from scrolling while over the player
    function preventScroll(event) {
        if (GM_config.get('MouseWheelVolumecontrol') && mouserOverPlayer) {
            event.preventDefault();
            event.returnValue = !mouserOverPlayer;

            var currentVolumeScrollTime = new Date().getTime(),
                scrollDirection = (1.0 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY))); // -1 or 1 depending on direction, *1.0 forces float div

            if ((currentVolumeScrollTime - previousVolumeScrollTime) > 200) { // 'slow' scrolling
                adjustVolume(scrollDirection);
            } else if ((currentVolumeScrollTime - previousVolumeScrollTime) >= 10) {
                adjustVolume(6.66 * scrollDirection); // faster scrolling
            }
            previousVolumeScrollTime = currentVolumeScrollTime;
        }
    }
    unsafeWindow.onmousewheel = document.onmousewheel = preventScroll;
    if (unsafeWindow.addEventListener) {
        unsafeWindow.addEventListener('DOMMouseScroll', preventScroll, false);
    }
    //add hover event to the player
    $('#media').hover(
        function () {
            mouserOverPlayer = true;
        },
        function () {
            mouserOverPlayer = false;
        }
    );

    var oldPlayVideo = unsafeWindow.playVideo;
    //message origin = http: //www.youtube.com, data={"event":"infoDelivery","info":{"muted":false,"volume":0},"id":1}
    //listen to volume change on the youtube player
    unsafeWindow.addEventListener("message",
        function (event) {
            try {
                var parsed = JSON.parse(event.data);
                if (parsed.event && parsed.event === 'infoDelivery' && parsed.info && parsed.info.volume) {
                    globalVolume = parsed.info.volume;
                }
            } catch (ignore) {}
        }, false);
    onPlayerChange.push(function (oldPlayer, newPlayer) {
        if (vimeoVolumePollingIntervalId) {
            clearInterval(vimeoVolumePollingIntervalId);
            vimeoVolumePollingIntervalId = undefined;
        }
        switch (newPlayer) {
        case 'youtube':
            var oldAfterReady = $.tubeplayer.defaults.afterReady;
            $.tubeplayer.defaults.afterReady = function (k3) {
                initGlobalVolume();
                oldAfterReady(k3);
            };
            break;
        case 'vimeo':
            $f($('#vimeo')[0]).addEvent('ready', initGlobalVolume);
            //since I didn't find a way to listen to volume change on the vimeo player we have to use polling here
            vimeoVolumePollingIntervalId = setInterval(function () {
                $f($('#vimeo')[0]).api('getVolume', function (vol) {
                    globalVolume = (vol * 100.0);
                });
            }, 1000);
            break;
        }
    });
}

var isPlayerReady = false,
    globalVolume = 50,
    mouserOverPlayer = false,
    vimeoVolumePollingIntervalId = undefined,
    previousVolumeScrollTime = new Date().getTime(); // used to measure speed of scrolling


function initGlobalVolume() {
    if (isPlayerReady) {
        setVol(globalVolume);
    } else {
        if (currentPlayer === 'youtube') {
            setVol($('#media').tubeplayer('volume'));
        } else if (currentPlayer === 'vimeo') {
            $f($('#vimeo')[0]).api('getVolume', function (vol) {
                setVol(vol * 100.0);
            });
        }
        isPlayerReady = true;
    }
}

// Increments or decrements the volume. This is to keep other code from having to know about globalVolume. Argument is desired change in volume.
function adjustVolume(deltaVolume) {
    setVol(globalVolume + deltaVolume);
}

// Set volume to specific value, argument is number 0-100
function setVol(volume) {
    // clamp input value
    volume = Math.max(0, volume);
    volume = Math.min(100, volume);
    globalVolume = volume;
    if (currentPlayer === 'youtube') {
        $('#media').tubeplayer('volume', Math.round(volume));
    } else if (currentPlayer === 'vimeo') {
        $f($('#vimeo')[0]).api('setVolume', volume / 100.0);
    }
}

preConnectFunctions.push(loadMouseWheelVolumecontrol);