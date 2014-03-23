setField({
    'name': 'LogInOffMessages',
    'data': {
        'label': 'Login/off Messages',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function userLoggedOn(user) {
    if (user.loggedin && GM_config.get('LogInOffMessages')) {
        unsafeWindow.addMessage('', String.format('{0} logged on.', user.username), '', 'hashtext');
    }
}

function userLoggedOff(id, user) {
    if (user.loggedin && GM_config.get('LogInOffMessages')) {
        unsafeWindow.addMessage('', String.format('{0} logged off.', user.username), '', 'hashtext');
    }
}

function loadLogInOffMessages() {
    events.bind('onAddUser', userLoggedOn);
    events.bind('onRemoveUser', userLoggedOff);
}

events.bind('onResetVariables', function() {
    events.unbind('onAddUser', userLoggedOn);
    events.unbind('onRemoveUser', userLoggedOff);
});
events.bind('onPostConnect', loadLogInOffMessages);