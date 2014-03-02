setField({
    'name': 'ProgressBar',
    'data': {
        'label': 'Progress Bar above the Player',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Player Additions'
});

function loadProgressbarOnce() {
    var maxTime = 0,
        progressbarInterval,
        oldProgressBarSetting = GM_config.get('ProgressBar'),
        eventObj;

    GM_addStyle(GM_getResourceText('progressbarCSS'));
    onSettingsOpen.push(function() {
        oldProgressBarSetting = GM_config.get('ProgressBar');
    });
    onSettingsSave.push(function() {
        if (oldProgressBarSetting !== GM_config.get('ProgressBar')) {
            $("#progressbar-container").css('display', GM_config.get('ProgressBar') ? 'flex' : 'none');
            oldProgressBarSetting = GM_config.get('ProgressBar');
        }
    });

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
    eventObj = {
        callback: function() {
            if (progressbarInterval) {
                clearInterval(progressbarInterval);
            }
        },
        preOld: true
    };
    onPlayerChange.push(eventObj);
    onPlayerDestroy.push(eventObj);
    onDisconnect.push(eventObj);
    onChangeRoom.push(eventObj);
}

function loadProgressbar() {
    $('.stage').prepend(
        $('<div>', {
            'id': 'progressbar-container'
        }).append(
            $('<hr>', {
                'id': 'progressbar'
            }).addClass('blur5')
        ).append(
            $('<img>', {
                'src': 'http://i.imgur.com/GiBiY.png'
            }).addClass('mirror')
        ).css('display', GM_config.get('ProgressBar') ? 'flex' : 'none')
    );
}

executeOnceFunctions.push(loadProgressbarOnce);
preConnectFunctions.push(loadProgressbar);