/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  Bibbytube

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
function loadNameNotification() {
    var oldAddMessage = unsafeWindow.addMessage;

    //overwrite InstaSynch's addMessage function
    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        var possibleNames = [],
            exactMatches = [],
            nameStart = -1,
            name = '',
            end = false,
            i,
            j,
            found = false;
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
        //continue with InstaSynch's addMessage function
        oldAddMessage(username, message, userstyle, textstyle);
        if (!unsafeWindow.newMsg) {
            return;
        }
        if (found && !notified) {
            toggleNotify();
        }
    };
    $('#cin').focus(function () {
        if (notified) {
            toggleNotify();
        }
    });
}
var notified = false;

function toggleNotify() {
    if (unsafeWindow.newMsg && !notified) {
        $('head > link:last-of-type')[0].href = "https://github.com/Bibbytube/Instasynch-Addons/blob/master/Chat%20Additions/Name%20Notification/notificationFavicon.ico?raw=true";
        notified = true;
    } else {
        $('head > link:last-of-type')[0].href = "http://instasynch.com/favicon.ico";
        notified = false;
    }
}

preConnectFunctions.push(loadNameNotification);