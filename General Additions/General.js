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
function loadGeneralStuff() {

    //http://joquery.com/2012/string-format-for-javascript
    String.format = function () {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0],
            i,
            regEx;

        // start with the second argument (i = 1)
        for (i = 1; i < arguments.length; i += 1) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }
        return theString;
    };

    thisUsername = $.cookie('username');
    unsafeWindow.addMessage('', String.format('<strong>Script {0} loaded.<br>Changelog: {1}</strong>', GM_info.script.version, 'https://github.com/Bibbytube/Instasynch-Addons/blob/master/changelog.txt'), '', 'hashtext');


    // unsafeWindow.addEventListener("message", 
    // function(event){
    //     try{
    //         var parsed = JSON.parse(event.data);
    //         if(parsed.newTabParameters){
    //             openInNewTab(parsed.newTabParameters[0],parsed.newTabParameters[1]);
    //         }
    //     }catch(err){
    //     }
    // }, false);
    // function openInNewTab(url, options){
    //     GM_openInTab(url,options);
    // }
}

function getUrlOfInfo(vidinfo) {
    var url;
    switch (vidinfo.provider) {
    case 'youtube':
        url = 'http://youtu.be/' + vidinfo.id;
        break;
    case 'vimeo':
        url = 'http://vimeo.com/' + vidinfo.id;
        break;
    case 'twitch':
        url = 'http://twitch.tv/' + vidinfo.channel;
        break;
    default:
        break;
    }
    return url;
}

function getActiveVideoIndex() {
    return $('.active').index();
}

function isUserMod() {
    return unsafeWindow.isMod;
}

function isBibbyRoom() {
    return unsafeWindow.ROOMNAME.match(/bibby/i) ? true : false;
}

function getIndexOfUser(id) {
    var i;
    for (i = 0; i < unsafeWindow.users.length; i += 1) {
        if (id === unsafeWindow.users[i].id) {
            return i;
        }
    }
    return -1;
}

function blockEvent(event) {
    event.stopPropagation();
}

function getUsernameArray(lowerCase) {
    var arr = [],
        i;
    for (i = 0; i < unsafeWindow.users.length; i += 1) {
        if (unsafeWindow.users[i].username !== 'unnamed') {
            if (!lowerCase) {
                arr.push(unsafeWindow.users[i].username);
            } else {
                arr.push(unsafeWindow.users[i].username.toLowerCase());
            }
        }
    }
    return arr;
}

var thisUsername;

/*
 ** Returns the caret (cursor) position of the specified text field.
 ** Return value range is 0-oField.value.length.
 ** http://flightschool.acylt.com/devnotes/caret-position-woes/
 */
function doGetCaretPosition(oField) {

    // Initialize
    var iCaretPos = 0,
        oSel;

    // IE Support
    if (document.selection) {
        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        oSel = document.selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        iCaretPos = oField.selectionStart;
    }

    // Return results
    return iCaretPos;
}

function doSetCaretPosition(oField, position) {
    //IE
    if (document.selection) {
        var oSel;
        oField.focus();
        oSel = document.selection.createRange();
        oSel.moveStart('character', position);
        oSel.moveEnd('character', position);
    } else if (oField.selectionStart || oField.selectionStart === '0') { // Firefox support
        oField.selectionStart = position;
        oField.selectionEnd = position;
    }
}

function pasteTextAtCaret(text) {
    var sel,
        range,
        textNode;
    if (unsafeWindow.getSelection) {
        // IE9 and non-IE
        sel = unsafeWindow.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Preserve the selection
            range = range.cloneRange();
            range.setStartAfter(textNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.type !== "Control") {
        // IE < 9
        document.selection.createRange().text = text;
    }
}