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


function loadGeneralStuff(){
    //get Username
    thisUsername = $.cookie('username');
    unsafeWindow.addMessage('', '<strong>Scripts @VERSION loaded. Recent changes:<br>'+
                    '&bull; \'exportPlaylist will export to the clipboard. Use parameters: title, duration, addedby, thumbnail, all, xml to specify the data<br>'+
                    '&bull; PlayMessages (turn off with ~PlayMessages) <br>'+
                    '&bull; BigPlaylist: bigger playlist with thumbnails (turn off with ~BigPlaylist, also thanks fugXD) <br>'+
                    '&bull; \'Shuffle: shuffles a wall or the playlist <br>'+
                    '&bull; \'History: shows the last 9 videos <br>'+
                    '&bull; Timestamps: (turn off with ~Timestamp) <br>'+
                    '&bull; YouTube Search: type the search term into the add video field <br>'+
                    '&bull; Notifications: the favicon on the browser tab will change when someone says your name like @username</strong>','' ,'hashtext'); 
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
function getUrlOfInfo(vidinfo){
    var url;
    switch(vidinfo.provider){
        case 'youtube': url='http://youtu.be/'  + vidinfo.id;      break;
        case 'vimeo':   url='http://vimeo.com/' + vidinfo.id;      break;
        case 'twitch':  url='http://twitch.tv/' + vidinfo.channel; break;
        default: break;
    }
    return url;
}
function getActiveVideoIndex(){
    return $('.active').index();
}

function isUserMod(){
    return unsafeWindow.isMod;
}

function isBibbyRoom(){
    return unsafeWindow.ROOMNAME.match(/bibby/i)?true:false;
}

function getIndexOfUser(id){
    var i;
    for (i = 0; i < unsafeWindow.users.length; i++){
        if (id === unsafeWindow.users[i].id){
            return i;
        }
    }
    return -1;
}
function blockEvent(event){
    event.stopPropagation();
}
function getUsernameArray(lowerCase){
    var arr = [];
    for(i = 0; i< unsafeWindow.users.length;i++){
        if(unsafeWindow.users[i].username !== 'unnamed'){
            if(!lowerCase){
                arr.push(unsafeWindow.users[i].username);
            }else{
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
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {
        var oSel;
        // Set focus on the element
        oField.focus ();

        // To get cursor position, get empty selection range
        oSel = document.selection.createRange ();

        // Move selection start to 0 position
        oSel.moveStart ('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0'){
      iCaretPos = oField.selectionStart;
    }

    // Return results
    return (iCaretPos);
}

function doSetCaretPosition(oField, position) {
    //IE
    if (document.selection) {
        var oSel;
        oField.focus ();
        oSel = document.selection.createRange ();
        oSel.moveStart('character', position);
        oSel.moveEnd('character', position);
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0'){
        oField.selectionStart = position;
        oField.selectionEnd = position;
    }
}
function pasteTextAtCaret(text) {
    var sel, range;
    if (unsafeWindow.getSelection) {
        // IE9 and non-IE
        sel = unsafeWindow.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var textNode;
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
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().text = text;
    }
}
