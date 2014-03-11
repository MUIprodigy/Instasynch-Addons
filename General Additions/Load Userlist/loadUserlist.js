function loadNewLoadUserlist() {
    unsafeWindow.addUser = function(user, css) {
        user.css = css;
        var muted = unsafeWindow.isMuted(user.ip) ? "muted" : "",
            index = unsafeWindow.users.length,
            i,
            userElement;

        userElement = $('<div/>', {
            "class": "user_list " + muted,
            "data": {
                username: String(user.username),
                id: user.id,
                css: css
            },
            "click": function() {
                $('#cin').val($('#cin').val() + $(this).data('username'));
                $('#cin').focus();
            },
            "css": {
                "cursor": 'default'
            }
        }).append($('<div/>', {
                "class": css
            })
            .append($('<span/>', {
                "html": user.username
            })));
        userElement.hover(function() {
            var thisElement = $(this);
            $(this).data('hover', setTimeout(function() {
                $('#bio .username span').html(thisElement.data('username'));
                //$("#chat").offset().top is the offten from the top of the page, Use turnary operation: If bio goes above chat, minus some pixels
                $('#bio').css('top', ((thisElement.offset().top - $("#chat").offset().top - 15) < -10 ? -10 : thisElement.offset().top - $("#chat").offset().top - 15)); //cant be less than -10 pixels
                $('#bio .avatar img').attr('src', '');
                $('#bio .userinfo').html('');
                $('#bio').show();
                if (thisElement.data('css').indexOf('b') !== -1) {
                    unsafeWindow.getUserInfo(thisElement.data('username'), function(avatar, bio) {
                        $('#bio .avatar img').attr('src', avatar);
                        $('#bio .userinfo').html(bio);
                    });
                } else {
                    $('#bio .userinfo').html('<span style=\'color: grey;\'>Unregistered</span>');
                }
                $('#ban').data('id', user.id);
                $('#kick').data('id', user.id);
                $('#mute').data('ip', user.ip);
                $('#unmute').data('ip', user.ip);
                //show or hide mute/unmute buttons
                if (unsafeWindow.isMuted(user.ip)) {
                    $("#unmute").show();
                    $("#mute").hide();
                } else {
                    $("#mute").show();
                    $("#unmute").hide();
                }
            }, 600));
        }, function() {
            clearTimeout($(this).data('hover'));
            setTimeout(function() {
                if (!unsafeWindow.mouseOverBio) {
                    $('#bio').hide();
                }
            }, 50);
        });
        //Search for the index where we need to insert
        for (i = 0; i < unsafeWindow.users.length; i += 1) {
            if (compareUser(user, unsafeWindow.users[i]) < 0) {
                index = i;
                break;
            }
        }

        //Inserting the users rather than sorting afterwards
        if ($("#chat_users").children().length === 0 || index === unsafeWindow.users.length) {
            $("#chat_users").append(userElement);
        } else {
            $("#chat_users").children().eq(index).before(userElement);
        }
        unsafeWindow.users.splice(index, 0, user);
        $('#viewercount').html(unsafeWindow.users.length);
    };


    unsafeWindow.loadUserlist = function(userlist) {
        unsafeWindow.users = [];
        $('#chat_users').html('');
        var i,
            user,
            css;
        for (i = 0; i < userlist.length; i += 1) {
            user = userlist[i];
            css = '';
            if (user.loggedin) {
                css += 'b ';
                if (user.permissions > 0) {
                    css += 'm ';
                }
            }
            unsafeWindow.addUser(user, css, false);
        }
    };
    unsafeWindow.renameUser = function(id, username) {
        var user,
            i;
        //start from the end since unnamed will be at the end of the list
        for (i = unsafeWindow.users.length - 1; i >= 0; i -= 1) {
            if (unsafeWindow.users[i].id === id) {
                user = unsafeWindow.users[i];
                user.username = username;
                unsafeWindow.removeUser(id);
                unsafeWindow.addUser(user, '', false);
                break;
            }
        }
    };
}

function compareUser(a, b) {
    if (!b) {
        return -1;
    }
    if (a.loggedin !== b.loggedin) {
        return (a.loggedin) ? -1 : 1;
    }
    if (a.permissions !== b.permissions) {
        return parseInt(b.permissions, 10) - parseInt(a.permissions, 10);
    }

    return a.username.localeCompare(b.username);
}