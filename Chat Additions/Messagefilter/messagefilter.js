setField({
    'name': 'Tags',
    'data': {
        'label': 'Parse <a style="color:white;" href="https://github.com/Bibbytube/Instasynch/blob/master/Chat%20Additions/Messagefilter/tags.js" target="_blank">tags</a> in the chat',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Chat Additions'
});
setField({
    'name': 'NSFWEmotes',
    'data': {
        'label': 'NSFW Emotes',
        'title': '/meatspin /boobies',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});

function loadMessageFilter() {

    var oldLinkify = unsafeWindow.linkify,
        oldAddMessage = unsafeWindow.addMessage,
        oldCreatePoll = unsafeWindow.createPoll,
        oldNSFWEmotes = GM_config.get('NSFWEmotes');

    onSettingsOpen.push(function() {
        oldNSFWEmotes = GM_config.get('NSFWEmotes');
    });

    onSettingsSave.push(function() {
        if (oldNSFWEmotes !== GM_config.get('NSFWEmotes')) {
            toggleNSFWEmotes();
            oldNSFWEmotes = GM_config.get('NSFWEmotes');
        }
    });

    //init
    if (GM_config.get('NSFWEmotes')) {
        unsafeWindow.$codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        unsafeWindow.$codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
    }
    unsafeWindow.linkify = function(str, buildHashtagUrl, includeW3, target) {
        var emotes = [],
            index = -1;
        //remove image urls so they wont get linkified
        str = str.replace(/src=\"([^\"]*)\"/gi, function(match) {
            emotes.push(match);
            return 'src=\"\"';
        });
        str = oldLinkify(str, buildHashtagUrl, includeW3, target);
        //put them back in
        str = str.replace(/src=\"\"/gi, function() {
            index += 1;
            return emotes[index];
        });
        return str;
    };
    //overwrite InstaSynch's addMessage function
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        oldAddMessage(username, parseMessage(message, true), userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };
    unsafeWindow.createPoll = function(poll) {
        var i;
        poll.title = unsafeWindow.linkify(parseMessage(poll.title, false), false, true);
        for (i = 0; i < poll.options.length; i += 1) {
            poll.options[i].option = parseMessage(poll.options[i].option, false);
        }
        oldCreatePoll(poll);
    };
}

function toggleNSFWEmotes() {
    if (GM_config.get('NSFWEmotes')) {
        unsafeWindow.$codes.boobies = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        unsafeWindow.$codes.meatspin = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autoCompleteData.push('/boobies');
        autoCompleteData.push('/meatspin');
        autoCompleteData.sort();
    } else {
        delete unsafeWindow.$codes.boobies;
        delete unsafeWindow.$codes.meatspin;
        autoCompleteData.splice(autoCompleteData.indexOf('/boobies'), 1);
        autoCompleteData.splice(autoCompleteData.indexOf('/meatspin'), 1);
    }
}

