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
        oldProgressBarSetting = GM_config.get('ProgressBar');

    events.bind('onSettingsOpen', function() {
        oldProgressBarSetting = GM_config.get('ProgressBar');
    });
    events.bind('onSettingsSave', function() {
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
    events.bind('onPlayVideo', function(vidinfo, time, playing, indexOfVid) {
        maxTime = unsafeWindow.playlist[indexOfVid].duration;
        $("#progressbar").css('width', '0px');
    });
    events.bind('onPlayerReady', function(oldPlayer, newPlayer) {
        progressbarInterval = setUpInterval();
    });

    function clearProgressbarInterval() {
        if (progressbarInterval) {
            clearInterval(progressbarInterval);
        }
    }
    events.bind('onPlayerChange', clearProgressbarInterval);
    events.bind('onPlayerDestroy', clearProgressbarInterval);
    events.bind('onDisconnect', clearProgressbarInterval);
    events.bind('onRoomChange', clearProgressbarInterval);

    events.bind('onDisconnect', function() {
        currentPlayer = '';
    });
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
            $('<div>').addClass('mirror')
        ).css('display', GM_config.get('ProgressBar') ? 'flex' : 'none')
    );
}

events.bind('onExecuteOnce', loadProgressbarOnce);
events.bind('onPreConnect', loadProgressbar);