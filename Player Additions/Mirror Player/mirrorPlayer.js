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

    onPlayVideo.push({
        callback: function(vidinfo, time, playing, indexOfVid) {
            if (containsMirrored(unsafeWindow.playlist[indexOfVid].title)) {
                if (!isPlayerMirrored) {
                    toggleMirrorPlayer();
                }
            } else if (isPlayerMirrored) {
                toggleMirrorPlayer();
            }
        },
        preOld: true
    });

    //checking the current video after loading the first time
    if (unsafeWindow.playlist.length !== 0) {
        setTimeout(function() {
            if (unsafeWindow.playlist && unsafeWindow.playlist[getActiveVideoIndex()] && containsMirrored(unsafeWindow.playlist[getActiveVideoIndex()].title)) {
                toggleMirrorPlayer();
            }
        }, 4000);
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
    $('#block-fullscreen').toggleClass('block-fullscreen2');
    isPlayerMirrored = !isPlayerMirrored;
}

resetVariables.push(function() {
    isPlayerMirrored = false;
});
executeOnceFunctions.push(loadMirrorPlayer);