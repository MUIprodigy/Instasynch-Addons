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
    onAddUser.push({
        callback: function(user, css, sort) {
            if (user.loggedin && GM_config.get('LogInOffMessages')) {
                unsafeWindow.addMessage('', String.format('{0} logged on.', user.username), '', 'hashtext');
            }
        }
    });
    onRemoveUser.push({
        callback: function(id, user) {
            if (user.loggedin && GM_config.get('LogInOffMessages')) {
                unsafeWindow.addMessage('', String.format('{0} logged off.', user.username), '', 'hashtext');
            }
        }
    });
}

executeOnceFunctions.push(loadLogInOffMessages);