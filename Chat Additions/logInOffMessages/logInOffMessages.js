setField({
    'name': 'LogInOffMessages',
    'data': {
        'label': 'Login/off Messages',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});


function loadLogInOffMessages() {
    events.bind('onAddUser', function(user) {
        if (user.loggedin && GM_config.get('LogInOffMessages')) {
            unsafeWindow.addMessage('', String.format('{0} logged on.', user.username), '', 'hashtext');
        }
    });
    events.bind('onRemoveUser', function(id, user) {
        if (user.loggedin && GM_config.get('LogInOffMessages')) {
            unsafeWindow.addMessage('', String.format('{0} logged off.', user.username), '', 'hashtext');
        }
    });
}

events.bind('onExecuteOnce', loadLogInOffMessages);