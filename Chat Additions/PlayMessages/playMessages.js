/*
    Copyright (C) 2014  fugXD
*/

setField({
    'name': 'PlayMessages',
    'data': {
        'label': 'PlayMessages',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});

function loadPlayMessages() {
    onPlayVideo.push({
        callback: function(vidinfo, time, playing, indexOfVid) {
            if (GM_config.get('PlayMessages')) {
                unsafeWindow.addMessage('', 'Now playing: ' + trimTitle(unsafeWindow.playlist[indexOfVid].title, 240), '', 'hashtext');
            }
        }
    });
}

postConnectFunctions.push(loadPlayMessages);