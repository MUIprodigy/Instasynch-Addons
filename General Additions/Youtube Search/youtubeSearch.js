function loadYoutbeSearchOnce() {
    GM_addStyle(GM_getResourceText('youtubeSearchCSS'));
    searchResultTemplate = $('<a>', {
        'target': '_blank'
    }).append(
        $('<img>').addClass('search-result-thumbnail')
    ).append(
        $('<p>').append(
            $('<span>').addClass('text-shadow')
        ).addClass('search-result-duration')
    ).append(
        $('<div>').append(
            $('<div>', {
                'class': 'controlIcon',
                'title': 'Add Video'
            }).append(
                $('<div>').css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)').addClass('animationContainer')
            ).addClass('search-result-add')
        ).append(
            $('<span>').addClass('text-shadow').addClass('search-result-title')
        ).addClass('opacity0').addClass('search-result-inf')
    ).addClass('search-result');
}

function loadYoutubeSearch() {
    //insert search result container
    $('.poll-container').before(
        $('<div>', {
            'id': 'search-results'
        }).append(
            $('<div>', {
                'id': 'divmore'
            }).append(
                $('<input>', {
                    'id': 'prevButton'
                }).prop('disabled', true).prop('type', 'button').val('<< Prev').click(prevPage)
            ).append(
                $('<input>', {
                    'id': 'nextButton'
                }).prop('disabled', true).prop('type', 'button').val('Next >>').click(nextPage)
            )
        ).append(
            $('<div>', {
                'id': 'divclosesearch'
            }).addClass('x').click(closeResults)
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
        urlInfo = urlParser.parse(query);
        entriesHistory = [];
        page = 0;
        $('#divmore').css('display', 'block');
        search(0, true, true);
    }
}

function prevPage() {
    page--;
    showResults(entriesHistory[page], page !== 0);
    $('#nextButton').prop('disabled', false);
}

function nextPage() {
    page++;
    showResults(entriesHistory[page], true);
    if (page === entriesHistory.length - 1) {
        if (entriesHistory[page].length === 9) {
            search((page + 1) * 9, false, false);
        }
    } else {
        $('#nextButton').prop('disabled', false);
    }
}

function search(startIndex, show, nextResults) {
    startIndex = startIndex + 1;
    var entries,
        url,
        prevButtonActive = startIndex !== 1;
    if (!urlInfo) {
        url = String.format("https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=9&q={0}&start-index={1}&safeSearch=none", query, startIndex);
    } else { // is a link
        if (urlInfo.playlistId) {
            url = String.format("https://gdata.youtube.com/feeds/api/playlists/{0}?v=2&alt=json&max-results=9&start-index={1}&safeSearch=none", urlInfo.playlistId, startIndex);
        }
    }
    if (!url) {
        return;
    }
    $.getJSON(url, function(data) {
        entries = data.feed.entry;
        if (entries && entries.length !== 0) {
            entriesHistory.push(entries);
            if (show) {
                showResults(entries, prevButtonActive);
            }
            $('#nextButton').prop('disabled', false);
            if (nextResults) {
                search(startIndex + 9, false, false);
            }
        } else {
            $('#nextButton').prop('disabled', true);
        }
    });
}

function showResults(entries, prevButtonActive) {
    $('#prevButton').prop('disabled', !prevButtonActive);
    $('#nextButton').prop('disabled', true);
    $('.search-result').remove();
    $('#search-results').css('display', 'initial');

    var i;
    for (i = 0; i < 9 - entries.length; i += 1) {
        $('#search-results').prepend(
            $('<div>').css('cursor', 'default').addClass('search-result')
        );
    }
    for (i = entries.length - 1; i >= 0; i -= 1) {
        addEntry(entries[i]);
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

        searchResult.attr('href', urlParser.createUrl(urlParser.parse(entry.link[1].href))).hover(toggleElements, toggleElements);
        searchResult.find('>:eq(0)').attr('src', entry.media$group.media$thumbnail[0].url);
        searchResult.find('>:eq(1)>:eq(0)').text(formatTime(seconds)).css('color', getDurationColor(seconds));
        searchResult.find('>:eq(2)>:eq(1)').text(entry.title.$t);

        if (GM_config.get('button-animations')) {
            searchResult.find('>:eq(2)>:eq(0)').hover(function() {
                addAnimation($(this).children().eq(0), 'pulse');
            }, function() {
                removeAnimation($(this).children().eq(0), 'pulse');
            }).click(addSearchResultToPl);
        } else {
            searchResult.find('>:eq(2)>:eq(0)').click(addSearchResultToPl);
        }

        $('#search-results').prepend(searchResult);
    }
}

function getDurationColor(seconds) {
    if (seconds < 60 * 15) {
        return 'white';
    }
    if (seconds < 60 * 25) {
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

function toggleElements() {
    $(this).find('>:eq(2)').toggleClass('opacity0');
}

function addSearchResultToPl(event) {
    unsafeWindow.global.sendcmd('add', {
        URL: $(this).parent().parent().attr('href')
    });
    return false;
}
var page = 0,
    query,
    urlInfo,
    entriesHistory,
    searchResultTemplate,
    searchTimeout;

events.bind('onPreConnect', loadYoutubeSearch);
events.bind('onExecuteOnce', loadYoutbeSearchOnce);