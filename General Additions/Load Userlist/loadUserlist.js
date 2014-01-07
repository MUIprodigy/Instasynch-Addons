/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/

function loadNewLoadUserlist() {
    unsafeWindow.addUser = function (user, css, sort) {
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
            "click": function () {
                $('#cin')['val']($('#cin')['val']() + $(this).data('username'));
                $('#cin')['focus']();
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
        userElement.hover(function () {
            var thisElement = $(this);
            $(this).data('hover', setTimeout(function () {
                $('#bio .username span').html(thisElement.data('username'));
                //$("#chat").offset().top is the offten from the top of the page, Use turnary operation: If bio goes above chat, minus some pixels
                $('#bio').css('top', ((thisElement.offset().top - $("#chat").offset().top - 15) < -10 ? -10 : thisElement.offset().top - $("#chat").offset().top - 15)); //cant be less than -10 pixels
                $('#bio .avatar img').attr('src', '');
                $('#bio .userinfo').html('');
                $('#bio').show();
                if (thisElement.data('css').indexOf('b') != -1) {
                    getUserInfo(thisElement.data('username'), function (avatar, bio) {
                        $('#bio .avatar img').attr('src', avatar);
                        $('#bio .userinfo').html(bio);
                    });
                } else {
                    $('#bio .userinfo').html('<span style=\'color: grey;\'>Unregistered</span>');
                }
                $('#ban').data('id', user['id']);
                $('#kick').data('id', user['id']);
                $('#mute').data('ip', user.ip);
                $('#unmute').data('ip', user.ip)
                //show or hide mute/unmute buttons
                if (isMuted(user.ip)) {
                    $("#unmute").show();
                    $("#mute").hide();
                } else {
                    $("#mute").show();
                    $("#unmute").hide();
                }
            }, 600));
        }, function () {
            clearTimeout($(this).data('hover'));
            setTimeout(function () {
                if (!mouseOverBio) {
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


    unsafeWindow.loadUserlist = function (userlist) {
        unsafeWindow.users = new Array();
        $('#chat_users').html('');
        for (var i = 0; i < userlist.length; i++) {
            var user = userlist[i];
            var css = '';
            if (user['loggedin']) {
                css += 'b ';
                if (user['permissions'] > 0) {
                    css += 'm ';
                }
            }
            unsafeWindow.addUser(user, css, false);
        }
    };
    unsafeWindow.renameUser = function (id, username) {
        var user,
            i;
        //start from the end since unnamed will be at the end of the list
        for (i = unsafeWindow.users.length - 1; i >= 0; i--) {
            if (unsafeWindow.users[i].id === id) {
                user = unsafeWindow.users[i];
                user.username = username;
                unsafeWindow.removeUser(id);
                unsafeWindow.addUser(user, '', false);
                break;
            }
        }
    }
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
    } else {
        return a.username.localeCompare(b.username);
    }
}