function loadNameNotificationOnce() {
    var found = false,
        oldAddMessage = unsafeWindow.addMessage;
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        found = false;
        message = message.replace(new RegExp(String.format('@{0}', thisUsername), 'g'),
            function(match) {
                found = true;
                return String.format('<strong><font color=red>{0}</font></strong>', match);
            });
        oldAddMessage(username, message, userstyle, textstyle);
        if (!unsafeWindow.newMsg) {
            return;
        }
        if (found && !notified) {
            toggleNotify();
        }
    };
    $('link').each(function() {
        if ($(this).attr('href') === '/favicon.ico') {
            $(this).attr('id', 'favicon');
            $(this).attr('type', 'image/png');
            $(this).attr('href', 'http://i.imgur.com/BMpkAgE.png');
        }
    });
}

function loadNameNotification() {
    $('#cin').focus(function() {
        if (notified) {
            toggleNotify();
        }
    });
}
var notified = false;

function toggleNotify() {
    if (unsafeWindow.newMsg && !notified) {
        $('#favicon').attr('href', 'http://i.imgur.com/XciFozw.png');
        notified = true;
    } else {
        $('#favicon').attr('href', 'http://i.imgur.com/BMpkAgE.png');
        notified = false;
    }
}

events.bind('onResetVariables', function() {
    $('head > link:first-of-type')[0].href = "http://i.imgur.com/BMpkAgE.png";
    notified = false;
});
events.bind('onPreConnect', loadNameNotification);
events.bind('onExecuteOnce', loadNameNotificationOnce);