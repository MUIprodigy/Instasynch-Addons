function loadHistory() {
    commands.set('regularCommands', "history", printHistory, 'Shows the last 9 played videos on the YoutubeSearch panel.');
    events.bind('onPlayVideo', function(vidinfo, time, playing, indexOfVid) {
        //Keep the last 9 videos
        if (history.length === 9) {
            history.shift();
        }
        history.push(unsafeWindow.playlist[indexOfVid]);
    });
}

function printHistory() {
    closeResults();
    var duration,
        date,
        link,
        i;

    for (i = 0; i < history.length; i += 1) {
        link = '';
        duration = '';
        date = new Date(null);
        switch (history[i].info.provider) {
            case 'youtube':
                link = 'http://www.youtube.com/watch?v=' + history[i].info.id;
                break;
            case 'vimeo':
                link = 'http://vimeo.com/' + history[i].info.id;
                break;
        }

        if (link !== '') {
            date.setSeconds(history[i].duration);
            if (date.getUTCHours() !== 0) {
                duration = date.getUTCHours() + 'h';
            }
            if ((date.getUTCMinutes() !== 0) || duration) {
                duration += date.getUTCMinutes() + 'm';
            }
            if ((date.getUTCSeconds() !== 0) || duration) {
                duration += date.getUTCSeconds() + 's';
            }
            divresults.append(
                $('<div>')
            ).append(
                $('<a>', {
                    'href': link,
                    'target': '_blank'
                }).append(
                    $('<img>', {
                        'src': history[i].info.thumbnail
                    }).css('height', '90px').css('width', '120px')
                ).append(
                    $('<p>').append(
                        $('<span>').text(history[i].title).css('background', 'rgba(0, 0, 0, 0.7)').css('color', 'white')
                    ).css('position', 'absolute').css('top', '5px').css('left', '5px').css('display', 'none')
                ).append(
                    $('<p>').text(link).css('display', 'none').addClass('videourl')
                ).append(
                    $('<p>').append(
                        $('<span>').text(duration).css('background', 'rgba(0, 0, 0, 0.7').css('color', 'white')
                    ).css('position', 'absolute').css('bottom', '0px').css('right', '0px')
                ).css('overflow', 'hidden').css('position', 'relative').css('float', 'left').css('height', '90px')
                .css('width', '120px').css('margin', '1px').css('cursor', 'pointer').css('z-index', '2').hover(showTitle, hideTitle)
            );
        }
    }
    divresults.append(divremove);
    divresults.css('display', 'block');
    divremove.click(closeResults);
}

var history = [];
executeOnceFunctions.push(loadHistory);