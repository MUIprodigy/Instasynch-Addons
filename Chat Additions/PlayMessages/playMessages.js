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
    events.bind('onPlayVideo', function(vidinfo, time, playing, indexOfVid) {
        if (GM_config.get('PlayMessages')) {
            unsafeWindow.addMessage('', 'Now playing: ' + trimTitle(unsafeWindow.playlist[indexOfVid].title, 240), '', 'hashtext');
        }
    });
}
events.bind('onExecuteOnce', loadPlayMessages);