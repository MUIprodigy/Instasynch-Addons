var afterConnectFunctions = [],
    beforeConnectFunctions = [],
    scriptErrors = [];
function executeFunctions(funcArray){
    var i;
    for(i = 0; i< funcArray.length;i++){
        try{
            funcArray[i]();
        }catch(err){
            scriptErrors.push(err);
            console.log("Error in " + funcArray[i].name + ". See scriptErrors["+(scriptErrors.length-1)+"].stack for details");
        }
    }
}
function afterConnect(){
	if (messages < 4) {
	    setTimeout(function () {afterConnect();}, 100);
	    return;
	}

    executeFunctions(afterConnectFunctions);
}
function beforeConnect(){
    executeFunctions(beforeConnectFunctions);
}
//-----------------start autocomplete.js-----------------
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

function loadAutoComplete() {
    if(afterConnectFunctions.lastIndexOf(loadAutoComplete) != afterConnectFunctions.length-1){
        afterConnectFunctions.push(loadAutoComplete);
        return;
    }
    //load settings
    autocompleteEmotes = settings.get('autocompleteEmotes','true');
    autocompleteTags = settings.get('autocompleteTags','true');
    autocompleteCommands = settings.get('autocompleteCommands','true');
    autocompleteAddonSettings = settings.get('autocompleteAddonSettings','true');
    autocompleteNames = settings.get('autocompleteNames','true');
    autocompleteBotCommands = settings.get('autocompleteBotCommands','true');

    //add the commands
    commands.set('addOnSettings',"TagsAutoComplete",toggleTagsAutocomplete);
    commands.set('addOnSettings',"EmotesAutoComplete",toggleEmotesAutocomplete);
    commands.set('addOnSettings',"CommandsAutoComplete",toggleCommandsAutocomplete);
    commands.set('addOnSettings',"AddOnSettingsAutoComplete",toggleAddonSettingsAutocomplete);
    commands.set('addOnSettings',"NamesAutoComplete",toggleNamesAutocomplete);
    commands.set('addOnSettings',"BotCommandsAutocomplete",toggleBotCommandsAutocomplete);

    var i,
        emotes = (
            function () {
                var arr = Object.keys($codes);
                for (i = 0; i < arr.length; i++) {
                    arr[i] = '/' + arr[i];
                }
                return arr;
            })(),
        tagKeys = Object.keys(tags);

    for (i = 0; i < tagKeys.length; i++) {
        tagKeys[i] = tagKeys[i].replace(/\\/g,'');
    }
    autocompleteData = autocompleteData.concat(emotes);
    autocompleteData = autocompleteData.concat(commands.get('regularCommands'));
    autocompleteData = autocompleteData.concat(tagKeys);
    if (isUserMod()) {
        autocompleteData = autocompleteData.concat(commands.get('modCommands'));
    }
    autocompleteData.sort();
    autocompleteData = autocompleteData.concat(commands.get('addOnSettings').sort());

    //add the jquery autcomplete widget to InstaSynch's input field
    $("#chat input")    
    .bind("keydown", function(event) {
        // don't navigate away from the field on tab when selecting an item
        if (event.keyCode === $.ui.keyCode.TAB && isAutocompleteMenuActive) {
            event.keyCode = $.ui.keyCode.ENTER;  // fake select the item
            $(this).trigger(event);
        }
    })
    .autocomplete({
        delay: 0,
        minLength: 0,
        source: function (request, response) {
            if(!autocomplete){
                return;
            }
            var message = request.term,
                caretPosition = doGetCaretPosition(cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~','@','$']),
                partToComplete = message.substring(lastIndex,caretPosition),
                matches = [];

            if(partToComplete.length>0){
                switch(partToComplete[0]){
                    case '/': if(!autocompleteEmotes) return; break;
                    case '\'': if(!autocompleteCommands || (lastIndex!==0 && message[lastIndex-1].match(/\w/))) return; break;
                    case '[': if(!autocompleteTags) return; break;
                    case '~': if(!autocompleteAddonSettings) return; break; 
                    case '@': if(!autocompleteNames)return; break;
                    case '$': if(!autocompleteBotCommands)return; break;

                }
                if(partToComplete[0] ==='@'){
                    matches = $.map(getUsernameArray(), function(item){
                        item = '@' + item;
                        if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                            return item;
                        }
                    });
                }else{
                    matches = $.map(autocompleteData, function (item) {
                        if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                            return item;
                        }
                    });
                }

            }
            //show only 7 responses
            response(matches.slice(0, 7));
        },
        autoFocus: true,
        focus: function()  {
            return false; // prevent value inserted on focus
        },
        select: function(event, ui) {

            var message = this.value,
                caretPosition = doGetCaretPosition(cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~','@','$']);
            //prevent it from autocompleting when a little changed has been made and its already there
            if(message.indexOf(ui.item.value) === lastIndex && lastIndex+ui.item.value.length !== caretPosition){
                doSetCaretPosition(cin,lastIndex+ui.item.value.length);
                return false;
            }
            //insert the autocompleted text and set the cursor position after it
            this.value = message.substring(0,lastIndex) + ui.item.value + message.substring(caretPosition,message.length);
            doSetCaretPosition(cin,lastIndex+ui.item.value.length);
            //if the selected item is a emote trigger a fake enter event
            if(lastIndex === 0 && ((ui.item.value[0] === '/') || ((ui.item.value[0] === '\''|| ui.item.value[0] === '~' || ui.item.value[0] === '$') && ui.item.value[ui.item.value.length-1] !== ' '))){
                $(this).trigger($.Event( 'keypress', { which: 13,keyCode : 13 })); 
            }
            return false;
        },
        close : function(){
            isAutocompleteMenuActive = false;
        },
        open : function(){
            isAutocompleteMenuActive = true;
        }
    });
}
function lastIndexOfSet(input, set){
    var index = -1,
        i;
    for (i = 0; i < set.length; i++) {
        index = Math.max(index, input.lastIndexOf(set[i]));
    }
    if(index>0){
        if(input[index] === '/' && input[index-1]==='['){
            index--;
        }
    }
    return index;
}
var isAutocompleteMenuActive = false,
    autocomplete = true,
    autocompleteEmotes = true,
    autocompleteCommands = true,
    autocompleteTags = true,
    autocompleteAddonSettings = true,
    autocompleteNames = true,
    autocompleteBotCommands= true,
    autocompleteData = [];
function toggleBotCommandsAutocomplete(){
    autocompleteBotCommands = !autocompleteBotCommands; 
    settings.set('autocompleteBotCommands',autocompleteBotCommands);
}
function toggleTagsAutocomplete(){
    autocompleteTags = !autocompleteTags; 
    settings.set('autocompleteTags',autocompleteTags);
}
function toggleEmotesAutocomplete(){
    autocompleteEmotes = !autocompleteEmotes; 
    settings.set('autocompleteEmotes',autocompleteEmotes);
}
function toggleCommandsAutocomplete(){
    autocompleteCommands = !autocompleteCommands; 
    settings.set('autocompleteCommands',autocompleteCommands);
}
function toggleAddonSettingsAutocomplete(){
    autocompleteAddonSettings = !autocompleteAddonSettings; 
    settings.set('autocompleteAddonSettings',autocompleteAddonSettings);
}
function toggleNamesAutocomplete(){
    autocompleteNames = !autocompleteNames; 
    settings.set('autocompleteNames',autocompleteNames);
}

afterConnectFunctions.push(loadAutoComplete);
//----------------- end  autocomplete.js-----------------
//-----------------start autoscrollFix.js-----------------
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

function loadAutoscrollFix(){

    //remove autoscroll stop on hover (for now by cloning the object and thus removing all events)
    //could not figure out how to delete an anonymous function from the events
    var old_element = document.getElementById("chat_list"),
        new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    //all not working
    // var eventListeners = jQuery._data( chat_list, "events" );
    // for(var e in eventListeners){
    //     if(e === 'mouseover' || e === 'mouseout'){
    //         $('#chat_list')[0].removeEventListener(e,eventListeners[e][0]['handler']);
    //         $('#chat_list').unbind(e,eventListeners[e][0]['handler']);
    //     }
    // }
    // $('#chat_list').unbind('mouseover');
    // $('#chat_list').unbind('mouseout');
    // $('#chat_list').unbind('hover');


    //add a scrolling event to the chat
    $('#chat_list').on('scroll',function()
    {
        var scrollHeight = $(this)[0].scrollHeight, 
            scrollTop = $(this).scrollTop(),   
            height = $(this).height();

        //scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
        //height of the chat window is 280, not sure where the 10 is from
        if ((scrollHeight - scrollTop) < height*1.05){
            autoscroll = true;
        }else{
            autoscroll = false;
        }
    });

    //overwrite cleanChat Function so it won't clean when autoscroll is off
    //,also clean all the messages until messages === MAXMESSAGES
    cleanChat = function cleanChat(){
        var max = MAXMESSAGES;
        //increasing the maximum messages by the factor 2 so messages won't get cleared 
        //and won't pile up if the user goes afk with autoscroll off
        if(!autoscroll){
            max = max*2;
        }
        while(messages > max){
            $('#chat_list > :first-child').remove(); //span user
            $('#chat_list > :first-child').remove(); //span message
            $('#chat_list > :first-child').remove(); //<br>
            messages--;
        }
    };
}

//now added oficially on InstaSynch
//afterConnectFunctions.push(loadAutoscrollFix);
//----------------- end  autoscrollFix.js-----------------
//-----------------start inputHistory.js-----------------
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


