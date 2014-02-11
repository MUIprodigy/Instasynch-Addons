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
setField({
    'name': 'ProgressBar',
    'data': {
        'label': 'Progress Bar above the Player',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadProgressBar() {
    var maxTime = 0,
        progressbarInterval,
        //copyright 2013, NeoLexx Fair License; http://opensource.org/licenses/Fair
        //http://userscripts.org/scripts/review/158749
        firefoxBlur = 'url("data:image/svg+xml;utf8,'.concat(
            '<svg xmlns=\'http://www.w3.org/2000/svg\'>',
            '<filter id=\'autocall\' y=\'-100%\' height=\'300%\'>',
            '<feGaussianBlur stdDeviation=\'5\'/>',
            '</filter>',
            '</svg>#autocall")'),
        oldProgressBarSetting = GM_config.get('ProgressBar');

    GM_addStyle(".blur5 {\
            -webkit-filter: blur(5px);\
            -moz-filter: blur(5px);\
            -ms-filter: blur(5px);\
            -o-filter: blur(5px);\
        }");
    onSettingsOpen.push(function () {
        oldProgressBarSetting = GM_config.get('ProgressBar');
    });
    onSettingsSave.push(function () {
        if (oldProgressBarSetting !== GM_config.get('ProgressBar')) {
            $("#progressbarContainer").css('display', GM_config.get('ProgressBar') ? 'flex' : 'none');
            oldProgressBarSetting = GM_config.get('ProgressBar');
        }
    });

    $('.stage').prepend(
        $('<div>', {
            'id': 'progressbarContainer'
        }).append(
            $('<hr>', {
                'id': 'progressbar'
            }).css('margin', '10px 0px 0px 0px').css('width', '0px').css('float', 'left').css('background-color', '#2284B5').css('height', '10px')
            .css('border-width', '0px 0px 0px 0px').css('position', 'relative').addClass('blur5').css('filter', firefoxBlur)
        ).append(
            $('<img>', {
                'src': 'http://i.imgur.com/GiBiY.png'
            }).css('width', '30').css('height', '21').addClass('mirror').css('position', 'relative').css('top', '1px').css('left', '-25px')
        ).css('height', '20px').css('display', GM_config.get('ProgressBar') ? 'flex' : 'none')
    );

    function setUpInterval() {
        return setInterval(function () {
            unsafeWindow.video.time(function (time) {
                $("#progressbar").css('width', (time / maxTime) * playerWidth);
            });
        }, 200);
    }
    onPlayVideo.push({
        callback: function (vidinfo, time, playing, indexOfVid) {
            maxTime = unsafeWindow.playlist[indexOfVid].duration;
            $("#progressbar").css('width', '0px');
        }
    });
    onPlayerReady.push({
        callback: function (oldPlayer, newPlayer) {
            progressbarInterval = setUpInterval();
        }
    });
    onPlayerChange.push({
        callback: function () {
            if (progressbarInterval) {
                clearInterval(progressbarInterval);
            }
        },
        preOld: true
    });
    onPlayerDestroy.push({
        callback: function () {
            if (progressbarInterval) {
                clearInterval(progressbarInterval);
            }
        },
        preOld: true
    });
}


preConnectFunctions.push(loadProgressBar);