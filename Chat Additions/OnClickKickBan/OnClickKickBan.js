function loadOnClickKickBanOnce() {

    function kickOrBan(kick, ban, text) {
        if (!kick) {
            return;
        }
        var user = text,
            userFound = false,
            isMod = false,
            userId,
            i,
            action = ban ? 'ban' : 'kick';
        user = user.match(/(\d\d:\d\d - )?([\w\-]+)/)[2];
        for (i = 0; i < unsafeWindow.users.length; i += 1) {
            if (unsafeWindow.users[i].username === user) {
                if (unsafeWindow.users[i].permissions > 0) {
                    isMod = true;
                    break;
                }
                userId = unsafeWindow.users[i].id;
                userFound = true;
                break;
            }
        }
        if (isMod) {
            unsafeWindow.addMessage('', String.format("Can't {0} a mod", action), '', 'hashtext');
        } else {
            if (userFound) {
                unsafeWindow.global.sendcmd(action, {
                    userid: userId
                });
            } else {
                if (ban) {
                    unsafeWindow.global.sendcmd('leaverban', {
                        username: user
                    });
                    unsafeWindow.addMessage('', 'Leaverb& user: ' + user, '', 'hashtext');
                } else {
                    unsafeWindow.addMessage('', "Didn't find the user", '', 'hashtext');
                }
            }
        }
    }
    onAddMessage.push({
        callback: function(username) {
            if (username === '' || !isUserMod()) {
                return;
            }
            var currentElement,
                //the cursor doesnt need to be changed if the key is still held down
                isCtrlKeyDown = false,
                keyDown = function(event) {
                    if (!isCtrlKeyDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                        isCtrlKeyDown = true;
                        currentElement.css('cursor', 'pointer');
                    }
                },
                keyUp = function(event) {
                    if (isCtrlKeyDown && !event.ctrlKey) {
                        isCtrlKeyDown = false;
                        currentElement.css('cursor', 'default');
                    }
                };
            //add the events to the latest username in the chat list
            $('#chat_list > span:last-of-type').prev()
                .on('click', function(event) {
                    kickOrBan(event.ctrlKey, event.altKey, $(this)[0].innerHTML);
                })
                .hover(function() {
                    currentElement = $(this);
                    $(document).bind('keydown', keyDown);
                    $(document).bind('keyup', keyUp);
                }, function() {
                    currentElement.css('cursor', 'default');
                    isCtrlKeyDown = false;
                    $(document).unbind('keydown', keyDown);
                    $(document).unbind('keyup', keyUp);
                });
        }
    });

}

function loadOnClickKickBan() {
    var chatCtrlDown = false;

    function chatKeyDown(event) {
        if (!chatCtrlDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
            unsafeWindow.autoscroll = false;
            $('#chat_list').bind('scroll', blockEvent);
            chatCtrlDown = true;
        }
    }

    function chatKeyUp(event) {
        if (chatCtrlDown && !event.ctrlKey) {
            unsafeWindow.autoscroll = true;
            $('#chat_list').unbind('scroll', blockEvent);
            $('#chat_list').scrollTop($('#chat_list')[0].scrollHeight);
            chatCtrlDown = false;
        }
    }
    $('#chat_list').hover(
        function() {
            $(document).bind('keydown', chatKeyDown);
            $(document).bind('keyup', chatKeyUp);
        },
        function() {
            chatCtrlDown = false;
            $(document).unbind('keydown', chatKeyDown);
            $(document).unbind('keyup', chatKeyUp);
        }
    );
}

executeOnceFunctions.push(loadOnClickKickBanOnce);
postConnectFunctions.push(loadOnClickKickBan);