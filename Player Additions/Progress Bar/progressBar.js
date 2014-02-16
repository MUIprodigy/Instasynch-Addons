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
    onSettingsOpen.push(function() {
        oldProgressBarSetting = GM_config.get('ProgressBar');
    });
    onSettingsSave.push(function() {
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
        return setInterval(function() {
            unsafeWindow.video.time(function(time) {
                $("#progressbar").css('width', (time / maxTime) * playerWidth);
            });
        }, 200);
    }
    onPlayVideo.push({
        callback: function(vidinfo, time, playing, indexOfVid) {
            maxTime = unsafeWindow.playlist[indexOfVid].duration;
            $("#progressbar").css('width', '0px');
        }
    });
    onPlayerReady.push({
        callback: function(oldPlayer, newPlayer) {
            progressbarInterval = setUpInterval();
        }
    });
    onPlayerChange.push({
        callback: function() {
            if (progressbarInterval) {
                clearInterval(progressbarInterval);
            }
        },
        preOld: true
    });
    onPlayerDestroy.push({
        callback: function() {
            if (progressbarInterval) {
                clearInterval(progressbarInterval);
            }
        },
        preOld: true
    });
}


preConnectFunctions.push(loadProgressBar);