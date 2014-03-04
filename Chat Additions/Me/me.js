function loadMe() {
    autoCompleteData = autoCompleteData.concat(['/me ']);
}

function loadMeOnce() {
    var oldAddMessage = unsafeWindow.addMessage;
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        if (message.indexOf('/me ') === 0 && message.length > 4) {
            message = String.format('<span style="color:grey;">{0} {1}</span>', username.match(/(\d\d:\d\d - )?([\w\-]+)/)[2], message.substring(3));
            unsafeWindow.addMessage('', message, '', '');
        } else {
            oldAddMessage(username, message, userstyle, textstyle);
        }
    };
}
events.bind('onExecuteOnce', loadMeOnce);
events.bind('onPreConnect', loadMe);