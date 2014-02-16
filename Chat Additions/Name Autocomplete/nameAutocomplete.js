function loadNameAutocomplete() {
    $("#chat input").bind('keydown', function(event) {
        if (event.keyCode === 9) { //tab
            //prevent loosing focus from input
            event.preventDefault();
            //split the message
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length - 1].match(/^((\[[^\]]*\])*\[?@?)([\w\-]+)/),
                name,
                partToComplete = '',
                i,
                j,
                sub,
                usernames = getUsernameArray(false);
            if (!messagetags || !messagetags[3]) {
                return;
            }
            if (!messagetags[1]) {
                messagetags[1] = '';
            }
            //make a regex out of the name
            name = new RegExp('^' + messagetags[3], 'i');

            //find matching users
            for (i = 0; i < usernames.length; i += 1) {
                if (usernames[i].match(name)) {
                    if (partToComplete === '') {
                        partToComplete = usernames[i];
                    } else {
                        //check for partial matches with other found users
                        for (j = partToComplete.length; j >= 0; j -= 1) {
                            sub = partToComplete.substring(0, j);
                            if (usernames[i].indexOf(sub) === 0) {
                                partToComplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if (partToComplete !== '') {
                //put messagetags and the autocompleted name back into the message
                message[message.length - 1] = messagetags[1] + partToComplete;
                $(this).val(message.join(' '));
            }

        }
    });
}

preConnectFunctions.push(loadNameAutocomplete);