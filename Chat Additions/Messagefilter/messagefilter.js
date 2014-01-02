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
    filterTags = settings.get('Tags',true);
    NSFWEmotes = settings.get('NSFWEmotes',false);

    //add the commands
    commands.set('addOnSettings',"Tags",toggleTags);
    commands.set('addOnSettings',"NSFWEmotes",toggleNSFWEmotes);

    //init
    if(NSFWEmotes){
        unsafeWindow.$codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        unsafeWindow.$codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
    }
    var oldLinkify = unsafeWindow.linkify,
        oldAddMessage = unsafeWindow.addMessage,
        oldCreatePoll = unsafeWindow.createPoll;

    unsafeWindow.linkify = function(str, buildHashtagUrl, includeW3, target) {
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
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        var isChatMessage = true;
        if(username === ''){
            isChatMessage = false;
        }
        oldAddMessage(username, parseMessage(message,isChatMessage), userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };

    unsafeWindow.createPoll = function(poll){
        var i;
        poll.title = unsafeWindow.linkify(parseMessage(poll.title,false), false, true);
        for(i = 0; i< poll.options.length;i++){
            poll.options[i].option = parseMessage(poll.options[i].option,false);
        }
        oldCreatePoll(poll);
    };

}
function toggleTags(){
    filterTags = !filterTags; 
    settings.set('Tags',filterTags);
}
function toggleNSFWEmotes(){
    if(!NSFWEmotes){
        unsafeWindow.$codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        unsafeWindow.$codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete unsafeWindow.$codes.boobies;
        delete unsafeWindow.$codes.meatspin;
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
        emote = (unsafeWindow.$codes.hasOwnProperty(match[3].toLowerCase()))?unsafeWindow.$codes[match[3].toLowerCase()]: "/"+match[3];
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
    //filter advancedTags
    for (word in advancedTags) {
        message = message.replace(new RegExp(advancedTags[word], 'g'),
            function(match, m1, m2){
                var ret = '';
                switch(word){
                    case 'hexcolor': ret = '<span style="color:' +m1+ '">';break;
                    case 'marquee' : ret = '<MARQUEE behavior="scroll" direction='+(m1?"left":"right")+' width="100%" scrollamount="'+ m2 +'">'; break;
                    case 'alternate': ret = '<MARQUEE behavior="alternate" direction="right" width="100%" scrollamount="'+ m1 +'">'; break;
                    case 'spoiler': ret = '[spoiler]'+ m1 +'[/spoiler]'; break;
                }
                return (filterTags)?ret:'';
            });
    }
    //filter tags
    for (word in tags) {
        message = message.replace(new RegExp(word, 'gi'),function(){return (filterTags)?tags[word]:'';});
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
            possibleEmotes = Object.keys(unsafeWindow.$codes);
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
                code = unsafeWindow.$codes[exactMatches[exactMatches.length-1]];
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
        unsafeWindow.$codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        unsafeWindow.$codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete unsafeWindow.$codes.boobies;
        delete unsafeWindow.$codes.meatspin;
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
       'alternate': '\\[alt(\\d{1,2})\\]',
       'spoiler': '\\|([^\\|]*)\\|'
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


preConnectFunctions.push(loadMessageFilter);