function loadInputHistory(){

    $("#chat input").bind('keypress',function(event){
        if(event.keyCode === 13){
            if($(this).val() != ""){
                if(inputHistoryIndex != 0){
                    //remove the string from the array
                    inputHistory.splice(inputHistoryIndex,1);
                }
                //add the string to the array at position 1
                inputHistory.splice(1,0,$(this).val());

                //50 messages limit (for now)
                if(inputHistory.length === 50){
                    //delete the last
                    inputHistory.splice(inputHistory.length-1,1);
                }
                setInputHistoryIndex(0);
                if(commandExecuted){
                    $(this).val('');
                }
            }
        }else{
            setInputHistoryIndex(0);
        }
    });    

    $("#chat input").bind('keydown',function(event){
        if(isAutocompleteMenuActive && inputHistoryIndex == 0){
            return ;
        }
        if(event.keyCode === 38){//upkey
            if(inputHistoryIndex < inputHistory.length){
                setInputHistoryIndex(inputHistoryIndex+1);
            }else{
                setInputHistoryIndex(0);
            }   
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);         

        }else if(event.keyCode === 40){//downkey
            if(inputHistoryIndex > 0){
                setInputHistoryIndex(inputHistoryIndex-1);
            }else{
                setInputHistoryIndex(inputHistory.length-1);
            }            
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
}
function setInputHistoryIndex(index){
    inputHistoryIndex = index;
    if(index === 0){
        autocomplete = true;
    }else{
        autocomplete = false;
    }
}

var inputHistory = [""],
    inputHistoryIndex = 0;

beforeConnectFunctions.push(loadInputHistory);
//----------------- end  inputHistory.js-----------------
//-----------------start logInOffMessages.js-----------------
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

function loadLogInOffMessages(){
    //load settings
    logInOffMessages = settings.get('logInOffMessages','false');
    
    //add the command
    commands.set('addOnSettings',"LogInOffMessages",toggleLogInOffMessages);
    
    // Overwriting Adduser
    var oldAddUser = addUser,
        oldRemoveUser = removeUser;

    addUser = function(user, css, sort) {
        // Only if blackname or mod
        if (user.loggedin && logInOffMessages){
            addMessage('', user.username + ' logged on.', '','hashtext'); 
            if (user.username === 'JustPassingBy'){
                addMessage('','Wish him a happy birthday !', '', 'hastext');
            }
        }
        oldAddUser(user,css,sort);
    };

    // Overwriting removeUser

    removeUser = function(id) {
        var user = users[getIndexOfUser(id)];
        if (user.loggedin && logInOffMessages){
            addMessage('',user.username + ' logged off.', '','hashtext');

        }
        oldRemoveUser(id);
    };
}

var logInOffMessages = false;

function toggleLogInOffMessages(){
    logInOffMessages = !logInOffMessages;
    settings.set('logInOffMessages',logInOffMessages);
}

afterConnectFunctions.push(loadLogInOffMessages);
//----------------- end  logInOffMessages.js-----------------
//-----------------start messagefilter.js-----------------
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


function loadMessageFilter() {
    //load settings
    filterTags = settings.get('filterTags','true');
    NSFWEmotes = settings.get('NSFWEmotes','false');

    //add the commands
    commands.set('addOnSettings',"Tags",toggleTags);
    commands.set('addOnSettings',"NSFWEmotes",toggleNSFWEmotes);

    //init
    if(NSFWEmotes){
        $codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
    }
    var oldLinkify = linkify,
        oldAddMessage = addMessage,
        oldCreatePoll = createPoll;

    linkify = function linkify(str, buildHashtagUrl, includeW3, target) {
        var emotes =[],
            index = 0;
        //remove image urls so they wont get linkified
        str = str.replace(/src=\"([^\"]*)\"/gi,function(match){emotes.push(match); return 'src=\"\"';});
        str = oldLinkify(str, buildHashtagUrl, includeW3, target);
        //put them back in
        str = str.replace(/src=\"\"/gi,function(){return emotes[index++];});
        return str;
    };


    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        var isChatMessage = true;
        if(username === ''){
            isChatMessage = false;
        }
        oldAddMessage(username, parseMessage(message,isChatMessage), userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };

    createPoll = function createPoll(poll){
        var i;
        poll.title = linkify(parseMessage(poll.title,false), false, true);
        for(i = 0; i< poll.options.length;i++){
            poll.options[i].option = parseMessage(poll.options[i].option,false);
        }
        oldCreatePoll(poll);
    };

}
function toggleTags(){
    filterTags = !filterTags; 
    settings.set('filterTags',filterTags);
}
function toggleNSFWEmotes(){
    if(!NSFWEmotes){
        $codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete $codes.boobies;
        delete $codes.meatspin;
        autocompleteData.splice(autocompleteData.indexOf('/boobies'), 1);
        autocompleteData.splice(autocompleteData.indexOf('/meatspin'), 1);
    }
    NSFWEmotes = !NSFWEmotes;
    settings.set('NSFWEmotes',NSFWEmotes);
}

function parseMessage(message,isChatMessage){
    var emoteFound = false,
        match = message.match(/^((\[[^\]]*\])*)\/([^\[ ]+)((\[.*?\])*)/i),
        emote,
        word;
    //if the text matches [tag]/emote[/tag] or /emote
    if (match &&isChatMessage) {
        emoteFound = true;
        emote = ($codes.hasOwnProperty(match[3].toLowerCase()))?$codes[match[3].toLowerCase()]: "/"+match[3];
        message = "<span class='cm'>" + match[1] + emote + match[4] + "</span>";
    } else {
        var greentext = false;
        //if the text matches [tag]>* or >*
        if (message.match(/^((\[[^\]]*\])*)((&gt;)|>)/) ) {
            greentext = true;
        } else {
            //split up the message and add hashtag colors #SWAG #YOLO
            var words = message.split(" ");
            for (var i = 0; i < words.length; i++) {
                if (words[i][0] == "#") {
                    words[i] = "<span class='cm hashtext'>" + words[i] + "</span>";
                }
            }
            //join the message back together
            message = words.join(" ");
        }
        if (greentext) {
            message = "<span class='cm greentext'>" + message + "</span>";
        } else {
            message = "<span class='cm'>" + message + "</span>";
        }
    }
    if(!isChatMessage){
        //filter all emotes
        message = parseEmotes(message);
    }
    //filter words
    for (word in filteredwords) {
        message = message.replace(new RegExp(word, 'g'), filteredwords[word]);
    }
    //filter tags
    for (word in tags) {
        message = message.replace(new RegExp(word, 'gi'),function(){return (filterTags)?tags[word]:'';});
    }    
    //filter advancedTags
    for (word in advancedTags) {
        message = message.replace(new RegExp(advancedTags[word], 'g'),
            function(match, m1, m2){
                var ret = '';
                switch(word){
                    case 'hexcolor': ret = '<span style="color:' +m1+ '">';break;
                    case 'marquee' : ret = '<MARQUEE behavior="scroll" direction='+(m1?"left":"right")+' width="100%" scrollamount="'+ m2 +'">'; break;
                    case 'alternate': ret = '<MARQUEE behavior="alternate" direction="right" width="100%" scrollamount="'+ m1 +'">'; break;
                }
                return (filterTags)?ret:'';
            });
    }
    //remove unnused tags [asd] if there is a emote
    if(emoteFound && isChatMessage){
        message = message.replace(/\[[^\]]*\]/, '');
    }
    
    return message;
}

//parse multiple emotes in a message
 function parseEmotes(message){
    var possibleEmotes = [],
        exactMatches = [],
        emoteStart = -1,
        emote = '',
        end = false,
        i,
        j,
        code;
    
    while(!end){
        emoteStart = message.indexOf('/',emoteStart+1);
        if(emoteStart == -1){
            end = true;
        }else{
            possibleEmotes = Object.keys($codes);
            exactMatches = [];
            emote = '';
            for(i = emoteStart+1; i< message.length;i++){
                emote += message[i];

                for(j = 0; j < possibleEmotes.length;j++){
                    if(emote.indexOf(possibleEmotes[j]) == 0 ){
                        exactMatches.push(possibleEmotes[j]);
                        possibleEmotes.splice(j,1);
                        j--;
                        continue;
                    }
                    if(possibleEmotes[j].indexOf(emote) != 0){
                        possibleEmotes.splice(j,1);
                        j--;
                    }
                }
                if(possibleEmotes.length == 0){
                    break;
                }
            }
            if(exactMatches.length != 0){
                code = $codes[exactMatches[exactMatches.length-1]];
                message = message.substring(0,emoteStart) + code + message.substring(emoteStart+exactMatches[exactMatches.length-1].length+1);
                i=emoteStart+ code.length;
            }
            emoteStart = i-1;

        }
    }
    return message;
}
function toggleNSFWEmotes(){
    if(!NSFWEmotes){
        $codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete $codes.boobies;
        delete $codes.meatspin;
        autocompleteData.splice(autocompleteData.indexOf('/boobies'), 1); 
        autocompleteData.splice(autocompleteData.indexOf('/meatspin'), 1); 
    }
    NSFWEmotes = !NSFWEmotes;
    settings.set('NSFWEmotes',NSFWEmotes);
}

var filterTags = true,
    NSFWEmotes = false,
    filteredwords = {
    "skip": "upvote",
    "SKIP": "UPVOTE",
    "gay" : "hetero",
    "GAY" : "HETERO"
},
    advancedTags = {
       'hexcolor': '\\[(#[0-9A-F]{1,6})\\]',
       'marquee': '\\[marquee(-)?(\\d{1,2})\\]',
       'alternate': '\\[alt(\\d{1,2})\\]'
    },
    tags = {
    '\\[black\\]': '<span style="color:black">',
    '\\[/black\\]': '</span>',
    '\\[blue\\]': '<span style="color:blue">',
    '\\[/blue\\]': '</span>',
    '\\[darkblue\\]': '<span style="color:darkblue">',
    '\\[/darkblue\\]': '</span>',
    '\\[cyan\\]': '<span style="color:cyan">',
    '\\[/cyan\\]': '</span>',
    '\\[red\\]': '<span style="color:red">',
    '\\[/red\\]': '</span>',
    '\\[green\\]': '<span style="color:green">',
    '\\[/green\\]': '</span>',
    '\\[darkgreen\\]': '<span style="color:darkgreen">',
    '\\[/darkgreen\\]': '</span>',
    '\\[violet\\]': '<span style="color:violet">',
    '\\[/violet\\]': '</span>',
    '\\[purple\\]': '<span style="color:purple">',
    '\\[/purple\\]': '</span>',
    '\\[orange\\]': '<span style="color:orange">',
    '\\[/orange\\]': '</span>',
    '\\[blueviolet\\]': '<span style="color:blueviolet">',
    '\\[/blueviolet\\]': '</span>',
    '\\[brown\\]': '<span style="color:brown">',
    '\\[/brown\\]': '</span>',
    '\\[deeppink\\]': '<span style="color:deeppink">',
    '\\[/deeppink\\]': ' </span>',
    '\\[aqua\\]': '<span style="color:aqua">',
    '\\[/aqua\\]': '</span>',
    '\\[indigo\\]': '<span style="color:indigo">',
    '\\[/indigo\\]': '</span>',
    '\\[pink\\]': '<span style="color:pink">',
    '\\[/pink\\]': '</span>',
    '\\[chocolate\\]': '<span style="color:chocolate">',
    '\\[/chocolate\\]': '</span>',
    '\\[yellowgreen\\]': '<span style="color:yellowgreen">',
    '\\[/yellowgreen\\]': '</span>',
    '\\[steelblue\\]': '<span style="color:steelblue">',
    '\\[/steelblue\\]': '</span>',
    '\\[silver\\]': '<span style="color:silver">',
    '\\[/silver\\]': '</span>',
    '\\[tomato\\]': '<span style="color:tomato">',
    '\\[/tomato\\]': '</span>',
    '\\[tan\\]': '<span style="color:tan">',
    '\\[/tan\\]': '</span>',
    '\\[royalblue\\]': '<span style="color:royalblue">',
    '\\[/royalblue\\]': '</span>',
    '\\[navy\\]': '<span style="color:navy">',
    '\\[/navy\\]': '</span>',
    '\\[yellow\\]': '<span style="color:yellow">',
    '\\[/yellow\\]': '</span>',
    '\\[white\\]': '<span style="color:white">',
    '\\[/white\\]': '</span>',

    '\\[/span\\]': '</span>',
    '\\[/\\]': '</span>',

    '\\[rmarquee\\]': '<marquee>',
    '\\[/rmarquee\\]': '</marquee>',
    '\\[alt\\]': '<marquee behavior="alternate" direction="right">',
    '\\[/alt\\]': '</marquee>',
    '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">',
    '\\[/falt\\]': '</marquee>',
    '\\[marquee\\]': '<marquee direction="right">',
    '\\[/marquee\\]': '</marquee>',
    '\\[rsanic\\]': '<MARQUEE behavior="scroll" direction="left" width="100%" scrollamount="50">',
    '\\[/rsanic\\]': '</marquee>',
    '\\[sanic\\]': '<MARQUEE behavior="scroll" direction="right" width="100%" scrollamount="50">',
    '\\[/sanic\\]': '</marquee>',
    '\\[spoiler\\]' : "<span style=\"background-color: #000;\" onmouseover=\"this.style.backgroundColor='#FFF';\" onmouseout=\"this.style.backgroundColor='#000';\">",
    '\\[/spoiler\\]': '</span>',

    '\\[i\\]': '<span style="font-style:italic">',
    '\\[/i\\]': '</span>',
    '\\[italic\\]': '<span style="font-style:italic">',
    '\\[/italic\\]': '</span>',
    '\\[strike\\]': '<strike>',
    '\\[/strike\\]': '</strike>',
    '\\[strong\\]': '<strong>',
    '\\[/strong\\]': '</strong>'
};


beforeConnectFunctions.push(loadMessageFilter);
//----------------- end  messagefilter.js-----------------
//-----------------start modSpy.js-----------------
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

function loadModSpy(){
	//load settings
	modSpy = settings.get('modSpy','false');
	
	//add command
    commands.set('addOnSettings',"ModSpy",toggleModSpy);

	// Overwriting console.log
	var oldLog = console.log, 
		oldMoveVideo = moveVideo,
		filterList = [
			/^Resynch requested\.\./,
			/cleaned the playlist/,
			/Using HTML5 player is not recomended\./
		],
		filter,
		i;

	console.log = function (message) {
		// We don't want the cleaning messages in the chat (Ok in the console) .
		if (modSpy && message && message.match)
		{
			filter = false;
			for (i = 0; i < filterList.length; i++) {
				if(message.match(filterList[i])){
					filter = true;
					break;
				}
			}
			if(!filter){
				if (message.match(/ moved a video/g) && bumpCheck)
				{
					message = message.replace("moved","bumped");
					bumpCheck = false;
				}
				addMessage('', message, '','hashtext');   
			}
		}
		oldLog.apply(console,arguments);
	};

	// Overwriting moveVideo to differentiate bump and move
	moveVideo = function(vidinfo, position) {
		var oldPosition = getVideoIndex(vidinfo);
		oldMoveVideo(vidinfo,position);
		
		if ( Math.abs(getActiveVideoIndex()-position) <= 10 && Math.abs(oldPosition-position) > 10){ // "It's a bump ! " - Amiral Ackbar
			bumpCheck = true;
		}
	};

}	
function toggleModSpy(){
	modSpy = !modSpy; 
	settings.set('modSpy',modSpy);
}
var modSpy = false,
	bumpCheck = false;

beforeConnectFunctions.push(loadModSpy);
//----------------- end  modSpy.js-----------------
//-----------------start nameAutocomplete.js-----------------
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


function loadNameAutocomplete() {
    $("#chat input").bind('keydown',function(event){
        
        if(event.keyCode == 9){//tab
            //prevent loosing focus from input
            event.preventDefault();
            //split the message
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length-1].match(/^((\[[^\]]*\])*\[?@?)([\w-]+)/),
                name,
                data,
                partToComplete = '',
                username,
                i,
                j,
                sub;
            if(!messagetags || !messagetags[3]){
                return;
            }
            if(!messagetags[1]){
                 messagetags[1] = '';
            }
            
            //make a regex out of the name
            name = new RegExp('^'+messagetags[3],'i');

            //find matching users
            for(i = 0; i< users.length;i++){
                username = users[i].username;
                if(username.match(name)){
                    if(partToComplete == ''){
                        partToComplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(j = partToComplete.length; j>=0 ;j--){
                            sub = partToComplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                partToComplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(partToComplete != ''){
                //put messagetags and the autocompleted name back into the message
                message[message.length-1] =messagetags[1] + partToComplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

beforeConnectFunctions.push(loadNameAutocomplete);
//----------------- end  nameAutocomplete.js-----------------
//-----------------start nameNotification.js-----------------
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

function loadNameNotification(){
    var oldAddMessage = addMessage;

    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        //continue with InstaSynch's addMessage function
        oldAddMessage(username, message, userstyle, textstyle);
        if(!newMsg){
            return;
        }
        var possibleNames = [],
            exactMatches = [],
            nameStart = -1,
            name = '',
            end = false,
            i,
            j;
        
        while(!end){
            nameStart = message.indexOf('@',nameStart+1);
            if(nameStart == -1){
                end = true;
            }else{
                possibleNames = getUsernameArray(true);
                exactMatches = [];
                name = '';
                for(i = nameStart+1; i< message.length;i++){
                    name += message[i].toLowerCase();
    
                    for(j = 0; j < possibleNames.length;j++){
                        if(name.indexOf(possibleNames[j]) == 0 ){
                            exactMatches.push(possibleNames[j]);
                            possibleNames.splice(j,1);
                            j--;
                            continue;
                        }
                        if(possibleNames[j].indexOf(name) != 0){
                            possibleNames.splice(j,1);
                            j--;
                        }
                    }
                    if(possibleNames.length == 0){
                        break;
                    }
                }
                if(exactMatches.length != 0){
                    if(thisUsername === exactMatches[exactMatches.length-1]){
                        toggleNotify();
                    }
                }
                nameStart = i-1;
            }
        }
    };
   $('#cin').focus(function () {
        toggleNotify();
    });
}
var notified = false;

function toggleNotify(){
    if(window.newMsg && !notified){
        $('head > link:last-of-type')[0].href = 'https://github.com/Bibbytube/Instasynch/blob/master/Chat%20Additions/Name%20Notification/notificationFavicon.ico?raw=true';
        $('#chat_list').scrollTop($('#chat_list').scrollTop()-5);
        notified = true;
    }else{
        $('head > link:last-of-type')[0].href = 'http://instasynch.com/favicon.ico';
        notified = false;
    }
}

beforeConnectFunctions.push(loadNameNotification);
//----------------- end  nameNotification.js-----------------
//-----------------start OnClickKickBan.js-----------------
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

function loadOnClickKickBan(){
    if(!isUserMod()){
        return;
    }
    var oldAddMessage = addMessage;

    //overwrite InstaSynch's  addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        
        oldAddMessage(username, message, userstyle, textstyle);
        //only add the onclick events if the user is a mod and its not a system message
        if(username != ''){
            var currentElement,
                //the cursor doesnt need to be changed if the key is still held down
                isCtrlKeyDown = false,
                keyDown = 
                function(event){
                    if(!isCtrlKeyDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                        isCtrlKeyDown = true;
                        currentElement.css( 'cursor', 'pointer' );
                    }
                },
                keyUp = 
                function(event){
                    if(isCtrlKeyDown && !event.ctrlKey){
                        isCtrlKeyDown = false;
                        currentElement.css('cursor','default');
                    }
                };
            //add the events to the latest username in the chat list
            $('#chat_list > span:last-of-type').prev()
            .on('click', function(event){
                if(event.ctrlKey){
                    var user = $(this)[0].innerHTML,
                        userFound = false,
                        isMod = false,
                        userId,
                        i;
                    user = user.match(/([^ ]* - )?([\w_-]*):/)[2];
                    for(i = 0; i< users.length;i++){
                        if(users[i].username === user ) {
                            if(users[i].permissions > 0){
                                isMod = true;
                                break;
                            }
                            userId = users[i].id;
                            userFound = true;
                            break;
                        }
                    }       
                    if(event.altKey){
                        if(isMod){
                            addMessage('', "Can't ban a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                sendcmd('ban', {userid: userId});    
                                addMessage('', 'b& user: '+user, '', 'hashtext');
                            }else{
                                sendcmd('leaverban', {username: user});    
                                addMessage('', 'Leaverb& user: '+user, '', 'hashtext');
                            }
                        }
                    }else{          
                    if(isMod){
                            addMessage('', "Can't kick a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                sendcmd('kick', {userid: userId});   
                                addMessage('', 'Kicked user: '+user, '', 'hashtext');
                            }else{
                                addMessage('', "Didn't find the user", '', 'hashtext');
                            }
                        }
                    }
                }
            })        
            .hover(
            function(event){
                currentElement = $(this);
                $(document).bind('keydown',keyDown);
                $(document).bind('keyup',keyUp);
            },function(){       
                currentElement.css('cursor','default');
                isCtrlKeyDown = false;
                $(document).unbind('keydown',keyDown);
                $(document).unbind('keyup',keyUp);
            });
        }
    };
    var chatCtrlDown = false,
        chatKeyDown = function (event) {
            if(!chatCtrlDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                $('#chat_list').scrollTop($('#chat_list').scrollTop()-5);
                chatCtrlDown = true;
            }
        },
        chatKeyUp = function (event) {
            if(chatCtrlDown && !event.ctrlKey){
                $('#chat_list').scrollTop($('#chat_list')[0].scrollHeight);
                chatCtrlDown = false;
            }
        };
    $('#chat_list').hover(
        function(){
            $(document).bind('keydown',chatKeyDown);
            $(document).bind('keyup',chatKeyUp);
        },function(){       
            chatCtrlDown = false;
            $(document).unbind('keydown',chatKeyDown);
            $(document).unbind('keyup',chatKeyUp);
    });
}

afterConnectFunctions.push(loadOnClickKickBan);
//----------------- end  OnClickKickBan.js-----------------
//-----------------start playMessages.js-----------------
/*
    Copyright (C) 2013 fugXD

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

function loadPlayMessages(){
    //load settings
    playMessages = settings.get('playMessages','true');
    
    //add the command
    commands.set('addOnSettings',"playMessages",togglePlayMessages);
    
    // Overwriting Adduser
    var oldPlayVideo = playVideo;

    playVideo = function(vidinfo, time, playing) {
        // Only if blackname or mod
        if (playMessages){
            indexOfVid = getVideoIndex(vidinfo);
            title = playlist[indexOfVid].title;
            addMessage('', 'Now playing: ' + title, '','hashtext'); 
        }
        oldPlayVideo(vidinfo, time, playing);
    };
}

var playMessages = true;

function togglePlayMessages(){
    playMessages = !playMessages;
    settings.set('playMessages',playMessages);
}

afterConnectFunctions.push(loadPlayMessages);
//----------------- end  playMessages.js-----------------
//-----------------start timestamp.js-----------------
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


function loadTimestamp(){
    //load settings
    addTimestamp = settings.get('addTimestamp','true');

    //add the commands
    commands.set('addOnSettings',"Timestamp",toggleTimestamp);

    var oldAddMessage = addMessage,
        date,
        hours,
        minutes;

    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        if(addTimestamp){
            date = new Date();
            minutes = date.getMinutes();
            if(minutes < 10){
                minutes = "0" + minutes;
            }
            hours = date.getHours();
            if(hours < 10){
                hours = "0" + hours;
            }
            username = hours + ":" + minutes + " - " + username;
        }
        oldAddMessage(username, message, userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };
}
function toggleTimestamp(){
    addTimestamp = !addTimestamp; 
    settings.set('addTimestamp',addTimestamp);
}
var addTimestamp = true;

beforeConnectFunctions.push(loadTimestamp);
//----------------- end  timestamp.js-----------------
//-----------------start botCommands.js-----------------
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

function loadBotCommands(){
    var emptyFunc = function (){};

     commands.set('modCommands',"$autoclean",emptyFunc);
     commands.set('modCommands',"$addRandom ",emptyFunc);
     commands.set('modCommands',"$addToUserBlacklist ",emptyFunc);
     commands.set('modCommands',"$addToVideoBlacklist ",emptyFunc);
     commands.set('modCommands',"$addAutobanMessage ",emptyFunc);
     commands.set('modCommands',"$clearAutobanMessages",emptyFunc);
     commands.set('modCommands',"$voteBump ",emptyFunc);
     commands.set('modCommands',"$shuffle ",emptyFunc);
     commands.set('modCommands',"$exportUserBlacklist",emptyFunc);

     commands.set('regularCommands',"$translateTitle",emptyFunc);
     commands.set('regularCommands',"$greet",emptyFunc);
     commands.set('regularCommands',"$derka ",emptyFunc);
     commands.set('regularCommands',"$ask ",emptyFunc);
     commands.set('regularCommands',"$askC ",emptyFunc);
     commands.set('regularCommands',"$askJ ",emptyFunc);
     commands.set('regularCommands',"$eval ",emptyFunc);
     commands.set('regularCommands',"$emotes",emptyFunc);
     commands.set('regularCommands',"$script",emptyFunc);
     commands.set('regularCommands',"$wolfram ",emptyFunc);
     commands.set('regularCommands',"$8Ball ",emptyFunc);
     commands.set('regularCommands',"$roll ",emptyFunc);
     commands.set('regularCommands',"$quote ",emptyFunc);
     commands.set('regularCommands',"$help ",emptyFunc);
     commands.set('regularCommands',"$stats",emptyFunc);
     commands.set('regularCommands',"$skiprate",emptyFunc);
     commands.set('regularCommands',"$mostPlayed",emptyFunc);
     commands.set('regularCommands',"$exportPlaylist ",emptyFunc);
}

beforeConnectFunctions.push(loadBotCommands);
//----------------- end  botCommands.js-----------------
//-----------------start bump.js-----------------
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

function loadBumpCommand(){
    commands.set('modCommands',"bump ",bump);
}

function bump(params){
    var user = params[1],
        bumpIndex = -1,
        i;
    
    if(!user){
        addMessage('','No user specified: \'bump [user]','','hashtext');
        return;
    }
    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            bumpIndex = i;
            break;
        }
    }
    if (bumpIndex === -1){
        addMessage('',"The user didn't add any videos",'','hashtext');
    }else{
        sendcmd('move', {info: playlist[bumpIndex].info, position: getActiveVideoIndex()+1});
    }
}


beforeConnectFunctions.push(loadBumpCommand);
//----------------- end  bump.js-----------------
//-----------------start clearChat.js-----------------
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


function loadClearChatCommand(){
    commands.set('regularCommands',"clearChat",clearChat);
}

function clearChat(){
	$('#chat_list').empty();
	messages = 0;
}


beforeConnectFunctions.push(loadClearChatCommand);
//----------------- end  clearChat.js-----------------
//-----------------start commandFloodProtect.js-----------------
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

function loadCommandFloodProtect(){
    var oldsendcmd = sendcmd;
    sendcmd = function sendcmd(command, data){
        if(command){
            //add the command to the cache
            commandCache.push({command:command,data:data});
        }
        //are we ready to send a command?
        if(sendcmdReady){
            if(commandCache.length !== 0){
                //set not ready
                sendcmdReady = false;
                //send the command
                oldsendcmd(commandCache[0].command,commandCache[0].data);
                //remove the sent command
                commandCache.splice(0,1);
                //after 400ms send the next command
                setTimeout(function(){sendcmdReady = true;sendcmd();},400);
            }
        }
    };
}

var sendcmdReady = true,
    commandCache = [];
    
beforeConnectFunctions.push(loadCommandFloodProtect);
//----------------- end  commandFloodProtect.js-----------------
//-----------------start commandLoader.js-----------------
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

function loadCommandLoader(){
    commands = new function() {
        var items = {};
        items.regularCommands = [
            "'reload",
            "'resynch",
            "'toggleFilter",
            "'toggleAutosynch",
            "'mute",
            "'unmute"
        ]; 
        items.modCommands = [
            "'togglePlaylistLock",
            "'ready",
            "'kick ",
            "'ban ",
            "'unban ",
            "'clean",
            "'remove ",
            "'purge ",
            "'move ",
            "'play ",
            "'pause",
            "'resume",
            "'seekto ",
            "'seekfrom ",
            "'setskip ",
            "'banlist",
            "'modlist",
            "'save",
            "'leaverban ",
            //commented those so you can't accidently use them
            //"'clearbans",
            //"'motd ",
            //"'mod ",
            //"'demod ",
            //"'description ",
            "'next"
        ];
        items.addOnSettings = [];
        items.commandFunctionMap = {};
        return {
            "set": function(arrayName, funcName, func) {
                if(funcName[0] !== '$'){
                    if(arrayName === 'addOnSettings'){
                        funcName = "~"+funcName;
                    }else{
                        funcName = "'"+funcName;
                    }
                }
                items[arrayName].push(funcName);
                items.commandFunctionMap[funcName.toLowerCase()] = func;
            },
            "get": function(arrayName) {
                return items[arrayName];
            },
            "getAll":function(){
                return items;
            },
            "execute":function(funcName, params){
                commandExecuted = false;
                funcName = funcName.toLowerCase();
                if(funcName[0] === '$'){
                    return;
                }
                if(items.commandFunctionMap.hasOwnProperty(funcName)){
                    items.commandFunctionMap[funcName](params);
                    commandExecuted = true;
                }
                funcName = funcName +' ';
                if(items.commandFunctionMap.hasOwnProperty(funcName)){
                    items.commandFunctionMap[funcName](params);
                    commandExecuted = true;
                }
            }
        };
    };    

    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var params = $(this).val().split(' ');
            commands.execute(params[0],params);
        }
    });
}
var commands;
    commandExecuted = false;
//----------------- end  commandLoader.js-----------------
//-----------------start purgeTooLong.js-----------------
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

function loadPurgeTooLongCommand(){
    commands.set('modCommands',"purgeTooLong ",purgeTooLong);
}

function purgeTooLong(params){
    var maxTimeLimit = params[1]?parseInt(params[1])*60:60*60,
        videos = [],
        i;

    //get all Videos longer than maxTimeLimit
    for (i = 0; i < playlist.length; i++) {
        if(playlist[i].duration >= maxTimeLimit){
            videos.push({info:playlist[i].info, duration:playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    }
    videos.sort(compareVideos);

    for (var i = 0; i < videos.length; i++) {
        sendcmd('remove', {info: videos[i].info});
    }
}

beforeConnectFunctions.push(loadPurgeTooLongCommand);
//----------------- end  purgeTooLong.js-----------------
//-----------------start removeLast.js-----------------
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


function loadRemoveLast(){
    commands.set('modCommands',"removeLast ",removeLast);
}


// Remove the last video from the user 
function removeLast(params){
    if(!params[1]){
        addMessage('','No user specified: \'removeLast [user]','','hashtext');
        return;
    }
	var user = params[1],
		removeIndex = -1,
    	i;

	// Look for the user last added video
    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            removeIndex = i;
            break;
        }
    }
	
	if (removeIndex === -1){
		addMessage('',"The user didn't add any video",'','hashtext');
	}else{
		sendcmd('remove', {info: playlist[removeIndex].info});
	}
		
}
		
beforeConnectFunctions.push(loadRemoveLast);
//----------------- end  removeLast.js-----------------
//-----------------start shuffle.js-----------------
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

function loadShuffleCommand(){
    commands.set('modCommands',"shuffle ",shuffle);
}

function shuffle(params){
    var user = params[1],
        i,
        shuffleList = [];
    for (i = getActiveVideoIndex()+1; i<playlist.length; i++) {
        if(!user || playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            shuffleList.push({i: i, info: playlist[i].info});
        }
    }
    var tempInfo,randIndex,newPosition;
    for(i = 0; i< shuffleList.length;i++){
        randIndex = Math.floor(Math.random()*shuffleList.length);
        tempInfo = shuffleList[i].info;
        newPosition = shuffleList[randIndex].i;
        sendcmd('move', {info: tempInfo, position: newPosition});
    }
}


beforeConnectFunctions.push(loadShuffleCommand);
//----------------- end  shuffle.js-----------------
//-----------------start skip.js-----------------
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

function loadSkipCommand(){
    commands.set('regularCommands',"skip ",skip);
}

function skip(){	
	sendcmd("skip", null);
}

beforeConnectFunctions.push(loadSkipCommand);
//----------------- end  skip.js-----------------
//-----------------start trimWall.js-----------------
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

function loadTrimWallCommand(){
    commands.set('modCommands',"trimWall ",trimWall);
}

function trimWall(params){
    if(!params[1]){
        addMessage('','No user specified: \'trimWall [user] [maxMinutes]','','hashtext');
        return;
    }
    resetWallCounter();
    var user = params[1],
        maxTimeLimit = params[2]?parseInt(params[2])*60:60*60,
        currentTime = wallCounter[user],
        videos = [],
        i;

    if(currentTime < maxTimeLimit){
        addMessage('','The wall is smaller than the timelimit','','hashtext');
        return;
    }
    //get all Videos for the user
    for (i = 0; i < playlist.length; i++) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            videos.push({info:playlist[i].info, duration:playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    }
    // function rmVideo(index, vidinfo){
    //     setTimeout(
    //         function(){
    //             sendcmd('remove', {info: vidinfo});
    //         }, 
    //         (index+1) * 750);
    // }
    //sort the array so we will get the longest first
    videos.sort(compareVideos);

    for (i = 0; i < videos.length && currentTime > maxTimeLimit; i++) {
        currentTime-= videos[i].duration;
        // rmVideo(i,videos[i].info);
        //delay via commandFloodProtect.js
        sendcmd('remove', {info: videos[i].info});
    }
}

beforeConnectFunctions.push(loadTrimWallCommand);
//----------------- end  trimWall.js-----------------
//-----------------start votePurge.js-----------------
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

function loadVotePurgeCommand(){
    commands.set('modCommands',"votepurge ",votePurge);
}

function votePurge(params)
{
	var user = params[1],
		poll = new Object(),
		option;
				
	if (!user){
        addMessage('','No user specified: \'votePurge [user]','','hashtext');
		return;
	}
	
	poll.title = "Should we purge " + user + " ? /babyseal";
	poll.options = new Array();
	option = "Yes !";
	poll.options.push(option);
	option = "No !";
	poll.options.push(option);
	
	sendcmd("poll-create", poll);
}

beforeConnectFunctions.push(loadVotePurgeCommand);
//----------------- end  votePurge.js-----------------
//-----------------start description.js-----------------
/*
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
 
function loadDescription(){
    if(!isBibbyRoom()){
        return;
    }
    var descr="";
    descr += "<p style=\"font-family: Palatino; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong style=\"font-size: 20pt; \">Bibbytube<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 16pt; text-align: center; \">";
    descr += "  <strong>instasynch&#39;s most <img src=\"http:\/\/i.imgur.com\/L1Nuk.gif\" \/> room<\/strong><\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"font-size: 14pt; \">Playlist is always unlocked, so add videos for everyone to watch.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\">New content\/OC is appreciated.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 12pt; text-align: center; \">";
    descr += "  Note: Many of our videos are NSFW.<\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 18pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong>Rules&nbsp;<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  1. No RWJ, Ponies, or Stale Videos. &nbsp;Insta-skip<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  2. BEGGING FOR SKIPS IS FOR GAYLORDS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  3. &nbsp;NO SEAL JOKES<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  If your video gets removed and shouldn't have been, try adding it later.<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  MODS=GODS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399; font-family: Palatino; font-size: 18pt; \">Rules for the Reading Impaired<\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesEnglish.mp3\"><img src=\"http:\/\/i.imgur.com\/LIXqI5Q.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesDutch.mp3\"><img src=\"http:\/\/i.imgur.com\/giykE7C.jpg?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesFrench.mp3\"><img src=\"http:\/\/i.imgur.com\/BucOmRs.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesGerman.mp3\"><img src=\"http:\/\/i.imgur.com\/bTwmX9v.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesSpanish.mp3\"><img src=\"http:\/\/i.imgur.com\/aZvktnt.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399;\"><span style=\" font-family: Palatino; font-size: 18pt; \">Connect with Bibbytube in other ways!<\/span><\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/steamcommunity.com\/groups\/Babbytube\"><img src=\"http:\/\/i.imgur.com\/AZHszva.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/facebook.com\/babbytube\"><img src=\"http:\/\/i.imgur.com\/NuT2Bti.png?4\" \/><\/a><a href=\"http:\/\/twitter.com\/bibbytube_\/\"><img src=\"http:\/\/i.imgur.com\/T6oWmfB.png?4\" \/><\/a><\/p>";
    descr += "<script type=\"text\/javascript\" src=\"http:\/\/script.footprintlive.com\/?site=www.synchtube.com\"><\/script><noscript><a href=\"http:\/\/www.footprintlive.com\" target=\"_blank\"><img src=\"http:\/\/img.footprintlive.com\/?cmd=nojs&site=www.synchtube.com\" alt=\"user analytics\" border=\"0\"><\/a><\/noscript>";
    $("div.roomFooter ").html(descr);
}
 
 
beforeConnectFunctions.push(loadDescription);
//----------------- end  description.js-----------------
//-----------------start general.js-----------------
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
    addMessage('', '<strong>Scripts loaded. Recent changes:<br>'+
                    '&bull; PlayMessages (turn off with ~PlayMessages) <br>'+
                    '&bull; BigPlaylist: bigger playlist with thumbnails (turn off with ~BigPlaylist) <br>'+
                    '&bull; \'Shuffle: shuffles a wall or the playlist <br>'+
                    '&bull; \'History: shows the last 9 videos <br>'+
                    '&bull; Timestamps: (turn off with ~Timestamp) <br>'+
                    '&bull; YouTube Search: type the search term into the add video field <br>'+
                    '&bull; Notifications: the favicon on the browser tab will change when someone says your name like @username</strong>','' ,'hashtext'); 
    addMessage('','<font color="#FF0000">If you are having issues with the playlist loading please load the script again from https://raw.github.com/Bibbytube/Instasynch/master/loadAll.js<font>','','hashtext');
}
function getActiveVideoIndex(){
    return $('.active').index();
}

function isUserMod(){
    return window.isMod;
}

function isBibbyRoom(){
    return ROOMNAME.match(/bibby/i)?true:false;
}

function getIndexOfUser(id){
    var i;
    for (i = 0; i < users.length; i++){
        if (id === users[i].id){
            return i;
        }
    }
    return -1;
}

function getUsernameArray(lowerCase){
    var arr = [];
    for(i = 0; i< users.length;i++){
        if(users[i].username !== 'unnamed'){
            if(!lowerCase){
                arr.push(users[i].username);
            }else{
                arr.push(users[i].username.toLowerCase());
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
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
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

function openInNewTab(url){
    var win=window.open(url, '_blank');
    win.focus();
}
//----------------- end  general.js-----------------
//-----------------start greynameCount.js-----------------
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

function loadGreynameCount(){
    var oldAddUser = addUser,
        oldRemoveUser = removeUser;

    addUser = function addUser(user, css, sort) {
        oldAddUser(user, css, sort);
        setViewerCount();
    };    
    removeUser = function removeUser(id) {
        oldRemoveUser(id);
        setViewerCount();
    };
    setViewerCount();
}
function setViewerCount(){
    var greynameCount = 0,
        i;
    for (i = 0; i < users.length; i++) {
        if(!users[i].loggedin){
            greynameCount++;
        }
    };
    $('#viewercount').html(users.length-greynameCount + '/' +greynameCount);
}

beforeConnectFunctions.push(loadGreynameCount);
//----------------- end  greynameCount.js-----------------
//-----------------start leaderseal.js-----------------
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

function loadLeaderSeal(){
    var oldMakeLeader = makeLeader;
    makeLeader = function(userId){
        oldMakeLeader(userId);
        $("#leaderSymbol").attr("src","/favicon.ico");
    };
}

beforeConnectFunctions.push(loadLeaderSeal);
//----------------- end  leaderseal.js-----------------
//-----------------start pollseal.js-----------------
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

function loadPollSeal(){
	//$(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/RegularSeal.png) 0 0 #DFDFDF" );
    //$(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/ChristmasSeal.png) 0 0 #DFDFDF" );
    $(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/NewYearSeal.png) 0 0 #DFDFDF" );

	$(".st-poll").css( "background-size", "auto 100%");
	$(".st-poll").css( "background-repeat", "no-repeat");
	$(".st-poll").css( "background-position", "center");
}

beforeConnectFunctions.push(loadPollSeal);
//----------------- end  pollseal.js-----------------
//-----------------start priorityLoad.js-----------------
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
//Scripts that need to be loaded first
function loadPriorityScripts(){
    loadGeneralStuff();
    loadCommandLoader();
    loadSettingsLoader();
    loadBigPlaylist();
}

beforeConnectFunctions.splice(0,0,loadPriorityScripts);
//----------------- end  priorityLoad.js-----------------
//-----------------start settingsLoader.js-----------------
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

function loadSettingsLoader(){
    var cookieName = 'InstaSynch Addons Settings',
        expire = { expires: 10*365 }; //settings expire in 10 years
    commands.set('regularCommands',"printAddOnSettings",printAddonSettings);
    //slightly changed version of this: http://stackoverflow.com/a/1960049, so it saves a hashmap rather than just a array
    settings = new function() {
        var cookie = $.cookie(cookieName),
            array = cookie ? cookie.split(/,/):[],
            items = {},
            i;
    
        for(i = 0; i<array.length;i+=2){
            items[array[i]] = array[i+1];
        }
    
        return {
            "set": function(key, val) {
                if(!items.hasOwnProperty(key)){
                    array.push(key);
                    array.push(val);
                }else{
                    i = array.indexOf(key);
                    array[i+1] = val; 
                }
                items[key] = val;
                addMessage('', "["+key+": "+val+"] ", '', 'hashtext');
                $.cookie(cookieName, array.join(','),expire);
            },
            "remove": function (key) { 
    
                i = array.indexOf(key); 
                if(i!=-1) array.splice(i, 2); 
    
                delete items[key];
                $.cookie(cookieName, array.join(','),expire);        
            },
            "clear": function() {
                array = [];
                items = {};
                //clear the cookie.
                $.cookie(cookieName, null);
            },
            "get": function(key, val) {
                if(!items[key] && val){
                    settings.set(key, val);
                }
                //Get all the array.
                return items[key] === 'false'?false:true;
            },
            "getAll": function() {
                return items;
            }
        };
    };
}
var settings;


function printAddonSettings(){
    var output ="",
        key;
    for(key in settings.getAll()){
        output += "["+key+": "+settings.get(key)+"] ";
    }
    addMessage('', output, '', 'hashtext');
}
//----------------- end  settingsLoader.js-----------------
//-----------------start youtubeSearch.js-----------------
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


var resultsPerPage = 9,
    indexOfSearch,
    entries = [],
    partialEntries = [],
    isPlaylist,
    startIndex = 1,
    searchTimeout;

// Search results container
var divresults = document.createElement("div");
divresults.id = "searchResults";
applyStyle(divresults);

// Close button container
var divremove = document.createElement("div");
divremove.id = "divclosesearch";
applyStyle(divremove);

// "Moar" link container
var divmore = document.createElement("div");
divmore.id = "divmore";

// Getting poll container's parent to insert search result container
var divpolls = document.getElementsByClassName("poll-container")[0];
var divpollparent = divpolls.parentNode;
divpollparent.insertBefore(divresults,divpolls);


// Setting events on the URL input
$("#URLinput").bind("keydown", function(event) {
    if(event.keyCode === $.ui.keyCode.ESCAPE){
        closeResults();
    }else{
        if(searchTimeout){
            clearInterval(searchTimeout);
        }
        searchTimeout = setTimeout(startSearch,500);  
    }
});

function startSearch(){
    searchTimeout = null;
    closeResults();
    search();
}
// Retrieve data from the search query
function search(){
    var query,
        url,
        urlInfo;
    
    query = document.getElementById('URLinput').value;
    if(!query){  // if empty
        return;
    }else{  // is not empty
        urlInfo = parseUrl(query);
        if (!urlInfo){ // is not a link
            isPlaylist = false;
            url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
            $.getJSON(url,
                function(data){
                    var feed = data.feed;
                    entries = feed.entry;
                    showResults(entries,0);
                }
            );
        }else{ // is a link
            if (!urlInfo.playlistId){ // not a playlist
                return;
            }else{ // is a playlist
                entries = [];
                var buildMoreEntries = true;
                startIndex = 1;
                isPlaylist = true;
                while (buildMoreEntries){
                    url = "https://gdata.youtube.com/feeds/api/playlists/" + urlInfo.playlistId + "?v=2&alt=json&max-results=50&start-index=" + startIndex;
                    $.ajax({
                        async: false,
                        url: url,
                        dataType: "json",
                        success: function(data){
                            var feed = data.feed;
                            partialEntries = feed.entry;

                            if (entries.length === 0){
                                entries = partialEntries;
                            }else{
                                entries = entries.concat(partialEntries);
                            }
                            
                            if (partialEntries.length >= 49){
                                startIndex = startIndex + 50;
                            }else{
                                buildMoreEntries = false;
                            }
                        },
                        error: function(){
                            buildMoreEntries = false;
                        }
                    });
                }
                showResults(entries, 0);
            }
        }
    }
}

// Parse data and display it
function showResults(entries, index) {
    indexOfSearch = index;
    var html = [],
        i,
        entry;
  
    $("#searchResults").empty();
    if (entries.length === 0) {
        return;
    }
    for (i = indexOfSearch; i < Math.min(indexOfSearch+resultsPerPage, entries.length); i++) {
        entry = entries[i];
        if (entry.media$group.media$thumbnail !== undefined){ // won't do shit if the video was removed by youtube.
            var date = new Date(null),
                durationSeconds = entry.media$group.yt$duration.seconds, // video duration in seconds
                durationColor = 'white', // color of shown duration
                duration = '', // the displayed duration text
                thumbnailUrl = entry.media$group.media$thumbnail[0].url,
                title = entry.title.$t,
                id,
                link = "http://www.youtube.com/watch?v=";
            if (!isPlaylist){
                var idtag = [];
                idtag = entry.id.$t.split(':');
                id = idtag[3];
            }else{       
                var feedURL = entry.link[1].href,
                    infoURL = parseUrl(feedURL);
                id = infoURL.id;
            }
            if (durationSeconds > 60*15) {
                durationColor = 'orange';
            }
            if (durationSeconds > 60*25) {
                durationColor = 'red';
            }

            // create duration text "12h34m56s", skipping leading zeros for hours and minutes
            date.setSeconds(durationSeconds);
            if (date.getUTCHours() != 0) {
                duration = date.getUTCHours() + 'h';
            }
            if ((date.getUTCMinutes() != 0) || duration) {
                duration += date.getUTCMinutes() + 'm';
            }
            if ((date.getUTCSeconds() != 0) || duration) {
                duration += date.getUTCSeconds() + 's'
            }

            link += id;
            html.push("<div onmouseover='showTitle(this)' onmouseout='hideTitle(this)'>");
            html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px;z-index:2;cursor:pointer;' onClick='addLinkToPl(this)'>");
            html.push("<img src=\"" + thumbnailUrl + "\">");
            html.push("<p  style='position:absolute;top:5px;left:5px;visibility:hidden'>");
            html.push("<span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span>");
            html.push("</p>");
            html.push("<p style='display:none'>" + link + "</p>");
            html.push("<p  style='position:absolute;bottom:0px;right:0px'>");
            html.push("<span style='background:rgba(0, 0, 0, 0.7);color:" + durationColor + "'>" + duration +  "</span>");
            html.push("</p>");
            html.push("</div>");
            html.push("</div>");
        }else{
            html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'> Video Removed By Youtube </div>");
        }
    }
    $(html.join('')).appendTo("#searchResults");
    applyStyle(divmore);
    divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
    divresults.appendChild(divmore);
    divresults.style.display = "block";
    divremove.style.display = "block";
} 

function getNextResultPage() {
    indexOfSearch += resultsPerPage;
    showResults(entries, indexOfSearch);
}

function getPreviousResultPage() {
    indexOfSearch -= resultsPerPage;
    showResults(entries, indexOfSearch);
}

// shows the video title on hover
function showTitle(e){
    var titleToShow = e.firstChild.childNodes[1];
    titleToShow.style.visibility='visible';
}

// hide the video title on mouse out
function hideTitle(e){
    var titleToHide = e.firstChild.childNodes[1];
    titleToHide.style.visibility='hidden';
}
    
// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.childNodes[2].innerHTML,
        addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults(){
    $("#searchResults").empty();
    entries = [];
    partialEntries = [];
    divresults.style.display = "none";
    divremove.style.display = "none";
}

// css thingies
function applyStyle(e){
    if (e.id === "searchResults"){
        divresults.style.cssFloat = "right"; // All but IE
        divresults.style.styleFloat = "right"; //IE
        divresults.style.width = "380px"; 
        divresults.style.marginTop = "10px";
        divresults.style.backgroundColor = "#DFDFDF";
        divresults.style.opacity = "0.9";
        divresults.style.padding = "5px";
        divresults.style.display = "none";
        divresults.style.position = "relative";
    }
    if (e.id === "divclosesearch"){
        divremove.innerHTML = "<img onClick=closeResults() src='http://www.instasynch.com/images/close.png'>";
        divremove.style.cssFloat = "right"; // All but IE
        divremove.style.styleFloat = "right"; //IE
        divremove.style.cursor = "pointer";
        divremove.style.display = "none";
        divremove.style.position = "absolute";
        divremove.style.left = "375px";
        divremove.style.top = "0px";    
    }
    if (e.id === "divmore"){
        var nextDisabled = false;
        var prevDisabled = false;
        prevDisabled = (indexOfSearch > 0) ? '' : 'disabled';
        nextDisabled = (indexOfSearch < entries.length - 9) ? '' : 'disabled';

        divmore.innerHTML = "<input "+ prevDisabled +" type='button' style='cursor:pointer' onClick=getPreviousResultPage() value='&lt&lt Prev'/> </span>";
        divmore.innerHTML += "<input "+ nextDisabled +" type='button' style='cursor:pointer' onClick=getNextResultPage() value='Next &gt&gt'/>";


        divmore.style.textAlign="center";
        //divmore.style.cursor="pointer";
        divmore.style.height="300px";
        divmore.style.width = "380px"; 
        divmore.style.position="relative";
        divmore.style.zIndex="1";
    }
}
//----------------- end  youtubeSearch.js-----------------
//-----------------start mirrorPlayer.js-----------------
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


function loadMirrorPlayer(){
    //load settings
    automaticMirror = settings.get('automaticMirror','true');
    
    //add the command
    commands.set('addOnSettings',"AutomaticPlayerMirror",toggleAutomaticMirrorPlayer);
    commands.set('regularCommands',"mirrorPlayer",toggleMirrorPlayer);

    //appening the class until we got our css files
    //http://stackoverflow.com/a/3434665
    var mirrorClass =".mirror { -moz-transform: scaleX(-1); /* Gecko */ -o-transform: scaleX(-1); /* Operah */ -webkit-transform: scaleX(-1); /* webkit */ transform: scaleX(-1); /* standard */ filter: FlipH; /* IE 6/7/8 */}",
        oldPlayVideo = playVideo,
        indexOfVid,
        title;
    $('<style>'+mirrorClass+'</style>').appendTo('body');


    playVideo = function playVideo(vidinfo, time, playing) {
        indexOfVid = getVideoIndex(vidinfo);
        title = playlist[indexOfVid].title;
        if(containsMirrored(title)){
            if(!isPlayerMirrored){
                toggleMirrorPlayer();
            }
        }else if(isPlayerMirrored){
            toggleMirrorPlayer();
        }
        oldPlayVideo(vidinfo, time, playing);
    };

    //checking the current video after loading the first time
    if(playlist.length != 0){
        setTimeout(function(){
            if(playlist && playlist[getActiveVideoIndex()] && containsMirrored(playlist[getActiveVideoIndex()].title)){
                toggleMirrorPlayer();
            }
        },2500);
    }
}
function containsMirrored(title){
    if(!automaticMirror){
        return false;
    }
    var found = false,
        words = [
            'mirrored',
            'mirror'
        ],
        i;
    for(i = 0; i< words.length;i++){
        if(title.toLowerCase().indexOf(words[i]) !== -1){
            found =true;
            break;
        }
    }

    return found;
}

var automaticMirror = true,
    isPlayerMirrored = false;
function toggleAutomaticMirrorPlayer(){
    automaticMirror = !automaticMirror; 
    settings.set('automaticMirror',automaticMirror);
}

function toggleMirrorPlayer(){
    $('#media').toggleClass('mirror');
    isPlayerMirrored = !isPlayerMirrored;
}

afterConnectFunctions.push(loadMirrorPlayer);
//----------------- end  mirrorPlayer.js-----------------
//-----------------start mousewheelVolumeControl.js-----------------
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

function loadMouseWheelVolumecontrol(){

    autocompleteBotCommands = settings.get('mouseWheelVolumecontrol','true');
    commands.set('addOnSettings',"MouseWheelVolumecontrol",toggleMouseWheelVolumecontrol);
    //TODO: find firefox fix, mousescroll event doesnt fire while over youtube player
    
    //prevent the site from scrolling while over the player
    function preventScroll(event)
    {
        if(mouseWheelVolumecontrol&&mouserOverPlayer){
            event.preventDefault();
            event.returnValue=!mouserOverPlayer;
            if(event.wheelDeltaY < 0){
                globalVolume-=2;
            }else if(event.wheelDeltaY > 0){
                globalVolume+=2;
            }
            globalVolume = (globalVolume<0)?0:(globalVolume>100)?100:globalVolume;
            setVol();
        }
    }
    window.onmousewheel=document.onmousewheel=preventScroll;
    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',preventScroll,false);
    }
    //add hover event to the player
    $('#media').hover(
        function() {
            mouserOverPlayer = true;
        },
        function() {
            mouserOverPlayer = false;
        }
    );

    // var oldLoadYoutubePlayer = loadYoutubePlayer,
    //     oldLoadVimeoVideo = loadVimeoVideo;
    
    //  //overwrite InstaSynch's loadYoutubePlayer
    // loadYoutubePlayer = function loadYoutubePlayer(id, time, playing) {
    //     oldLoadYoutubePlayer(id, time, playing);
    //     //set the globalVolume to the player after it has been loaded
 
    // };    


    // //overwrite InstaSynch's loadVimeoPlayer
    // loadVimeoVideo = function loadVimeoPlayer(id, time, playing) {
    //     oldLoadVimeoVideo(id, time, playing);

    //     //set the globalVolume to the player after it has been loaded
    // };

    var oldPlayVideo = playVideo,
        newPlayer = false;

    playVideo = function playVideo(vidinfo, time, playing){
        oldPlayVideo(vidinfo,time,playing);
        if(oldProvider !== vidinfo.provider){
            newPlayer = true;
            oldProvider = vidinfo.provider;
        }
        if(newPlayer){
            newPlayer = false;
            switch(oldProvider){
                case 'youtube': {
                    var oldAfterReady = $.tubeplayer.defaults.afterReady;
                    $.tubeplayer.defaults.afterReady = function afterReady(k3) {
                    initGlobalVolume();
                    oldAfterReady(k3);
                    };
                }break;
                case 'vimeo':{
                    $f($('#vimeo')[0])['addEvent']('ready',initGlobalVolume);
                }break;
            }
        }
    };
}

var isPlayerRead = false,
    globalVolume = 50,
    mouserOverPlayer = false,
    oldProvider = 'youtube',
    mouseWheelVolumecontrol = true;

function toggleMouseWheelVolumecontrol(){
    mouseWheelVolumecontrol = !mouseWheelVolumecontrol; 
    settings.set('mouseWheelVolumecontrol',mouseWheelVolumecontrol);
}
function initGlobalVolume(){
    if(isPlayerRead){
        setVol();
    }else{
        if(oldProvider === 'youtube'){
            globalVolume = $('#media').tubeplayer('volume');
        }else if(oldProvider === 'vimeo'){
            $f($('#vimeo')[0]).api('getVolume',function(vol){globalVolume = vol*100.0;});
        }   
        isPlayerRead = true;
    }
}
function setVol(){
    if(oldProvider === 'youtube'){
        $('#media').tubeplayer('volume',globalVolume);
    }else if(oldProvider === 'vimeo'){
        $f($('#vimeo')[0]).api('setVolume',globalVolume/100.0);
    }
}

beforeConnectFunctions.push(loadMouseWheelVolumecontrol);
//----------------- end  mousewheelVolumeControl.js-----------------
//-----------------start togglePlayer.js-----------------
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


function loadTogglePlayer(){
    //load settings
    playerActive = settings.get('playerActive','true');
    
    //add the command
    commands.set('regularCommands',"togglePlayer",togglePlayer);

    //toggle the player once if the stored setting was false
    if(!playerActive){
        playerActive = true;
        //adding a little delay because it won't reload when destroying it immediately
        setTimeout(togglePlayer,1500);
    }

    var oldPlayVideo = playVideo;
    playVideo = function playVideo(vidinfo, time, playing){
        if(playerActive){
            oldPlayVideo(vidinfo, time, playing);
        }else{
            //copied from InstaSynch's playVideo
            var addedby = '',
                title = '',
                indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                title = playlist[indexOfVid].title;
                addedby = playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#ulPlay').children('li')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class=\'via\'> via ' + addedby + '</div>');
            }
        }
    };
}


function togglePlayer(){
    if(playerActive){
        video.destroyPlayer();
    }else{
        sendcmd('reload', null);
    }
    playerActive = !playerActive;
    settings.set('playerActive',playerActive);
}

var playerActive = true;

afterConnectFunctions.push(loadTogglePlayer);
//----------------- end  togglePlayer.js-----------------
//-----------------start bigPlaylist.js-----------------
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch, original code
    Copyright (C) 2013 fugXD, modification

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

function loadBigPlaylist() {
    bigPlaylist = settings.get('bigPlaylist','true');
    commands.set('addOnSettings','bigPlaylist',toggleBigPlaylist);
    if (bigPlaylist) {
        // change playlist to table based
        $('<style type="text/css"> #tablePlaylistBody tr:hover{background:#555;} #tablePlaylistBody td {padding:3px;border:solid #666 3px;} .active{color:#000; background:#D1E1FA;} </style>').appendTo('head');
        $('#ulPlay').replaceWith($('<table>',{'id':'tablePlaylist'}));
        $('#tablePlaylist').css('width','100%')
        $('#tablePlaylist td').css('overflow','scroll');
        $('#tablePlaylist').append(
            $('<tbody>',{'id':'tablePlaylistBody'})
        );

        // override functions from instasynchs io.js, version 0.9.7
        // overrides addVideo, removeVideo, moveVideo and playVideo
        addVideo = function addVideo(vidinfo) {
            playlist.push({info: vidinfo.info, title: vidinfo.title, addedby: vidinfo.addedby, duration: vidinfo.duration});

            var vidlink = '';
            if (vidinfo.info.provider === 'youtube') {
                vidlink = 'http://www.youtube.com/watch?v=' + vidinfo.info.id;
            } else if (vidinfo.info.provider === 'vimeo') {
                vidlink = 'http://vimeo.com/' + vidinfo.info.id;
            } else if (vidinfo.info.provider === 'twitch') {
                if (vidinfo.info.mediaType === 'stream')
                    vidlink = 'http://twitch.tv/' + vidinfo.info.channel;
            }        
            var expand = $('<div/>', {
                'class': 'expand'
            }).append($('<a/>', {
                'href': vidlink,
                'target': '_blank'
            }).append($('<img/>', {
                'src': '/images/expand.png'
            })));
            var removeBtn = $('<div/>', {
                'class': 'removeBtn x',
                'click': function () {
                    sendcmd('remove', {info: $(this).parent().parent().data('info')});
                }
            });

            // Create the <tr> (row) in the table for the new video
            $('#tablePlaylistBody').append(
                $('<tr>', {'data':{info: vidinfo.info}}).append(
                    $('<td>').append(
                        $('<a>',{'href':vidlink,'target':'_blank'}).append(
                            $('<img>',{'src':vidinfo.info.thumbnail}).css('width','45px')
                        )
                    ).css('padding','0px')
                ).append(
                    $('<td>').append(
                        $('<div>',{'title':vidinfo.title}).text(((vidinfo.title.length>100)?vidinfo.title.substring(0,100)+"...":vidinfo.title)).css('overflow','hidden')
                    ).on('click', function() {
                            if (isLeader) {
                                sendcmd('play', {info: $(this).parent().data('info')});
                            } else {
                                    $('#cin').val($('#cin').val() + getVideoIndex($(this).parent().data('info')) + ' ');
                                    $('#cin').focus();
                                }
                        }
                    ).css('cursor','pointer')
                ).append(
                    $('<td>').html(secondsToTime(vidinfo.duration) + '<br/>' + vidinfo.addedby).css('text-align','right')
                ).append(
                    $('<td>').append(removeBtn)
                )
            );
            totalTime += vidinfo.duration;
            $('.total-videos').html(playlist.length + ' videos');
            $('.total-duration').html(secondsToTime(totalTime));
        }

        removeVideo = function removeVideo(vidinfo) {
            var indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1 && indexOfVid < playlist.length) {
                totalTime -= playlist[indexOfVid].duration;
                playlist.splice(indexOfVid, 1);
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).remove();
            }
            $('.total-videos').html(playlist.length + ' videos');
            $('.total-duration').html(secondsToTime(totalTime));
        }

        moveVideo = function moveVideo(vidinfo, position) {
            var indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                playlist.move(indexOfVid, position);
                var playlistElements = $('#tablePlaylistBody tr').clone(true);
                playlistElements.move = function (old_index, new_index) {
                    if (new_index >= this.length) {
                        var k = new_index - this.length;
                        while ((k--) + 1) {
                            this.push(undefined);
                        }
                    }
                    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                };
                playlistElements.move(indexOfVid, position);
                $('#tablePlaylistBody').empty();
                $('#tablePlaylistBody').html(playlistElements);
            }
        }

        playVideo = function playVideo(vidinfo, time, playing) {
            var addedby = '';
            var title = '';
            var indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1) 
            {
                title = playlist[indexOfVid].title;
                addedby = playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class="via"> via ' + addedby + '</div>');
                video.play(vidinfo, time, playing);   
                $('#slider').slider('option', 'max', playlist[indexOfVid].duration);
                $('#sliderDuration').html('/' + secondsToTime(playlist[indexOfVid].duration))
            }
        }
    }
}

