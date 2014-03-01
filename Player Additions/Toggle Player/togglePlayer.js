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
    if (!GM_config.get('PlayerActive')) {
        setTimeout(unsafeWindow.video.destroyPlayer, 3000);
    }
}

function loadTogglePlayerOnce() {
    var oldPlayerActive = GM_config.get('PlayerActive'),
        oldPlayVideo = unsafeWindow.playVideo;

    commands.set('regularCommands', "togglePlayer", function() {
        togglePlayer();
        toggleSetting();
    }, 'Turns the embedded player on and off.');

    events.bind('onSettingsOpen', function() {
        oldPlayerActive = GM_config.get('PlayerActive');
    });

    events.bind('onSettingsSave', function() {
        if (oldPlayerActive !== GM_config.get('PlayerActive')) {
            togglePlayer();
            oldPlayerActive = GM_config.get('PlayerActive');
        }
    });

    unsafeWindow.playVideo = function(vidinfo, time, playing) {
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

    function toggleSetting() {
        oldPlayerActive = !GM_config.get('PlayerActive');
        GM_config.set('PlayerActive', !GM_config.get('PlayerActive'));
        GM_config.save();
    }
}

function togglePlayer() {
    if (GM_config.get('PlayerActive')) {
        unsafeWindow.video.destroyPlayer();
    } else {
        unsafeWindow.global.sendcmd('reload', null);
    }
}

executeOnceFunctions.push(loadTogglePlayerOnce);
postConnectFunctions.push(loadTogglePlayer);