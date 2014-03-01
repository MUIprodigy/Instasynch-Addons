setField({
    'name': 'Timestamp',
    'data': {
        'label': 'Timestamp (in front of messages)',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function loadTimestamp() {
    var oldAddMessage = unsafeWindow.addMessage,
        date,
        hours,
        minutes;

    //overwrite InstaSynch's addMessage function
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        if (GM_config.get('Timestamp')) {
            date = new Date();
            minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            hours = date.getHours();
            if (hours < 10) {
                hours = "0" + hours;
            }
            username = hours + ":" + minutes + " - " + username;
        }
        oldAddMessage(username, message, userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };
}

executeOnceFunctions.push(loadTimestamp);