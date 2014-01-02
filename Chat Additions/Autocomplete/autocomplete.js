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
    if(postConnectFunctions.lastIndexOf(loadAutoComplete) != postConnectFunctions.length-1){
        postConnectFunctions.push(loadAutoComplete);
        return;
    }
    //load settings
    tagsAutoComplete = settings.get("TagsAutoComplete",true);
    emotesAutoComplete = settings.get("EmotesAutoComplete",true);
    commandsAutoComplete = settings.get("CommandsAutoComplete",true);
    addOnSettingsAutoComplete = settings.get("AddOnSettingsAutoComplete",true);
    namesAutoComplete = settings.get("NamesAutoComplete",true);
    botCommandsAutoComplete = settings.get("BotCommandsAutoComplete",true);

    //add the commands
    commands.set('addOnSettings',"TagsAutoComplete",toggleTagsAutocomplete);
    commands.set('addOnSettings',"EmotesAutoComplete",toggleEmotesAutocomplete);
    commands.set('addOnSettings',"CommandsAutoComplete",toggleCommandsAutocomplete);
    commands.set('addOnSettings',"AddOnSettingsAutoComplete",toggleAddonSettingsAutocomplete);
    commands.set('addOnSettings',"NamesAutoComplete",toggleNamesAutocomplete);
    commands.set('addOnSettings',"BotCommandsAutoComplete",toggleBotCommandsAutocomplete);

    var i,
        emotes = (
            function () {
                var arr = Object.keys(unsafeWindow.$codes);
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
                caretPosition = doGetCaretPosition(unsafeWindow.cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~','@','$']),
                partToComplete = message.substring(lastIndex,caretPosition),
                matches = [];

            if(partToComplete.length>0){
                switch(partToComplete[0]){
                    case '/': if(!emotesAutoComplete|| (lastIndex!==0 && (!message[lastIndex-1].match(/\s/)&&!message[lastIndex-1].match(/\]/)))) return;  break;
                    case '\'': if(!commandsAutoComplete || (lastIndex!==0 && !message[lastIndex-1].match(/\s/))) return; break;
                    case '[': if(!tagsAutoComplete) return; break;
                    case '~': if(!addOnSettingsAutoComplete|| (lastIndex!==0 && !message[lastIndex-1].match(/\s/))) return;  break; 
                    case '@': if(!namesAutoComplete|| (lastIndex!==0 && !message[lastIndex-1].match(/\s/))) return;  break;
                    case '$': if(!botCommandsAutoComplete|| (lastIndex!==0 && !message[lastIndex-1].match(/\s/))) return;  break;

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
                caretPosition = doGetCaretPosition(unsafeWindow.cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~','@','$']);
            //prevent it from autocompleting when a little changed has been made and its already there
            if(message.indexOf(ui.item.value) === lastIndex && lastIndex+ui.item.value.length !== caretPosition){
                doSetCaretPosition(unsafeWindow.cin,lastIndex+ui.item.value.length);
                return false;
            }
            //insert the autocompleted text and set the cursor position after it
            this.value = message.substring(0,lastIndex) + ui.item.value + message.substring(caretPosition,message.length);
            doSetCaretPosition(unsafeWindow.cin,lastIndex+ui.item.value.length);
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
    emotesAutoComplete = true,
    commandsAutoComplete = true,
    tagsAutoComplete = true,
    addOnSettingsAutoComplete = true,
    namesAutoComplete = true,
    botCommandsAutoComplete= true,
    autocompleteData = [];
function toggleBotCommandsAutocomplete(){
    botCommandsAutoComplete = !botCommandsAutoComplete; 
    settings.set("BotCommandsAutoComplete",botCommandsAutoComplete);
}
function toggleTagsAutocomplete(){
    tagsAutoComplete = !tagsAutoComplete; 
    settings.set("TagsAutoComplete",tagsAutoComplete);
}
function toggleEmotesAutocomplete(){
    emotesAutoComplete = !emotesAutoComplete; 
    settings.set("EmotesAutoComplete",emotesAutoComplete);
}
function toggleCommandsAutocomplete(){
    commandsAutoComplete = !commandsAutoComplete; 
    settings.set("CommandsAutoComplete",commandsAutoComplete);
}
function toggleAddonSettingsAutocomplete(){
    addOnSettingsAutoComplete = !addOnSettingsAutoComplete; 
    settings.set("AddOnSettingsAutoComplete",addOnSettingsAutoComplete);
}
function toggleNamesAutocomplete(){
    namesAutoComplete = !namesAutoComplete; 
    settings.set("NamesAutoComplete",namesAutoComplete);
}

postConnectFunctions.push(loadAutoComplete);
