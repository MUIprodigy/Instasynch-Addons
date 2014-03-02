function loadNameNotificationOnce() {
    var possibleNames = [],
        exactMatches = [],
        nameStart = -1,
        name = '',
        end = false,
        i,
        j,
        found = false;
    onAddMessage.push({
        preOld: true,
        callback: function(username, message) {
            while (!end) {
                nameStart = message.indexOf('@', nameStart + 1);
                if (nameStart === -1) {
                    end = true;
                } else {
                    possibleNames = getUsernameArray(true);
                    exactMatches = [];
                    name = '';
                    for (i = nameStart + 1; i < message.length; i += 1) {
                        name += message[i].toLowerCase();

                        for (j = 0; j < possibleNames.length; j += 1) {
                            if (name.indexOf(possibleNames[j]) === 0) {
                                exactMatches.push(possibleNames[j]);
                                possibleNames.splice(j, 1);
                                j += 1;
                            } else if (possibleNames[j].indexOf(name) !== 0) {
                                possibleNames.splice(j, 1);
                                j += 1;
                            }
                        }
                        if (possibleNames.length === 0) {
                            break;
                        }
                    }
                    if (exactMatches.length !== 0) {
                        if (thisUsername === exactMatches[exactMatches.length - 1]) {
                            found = true;
                        }
                    }
                    nameStart = i - 1;
                }
            }
            if (found) {
                message = message.replace(new RegExp(String.format('(@{0})', thisUsername), 'g'), '<strong><font color=red>$1</font></strong>');
            }
        }
    });
    onAddMessage.push({
        callback: function() {
            if (!unsafeWindow.newMsg) {
                return;
            }
            if (found && !notified) {
                toggleNotify();
            }
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
        $('head > link:last-of-type')[0].href = "http://i.imgur.com/XciFozw.png";
        notified = true;
    } else {
        $('head > link:last-of-type')[0].href = "http://i.imgur.com/BMpkAgE.png";
        notified = false;
    }
}

resetVariables.push(function() {
    $('head > link:first-of-type')[0].href = "http://i.imgur.com/BMpkAgE.png";
    notified = false;
});
preConnectFunctions.push(loadNameNotification);
executeOnceFunctions.push(loadNameNotificationOnce);