var bigPlaylist = true;

function toggleBigPlaylist(){
    bigPlaylist = !bigPlaylist;
    settings.set('bigPlaylist',bigPlaylist);
    addMessage('','This setting requires a reload of the Page.','','hashtext');
}
//----------------- end  bigPlaylist.js-----------------
//-----------------start ExportPlaylistCommand.js-----------------
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

function loadExportPlaylist(){
    commands.set('regularCommands',"exportPlaylist",exportPlaylist);
}


function exportPlaylist(){
    var output='',
        i;

    for (i = 0; i < playlist.length; i++) {
        switch(playlist[i].info.provider){
            case 'youtube': output+='http://youtu.be/';break;
            case 'vimeo':output+='http://vimeo.com/';break;
            default: continue;
        }
        output += playlist[i].info.id+'\n ';
    }
    window.prompt ("Copy to clipboard: Ctrl+C, Enter", output);
}
beforeConnectFunctions.push(loadExportPlaylist);
//----------------- end  ExportPlaylistCommand.js-----------------
//-----------------start History.js-----------------
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

function loadHistory(){
    commands.set('regularCommands',"history",printHistory);
	var oldPlayVideo = playVideo;
	playVideo = function(vidinfo, time, playing) {
		oldPlayVideo(vidinfo,time,playing);
		//Keep the last 9 videos
		if (history.length === 9){
			history.shift();	
		}
		history.push([vidinfo,playlist[getVideoIndex(vidinfo)].title]);
	};
}

