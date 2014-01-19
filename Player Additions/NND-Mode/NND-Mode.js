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
settingsFields['Player Additions'] = settingsFields['Player Additions'] || {};
settingsFields['Player Additions']['NicoNicoDouga-Mode'] = settingsFields['Player Additions']['NicoNicoDouga-Mode'] || {};
settingsFields['Player Additions']['NicoNicoDouga-Mode'].NNDMode = {
    'label': 'NicoNicoDouga-Mode(scrolling text)',
    'type': 'checkbox',
    'default': false
};
settingsFields['Player Additions']['NicoNicoDouga-Mode'].NNDModeEmotes = {
    'label': 'Emotes',
    'type': 'checkbox',
    'default': true
};
settingsFields['Player Additions']['NicoNicoDouga-Mode'].NNDModeLimit = {
    'label': 'Message Limit',
    'title': '-1 unlimited',
    'type': 'int',
    'min': -1,
    'default': -1,
    'size': 1
};
settingsFields['Player Additions']['NicoNicoDouga-Mode'].NNDModeSpeed = {
    'label': 'Speed',
    'title': '10 - 50',
    'type': 'int',
    'min': 10,
    'max': 50,
    'default': 25,
    'size': 1
};
settingsFields['Player Additions']['NicoNicoDouga-Mode'].NNDModeFontSize = {
    'label': 'Font-Size',
    'title': '10 - 50',
    'type': 'int',
    'min': 10,
    'max': 50,
    'default': 13,
    'size': 1
};

function loadNNDMode() {
    $('#media').css('position', 'relative');
    var oldAddMessage = unsafeWindow.addMessage;
    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        oldAddMessage(username, message, userstyle, textstyle);
        if (GM_config.get('NNDMode') && username !== '' && message[0] !== '$') {
            if (GM_config.get('NNDModeLimit') < 0 || marqueeMessages.length < GM_config.get('NNDModeLimit')) {
                addMarqueeMessage(message);
            }
        }
    };
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}

var marqueeMessages = [],
    marqueeIntervalId = undefined,
    playerHeight,
    playerWidth;


function addMarqueeMessage(message) {
    var i,
        jqueryMessage,
        top,
        temp;
    message = parseMessageForNND(message);
    jqueryMessage = $('<div>').append(
        $('<marquee direction="left" />').append(
            $('<div/>').html(message).css('font-size', GM_config.get('NNDModeFontSize')).css('text-shadow', '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black').css('opacity', 0.65)
        ).attr('scrollamount', GM_config.get('NNDModeSpeed'))
    ).css('color', 'white').css('position', 'absolute').css('width', playerWidth).css('pointer-events', 'none');

    top = (Math.random() * (playerHeight - 60));
    jqueryMessage.css('top', top + 'px');
    $('#media').append(jqueryMessage);
    marqueeMessages.push({
        message: $('#media > div:last-Child'),
        min: jqueryMessage.children().eq(0).children().eq(0).position().left
    });
    if (!marqueeIntervalId) {
        marqueeIntervalId = setInterval(function () {
            if (marqueeMessages.length === 0) {
                clearInterval(marqueeIntervalId);
                marqueeIntervalId = undefined;
            }
            for (i = 0; i < marqueeMessages.length; i += 1) {
                marqueeMessages[i].min = Math.min(marqueeMessages[i].min, marqueeMessages[i].message.children().eq(0).children().eq(0).position().left);
                if (marqueeMessages[i].message.children().eq(0).children().eq(0).position().left > marqueeMessages[i].min) {
                    marqueeMessages[i].message.remove();
                    marqueeMessages.splice(i, 1);
                    i -= 1;
                }
            }

        }, 50);
    }
}

function parseMessageForNND(message) {
    var match = message.match(/^((\[[^\]]*\])*)\/([^\[ ]+)((\[.*?\])*)/i),
        word,
        emoteFound = false,
        greentext,
        emote,
        words,
        i,
        excludeTags = {
            '\\[rmarquee\\]': '<marquee>', //move text to right
            '\\[/rmarquee\\]': '</marquee>',
            '\\[alt\\]': '<marquee behavior="alternate" direction="right">', //alternate between left and right
            '\\[/alt\\]': '</marquee>',
            '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">', //different speeds etc.
            '\\[/falt\\]': '</marquee>',
            '\\[marquee\\]': '<marquee direction="right">',
            '\\[/marquee\\]': '</marquee>',
            '\\[rsanic\\]': '<MARQUEE behavior="scroll" direction="left" width="100%" scrollamount="50">',
            '\\[/rsanic\\]': '</marquee>',
            '\\[sanic\\]': '<MARQUEE behavior="scroll" direction="right" width="100%" scrollamount="50">',
            '\\[/sanic\\]': '</marquee>'
        };
    if (match) {
        if (unsafeWindow.$codes.hasOwnProperty(match[3].toLowerCase())) {
            emoteFound = true;
            emote = unsafeWindow.$codes[match[3].toLowerCase()];
            if (GM_config.get('NNDModeEmotes')) {
                message = String.format("{0}{1}{2}", match[1], emote, match[4]);
            } else {
                message = String.format("{0}/{1}{2}", match[1], match[3].toLowerCase(), match[4]);
            }
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
        case 'spoiler':
            format = '[spoiler]{0}[/spoiler]';
            break;
        default:
            format = '';
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

    //exclude tags
    for (word in excludeTags) {
        if (excludeTags.hasOwnProperty(word)) {
            message = message.replace(new RegExp(word, 'gi'), '');
        }
    }
    //text in spoilers will be black
    message = message.replace(/\[spoiler\]/gi, "<span style=\"background-color: #000;color:black;\" onmouseover=\"this.style.backgroundColor='#FFF';\" onmouseout=\"this.style.backgroundColor='#000';\">");

    function parseTags() {
        return GM_config.get('Tags') ? tags[word] : '';
    }
    //filter tags
    for (word in tags) {
        if (tags.hasOwnProperty(word) && word !== '\\[spoiler\\]') {
            message = message.replace(new RegExp(word, 'gi'), parseTags);
        }
    }
    if (emoteFound) {
        message = message.replace(/\[[^\]]*\]/, '');
    }
    return message;
}
preConnectFunctions.push(loadNNDMode);