function parseMessage(message, isChatMessage) {
    var emoteFound = false,
        match = message.match(/^((\[[^\]]*\])*)\/([^\[ ]+)((\[.*?\])*)/i),
        emote,
        word,
        greentext,
        i,
        words;
    //if the text matches [tag]/emote[/tag] or /emote
    if (match && isChatMessage) {
        if (unsafeWindow.$codes.hasOwnProperty(match[3].toLowerCase())) {
            emoteFound = true;
            emote = unsafeWindow.$codes[match[3].toLowerCase()];
            message = String.format("<span class='cm'>{0}{1}{2}</span>", match[1], emote, match[4]);
        }
    } else {
        greentext = false;
        //if the text matches [tag]>* or >*
        if (message.match(/^((\[[^\]]*\])*)((&gt;)|>)/)) {
            greentext = true;
        } else {
            //split up the message and add hashtag colors #SWAG #YOLO
            words = message.split(" ");
            for (i = 0; i < words.length; i += 1) {
                if (words[i][0] === "#") {
                    words[i] = String.format("<span class='cm hashtext'>{0}</span>", words[i]);
                }
            }
            //join the message back together
            message = words.join(" ");
        }
        message = String.format("<span class='cm{0}'>{1}</span>", greentext ? ' greentext' : '', message);
    }
    if (!isChatMessage) {
        //filter all emotes
        message = parseEmotes(message);
    }
    //filter words
    for (word in filteredwords) {
        if (filteredwords.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'g'), filteredwords[word]);
        }
    }

    function parseAdvancedTags(match, $0, $1) {
        var ret = '',
            format;
        switch (word) {
            case 'hexcolor':
                format = '<span style="color:{0}">';
                break;
            case 'marquee':
                format = '<MARQUEE behavior="scroll" direction={0} width="100%" scrollamount="{1}">';
                $0 = ($0 ? "left" : "right");
                break;
            case 'alternate':
                format = '<MARQUEE behavior="alternate" direction="right" width="100%" scrollamount="{0}">';
                break;
            case 'spoiler':
                format = '[spoiler]{0}[/spoiler]';
                break;
        }
        ret = String.format(format, $0, $1);
        return GM_config.get('Tags') ? ret : '';
    }
    //filter advancedTags    
    for (word in advancedTags) {
        if (advancedTags.hasOwnProperty(word)) {
            message = message.replace(advancedTags[word], parseAdvancedTags);
        }
    }

    function parseTags() {
        return GM_config.get('Tags') ? tags[word] : '';
    }
    //filter tags
    for (word in tags) {
        if (tags.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'gi'), parseTags);
        }
    }
    //remove unnused tags [asd] if there is a emote
    if (emoteFound && isChatMessage) {
        message = message.replace(/\[[^\]]*\]/, '');
    }
    return message;
}
//parse multiple emotes in a message
function parseEmotes(message) {
    var possibleEmotes = [],
        exactMatches = [],
        emoteStart = -1,
        emote = '',
        end = false,
        i,
        j,
        code;
    while (!end) {
        emoteStart = message.indexOf('/', emoteStart + 1);
        if (emoteStart === -1) {
            end = true;
        } else {
            possibleEmotes = Object.keys(unsafeWindow.$codes);
            exactMatches = [];
            emote = '';
            for (i = emoteStart + 1; i < message.length; i += 1) {
                emote += message[i];
                for (j = 0; j < possibleEmotes.length; j += 1) {
                    if (emote.indexOf(possibleEmotes[j]) === 0) {
                        exactMatches.push(possibleEmotes[j]);
                        possibleEmotes.splice(j, 1);
                        j -= 1;
                    } else if (possibleEmotes[j].indexOf(emote) !== 0) {
                        possibleEmotes.splice(j, 1);
                        j -= 1;
                    }
                }
                if (possibleEmotes.length === 0) {
                    break;
                }
            }
            if (exactMatches.length !== 0) {
                code = unsafeWindow.$codes[exactMatches[exactMatches.length - 1]];
                if (emoteStart !== 0) {
                    if (message[emoteStart - 1] === '\\') {
                        message = message.substring(0, emoteStart - 1) + message.substring(emoteStart);
                        i = emoteStart + exactMatches[exactMatches.length - 1].length;
                    } else {
                        message = message.substring(0, emoteStart) + code + message.substring(emoteStart + exactMatches[exactMatches.length - 1].length + 1);
                        i = emoteStart + code.length;
                    }
                } else {
                    message = message.substring(0, emoteStart) + code + message.substring(emoteStart + exactMatches[exactMatches.length - 1].length + 1);
                    i = emoteStart + code.length;
                }

            }
            emoteStart = i - 1;
        }
    }
    return message;
}

var filteredwords = {
    "skip": "upvote",
    "SKIP": "UPVOTE",
    "gay": "hetero",
    "GAY": "HETERO"
};


preConnectFunctions.push(loadMessageFilter);