function printHistory(){
	closeResults();
	var output = "Last ten videos played : \n",
		html = [],
		thumbnail,
		link;
		
	for (i=0; i<history.length; i++){
	
		switch(history[i][0].provider){
            case 'youtube': link = 'http://www.youtube.com/watch?v=' + history[i][0].id ;break;
            case 'vimeo': link = 'http://vimeo.com/' + history[i][0].id ;break;
            default: continue;
        }
		
		thumbnail = "<img style='height:90px;width:120px' src='" + history[i][0].thumbnail + "'>";
		
		html.push("<div onmouseover='showTitle(this)' onmouseout='hideTitle(this)'><div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px;z-index:2;cursor:pointer;'  onClick='openInNewTab(\""+link+"\")'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + history[i][1] +  "</span></div></div>");		
	}
	$(html.join('')).appendTo("#searchResults");
	
	divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
	divresults.style.display = "block";
	divremove.style.display = "block";
}

// closes the results and empties it
function closeResults(){
    $("#searchResults").empty();
    divresults.style.display = "none";
    divremove.style.display = "none";
}
				
var history = [];
beforeConnectFunctions.push(loadHistory);

//----------------- end  History.js-----------------
//-----------------start wallcounter.js-----------------
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


function loadWallCounter(){

    var oldAddVideo = addVideo,
        oldRemoveVideo = removeVideo,
        oldAddMessage = addMessage,
        i,
        video,
        value;

    //add commands
    commands.set('regularCommands',"printWallCounter",printWallCounter);
    commands.set('regularCommands',"printMyWallCounter",printMyWallCounter);


    //overwrite InstaSynch's addVideo
    addVideo = function addVideo(vidinfo) {
        resetWallCounter();
        value = wallCounter[vidinfo.addedby];
        if (isBibbyRoom() && value >= 3600 && vidinfo.addedby === thisUsername){
            var output = "Watch out " + thisUsername + " ! You're being a faggot by adding more than 1 hour of videos !";
            addMessage('',output,'','hashtext');
        }
        oldAddVideo(vidinfo);
    };

    /*
     * Commented since this shit isnt working and I have no idea why
    */
    // //overwrite InstaSynch's removeVideo
    // removeVideo = function removeVideo(vidinfo){
    //     var indexOfVid = getVideoIndex(vidinfo);
    //     video = playlist[indexOfVid];
    //     value = wallCounter[video.addedby];
    //     value -= video.duration;

    //     if(value > 0){
    //         wallCounter[video.addedby] = value;
    //     }else{
    //         delete wallCounter[video.addedby];
    //     }

    //     oldRemoveVideo(vidinfo);
    // };    

    // addMessage = function addMessage(username, message, userstyle, textstyle) {
    //     if(username === '' && message === 'Video added succesfully.'){
    //         message +='WallCounter: ['+secondsToTime(wallCounter[thisUsername])+']';
    //     }
    //     oldAddMessage(username, message, userstyle, textstyle);
    // };    

    //init the wallcounter
    resetWallCounter();
}
var wallCounter = {};

function resetWallCounter(){
    var video,value;
    wallCounter = {};
    for(i = 0; i < playlist.length;i++){
        video = playlist[i];
        value = wallCounter[video.addedby];
        value =(value||0) + video.duration;
        wallCounter[video.addedby] = value;
    } 
}

function printWallCounter(){
    resetWallCounter();
    var output = "",
        key;
    for(key in wallCounter){
        if(wallCounter[key] > 3600){
            output += "<span style='color:red'>["+key + ": "+secondsToTime(wallCounter[key])+"]</span> ";
        }else{
            output += "["+key + ": "+secondsToTime(wallCounter[key])+"] ";
        }
    }
    addMessage('', output, '', 'hashtext');
}

function printMyWallCounter(){   
    resetWallCounter();
    var output = "";
    if(wallCounter[thisUsername]){
        output = "["+ thisUsername +" : "+ secondsToTime(wallCounter[thisUsername])+"]";
    }else{
        output = "["+ thisUsername +" : 00:00]";
    }
    addMessage('', output, '', 'hashtext');
}

afterConnectFunctions.push(loadWallCounter);
//----------------- end  wallcounter.js-----------------
//-----------------start UrlParser.js-----------------

/*
    Copyright (C) 2013  faqqq @Bibbytube
    
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


function parseUrl(URL){
	//Parse URLs from  youtube / twitch / vimeo / dailymotion / livestream
 
	var match = URL.match(/(https?:\/\/)?([^\.]+\.)?(\w+)\./i);
	if(match === null){
		/*error*/
		return false;
	}
	var provider = match[3], //the provider e.g. youtube,twitch ...
		mediaType, // stream, video or playlist (this can't be determined for youtube streams, since the url is the same for a video)
		id, //the video-id 
		channel, //for twitch and livestream
		playlistId; //youtube playlistId;
	switch(provider){
		case 'youtu':
		case 'youtube':{ 
			provider = 'youtube'; //so that we don't have youtu or youtube later on
			//match for http://www.youtube.com/watch?v=12345678901
			if((match=URL.match(/v=([\w-]{11})/i))){
				id = match[1];
			}//match for http://www.youtube.com/v/12345678901, http://www.youtu.be/12345678901 
			 //and http://gdata.youtube.com/feeds/api/videos/12345678901/related
			else if((match=URL.match(/(v|be|videos)\/([\w-]{11})/i))){
				id = match[2];
			}
			//get playlist parameter
            if((match=URL.match(/list=([\w-]+)/i))){
				playlistId = match[1];
			}
			if(!id && !playlistId){
				return false;
			}
			//Try to match the different youtube urls, if successful the last (=correct) id will be saved in the array
			//Read above for RegExp explanation
            if(id){                
			    mediaType = 'video';
            }else{
			    mediaType = 'playlist';
            }
		}break;
		case 'twitch':{
			//match for http://www.twitch.tv/ <channel> /c/ <video id>
			if((match = URL.match(/twitch\.tv\/(.*?)\/.\/(\d+)?/i))){
			}//match for http://www.twitch.tv/* channel=<channel> *
			else if((match = URL.match(/channel=([A-Za-z0-9_]+)/i))){
			}//match for http://www.twitch.tv/ <channel>
			else if((match = URL.match(/twitch\.tv\/([A-Za-z0-9_]+)/i))){
			}else{
				/*error*/
				return false;
			}
			mediaType = 'stream';
			if(match.length == 3){
				//get the video id 
				id = match[2];
				//also it's a video then
				mediaType = 'video';
			}
			//get the channel name
			channel = match[1];
		}break;
		case 'vimeo':{

			//match for http://vimeo.com/channels/<channel>/<video id>
			if(match = URL.match(/\/channels\/[\w0-9]+\/(\d+)/i)){
			}//match for http://vimeo.com/album/<album id>/video/<video id>
			else if(match = URL.match(/\/album\/\d+\/video\/(\d+)/i)){
			}//match for http://player.vimeo.com/video/<video id>
			else if(match = URL.match(/\/video\/(\d+)/i)){
			}//match for http://vimeo.com/<video id>
			else if(match = URL.match(/\/(\d+)/i)){
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id = match[1];
			mediaType = 'video';
		} break;
		case 'dai':
		case 'dailymotion':{
			provider = 'dailymotion'; //same as youtube / youtu
			//match for http://www.dailymotion.com/video/ <video id> _ <video title>
			if((match=URL.match(/\/video\/([^_]+)/i))){
			}//match for http://dai.ly/ <video id>
			else if((match=URL.match(/ly\/([^_]+)/i))){	
			}//or find the #video= tag in http://www.dailymotion.com/en/relevance/search/ <search phrase> /1#video= <video id>
			else if((match=URL.match(/#video=([^_]+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id= match[1];
			mediaType = 'video';

		}break;
		case 'livestream':{
			//match for http://www.livestream.com/ <channel>
			//not sure about new.livestream.com links tho
			if((match = URL.match(/livestream\.com\/(\w+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the channel name
			channel = match[1];
			mediaType = 'stream';
		}break;
		//different provider -> error
		default: /*error*/ return false;
	}

	//return the data
	return {
		'provider': provider,
		'mediaType':mediaType,
		'id':id,
		'playlistId':playlistId,
		'channel':channel
	};
}
//----------------- end  UrlParser.js-----------------
beforeConnect();
afterConnect();