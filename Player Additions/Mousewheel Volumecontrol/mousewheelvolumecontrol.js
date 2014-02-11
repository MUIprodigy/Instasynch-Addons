/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  Bibbytube
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
    'section': 'Player Additions',
    'subsection': 'Volume'
});

setField({
    'name': 'Volumebar',
    'data': {
        'label': 'Volume bar when changing volume',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions',
    'subsection': 'Volume'
});

function loadMouseWheelVolumecontrol() {
    var firefoxBlur = 'url("data:image/svg+xml;utf8,'.concat(
        '<svg xmlns=\'http://www.w3.org/2000/svg\'>',
        '<filter id=\'autocall\' x=\'-300%\' width=\'500%\'>',
        '<feGaussianBlur stdDeviation=\'5\'/>',
        '</filter>',
        '</svg>#autocall")');
    $('<div>', {
        'id': 'volumebarContainer'
    }).append(
        $('<div>', {
            'id': 'volumebar'
        }).css('height', '0px').css('width', '5px').css('position', 'absolute').css('left', '-8px')
        .css('background-color', 'lime').addClass('blur5').css('display', 'none').css('filter', firefoxBlur)
    ).css('float', 'left').css('width', '0px').css('position', 'relative').insertBefore('#media');

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

    //message origin = http: //www.youtube.com, data={"event":"infoDelivery","info":{"muted":false,"volume":0},"id":1}
    //listen to volume change on the youtube player
    unsafeWindow.addEventListener("message",
        function (event) {
            try {
                var parsed = JSON.parse(event.data);
                if (parsed.event && parsed.event === 'infoDelivery' && parsed.info && parsed.info.volume) {
                    setGlobalVolume(parsed.info.volume);
                }
            } catch (ignore) {}
        }, false);

    onPlayerReady.push({
        'callback': function (oldPlayer, newPlayer) {
            if (vimeoVolumePollingIntervalId) {
                clearInterval(vimeoVolumePollingIntervalId);
                vimeoVolumePollingIntervalId = undefined;
            }
            initGlobalVolume();
            switch (newPlayer) {
            case 'vimeo':
                //since I didn't find a way to listen to volume change on the vimeo player we have to use polling here
                vimeoVolumePollingIntervalId = setInterval(function () {
                    $f($('#vimeo')[0]).api('getVolume', function (vol) {
                        setGlobalVolume(vol * 100.0);
                    });
                }, 500);
                break;
            }
        }
    });
}

var isPlayerReady = false,
    globalVolume = 50,
    oldGlobalVolume = 50,
    mouserOverPlayer = false,
    vimeoVolumePollingIntervalId = undefined,
    previousVolumeScrollTime = new Date().getTime(), // used to measure speed of scrolling
    volumebarFadeoutTimeout;

function setGlobalVolume(val) {
    oldGlobalVolume = globalVolume;
    globalVolume = val;
    if (oldGlobalVolume !== globalVolume) {
        displayVolumebar();
    }
}

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

function setUpVolumebarTimeout() {
    if (volumebarFadeoutTimeout) {
        clearTimeout(volumebarFadeoutTimeout);
    }
    volumebarFadeoutTimeout = setTimeout(function () {
        $('#volumebar').fadeOut("slow", function () {
            $('#volumebar').css('display', 'initial');
            $('#volumebar').css('display', 'none');
        });
    }, 500);
}

function displayVolumebar() {
    if (GM_config.get('Volumebar')) {
        $('#volumebar').stop();
        $('#volumebar').css('top', playerHeight - (globalVolume / 100) * playerHeight).css('height', (globalVolume / 100) * playerHeight).css('opacity', '1').css('display', 'initial');
        setUpVolumebarTimeout();
    }
}
// Set volume to specific value, argument is number 0-100
function setVol(volume) {
    // clamp input value
    volume = Math.max(0, volume);
    volume = Math.min(100, volume);
    setGlobalVolume(volume);

    if (currentPlayer === 'youtube') {
        $('#media').tubeplayer('volume', Math.round(volume));
    } else if (currentPlayer === 'vimeo') {
        $f($('#vimeo')[0]).api('setVolume', volume / 100.0);
    }
}

preConnectFunctions.push(loadMouseWheelVolumecontrol);