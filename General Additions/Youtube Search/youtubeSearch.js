function loadYoutbeSearchOnce() {
    GM_addStyle(GM_getResourceText('youtubeSearchCSS'));
    searchResultTemplate = $('<a>', {
        'target': '_blank'
    }).append(
        $('<img>')
    ).append(
        $('<p>').append(
            $('<span>').css('color', 'white').addClass('text-shadow')
        ).css('position', 'absolute').css('top', '5px').css('left', '5px').css('opacity', '0.7').addClass('opacity0')
    ).append(
        $('<p>').append(
            $('<span>').css('background', 'rgba(0, 0, 0, 0.7')
        ).css('position', 'absolute').css('bottom', '0px').css('right', '0px')
    ).append(
        $('<div>', {
            'class': 'controlIcon',
            'title': 'Add Video'
        }).append(
            $('<div>').css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)').addClass('animationContainer')
        ).css('position', 'absolute').css('top', '0px').css('left', '0px').css('margin', 'initital').css('opacity', '0.7').addClass('opacity0')
    ).addClass('search-result');
}

function loadYoutubeSearch() {
    //insert search result container
    $('.poll-container').before(
        $('<div id="search-results" />').append(
            $('<div id="divmore" />').append(
                $('<input id="prevButton" />').prop('disabled', true).prop('type', 'button').val('<< Prev').click(prevPage)
            ).append(
                $('<input id="nextButton" />').prop('disabled', true).prop('type', 'button').val('Next >>').click(nextPage)
            )
        ).append(
            $('<div id="divclosesearch" />').addClass('x').click(closeResults)
        )
    );

    // Setting events on the URL input
    $("#URLinput").bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.ESCAPE) {
            closeResults();
        } else {
            if (searchTimeout) {
                clearInterval(searchTimeout);
            }
            searchTimeout = setTimeout(startSearch, 500);
        }
    });
}

function startSearch() {
    searchTimeout = null;
    closeResults();
    searchFirst();
}

function searchFirst() {
    query = $("#URLinput").val();
    if (query && query !== "") {
        urlInfo = parseUrl(query);
        entriesHistory = [];
        page = 0;
        $('#nextButton').css('display', 'initial');
        $('#prevButton').css('display', 'initial');
        search(0);
    }
}

function prevPage() {
    page--;
    showResults(entriesHistory.slice(page * 9, 9), page !== 0, true);
}

function nextPage() {
    page++;
    if (entriesHistory.length <= page * 9) {
        search(page * 9);
    } else {
        showResults(entriesHistory.slice(page * 9, 9), true, true);
    }
}

function search(startIndex) {
    startIndex = startIndex + 1;
    var entries,
        url,
        nextButtonActive,
        prevButtonActive = startIndex !== 1;
    if (!urlInfo) {
        url = String.format("https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=10&q={0}&start-index={1}", query, startIndex);
    } else { // is a link
        if (urlInfo.playlistId) {
            url = String.format("https://gdata.youtube.com/feeds/api/playlists/{0}?v=2&alt=json&max-results=10&start-index=", urlInfo.playlistId, startIndex);
        }
    }
    if (!url) {
        return;
    }
    $.getJSON(url, function(data) {
        entries = data.feed.entry;
        if (entries.length <= 9) {
            nextButtonActive = false;
        } else if (entries.length > 9) {
            entries.pop();
            nextButtonActive = true;
        }
        if (entries.length !== 0) {
            entriesHistory.push(entries);
            showResults(entries, nextButtonActive, prevButtonActive);
        }
    });
}

function showResults(entries, nextButtonActive, prevButtonActive) {
    $('#nextButton').prop('disabled', nextButtonActive);
    $('#prevButton').prop('disabled', prevButtonActive);
    $('.search-result').remove();
    $('#search-results').css('display', 'initial');

    var i;
    for (i = entries.length - 1; i >= 0; i -= 1) {
        addEntry(entries[i]);
    }
    if (entries.length % 3 !== 0) {

    }
}

function addEntry(entry) {
    var seconds,
        url,
        searchResult = searchResultTemplate.clone(false);

    if (entry.media$group.media$thumbnail === undefined) { //video got removed
        $('#search-results').prepend(
            $('<div>', {
                'class': 'search-result'
            }).text('Video Remove By Youtube').addClass('search-result').css('cursor', 'default')
        );
    } else {
        seconds = entry.media$group.yt$duration.seconds;

        searchResult.attr('href', getUrlOfInfo(parseUrl(entry.link[1].href))).hover(toggleElements, toggleElements);
        searchResult.find('>:eq(0)').attr('src', entry.media$group.media$thumbnail[0].url);
        searchResult.find('>:eq(1)>:eq(0)').text(entry.title.$t);
        searchResult.find('>:eq(2)>:eq(0)>').text(formatTime(seconds)).css('color', getDurationColor(seconds));

        if (GM_config.get('button-animations')) {
            searchResult.find('>:eq(3)').hover(function() {
                addAnimation($(this).children().eq(0), 'pulse');
            }, function() {
                removeAnimation($(this).children().eq(0), 'pulse');
            }).click(addSearchResultToPl);
        } else {
            searchResult.find('>:eq(3)').click(addSearchResultToPl);
        }

        $('#search-results').prepend(searchResult);
    }
}

function getDurationColor(seconds) {
    if (seconds < 60 * 15) {
        return 'white';
    } else if (seconds < 60 * 25) {
        return 'orange';
    }
    return 'red';
}

function formatTime(seconds) {
    var date = new Date(null),
        duration = '';
    date.setSeconds(seconds);
    if (date.getUTCHours() !== 0) {
        duration = date.getUTCHours() + 'h';
    }
    if ((date.getUTCMinutes() !== 0) || duration) {
        duration += date.getUTCMinutes() + 'm';
    }
    if ((date.getUTCSeconds() !== 0) || duration) {
        duration += date.getUTCSeconds() + 's';
    }
    return duration;
}

function closeResults() {
    $('#search-results').css('display', 'none');
}

function toggleElements(element) {
    $(element).find('>:eq(1)').toggleClass('opacity0');
    $(element).find('>:eq(3)').toggleClass('opacity0');
}

function addSearchResultToPl(element) {
    unsafeWindow.global.sendcmd('add', {
        URL: $(element).parent().attr('href')
    });
}
var page = 0,
    query,
    urlInfo,
    entriesHistory,
    searchResultTemplate,
    searchTimeout;

events.bind('onPreConnect', loadYoutubeSearch);
events.bind('onExecuteOnce', loadYoutbeSearchOnce);