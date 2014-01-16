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

function loadNNDMode() {
    nndMode = settings.get('NNDMode', true);
    nndLimit = settings.get('NNDModeLimit', -1);
    commands.set('addOnSettings', "NNDMode", toggleNNDMode, 'Toggles NND-Mode.');
    commands.set('addOnSettings', "NNDModelimit ", NNDModelimit, 'Limits how many messages can be displayed on the screen. Parameters: the number of messages.');
    $('#media').css('position', 'relative');
    var oldAddMessage = unsafeWindow.addMessage;
    unsafeWindow.addMessage = function (username, message, userstyle, textstyle) {
        oldAddMessage(username, message, userstyle, textstyle);
        if (nndMode && username !== '' && message[0] !== '$') {
            if (nndLimit === -1 || marqueeMessages.length < nndLimit) {
                addMarqueeMessage(message);
            }
        }
    };
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}

var nndMode = true,
    marqueeMessages = [],
    marqueeIntervalId = undefined,
    playerHeight,
    playerWidth,
    nndLimit = -1;

function NNDModelimit(params) {
    if (params[1]) {
        nndLimit = parseInt(params[1], 10);
        if (nndLimit <= 0) {
            nndLimit = -1;
        }
        settings.set('NNDModeLimit', nndLimit);
    }
}

function toggleNNDMode() {
    nndMode = !nndMode;
    settings.set('NNDMode', nndMode);
}

function addMarqueeMessage(message) {
    var i,
        jqueryMessage,
        top,
        temp;
    message = parseMessageForNND(message);
    jqueryMessage = $('<div>').append(
        $('<marquee direction="left" />').append(
            $('<div/>').html(message).css('text-shadow', '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black').css('opacity', 0.8)
        )
    ).css('color', 'white').css('position', 'absolute').css('width', playerWidth);
    top = (Math.random() * (playerHeight - 13));
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
            message = String.format("{0}/{1}{2}", match[1], match[3], match[4]);
        }
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
        return filterTags ? ret : '';
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
    message = message.replace(/\[spoiler\].*?(?=\[\/spoiler\])\[\/spoiler\]/gi, '[spoiler]');

    function parseTags() {
        return filterTags ? tags[word] : '';
    }
    //filter tags
    for (word in tags) {
        if (tags.hasOwnProperty(word) && word !== '\\[spoiler\\]') {
            message = message.replace(new RegExp(word, 'gi'), parseTags);
        }
    }
    return message;
}
preConnectFunctions.push(loadNNDMode);