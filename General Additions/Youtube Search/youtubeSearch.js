/*
    Copyright (C) 2014  fugXD, restructure, convert to jquery.
*/
var resultsPerPage = 9,
    indexOfSearch,
    entries = [],
    partialEntries = [],
    isPlaylist,
    startIndex = 1,
    searchTimeout,
    divresults,
    divremove,
    divmore,
    nextDisabled,
    prevDisabled,
    nextButton,
    prevButton;

function loadYoutbeSearchOnce() {
    GM_addStyle(GM_getResourceText('youtubeSearchCSS'));
}

function loadYoutubeSearch() {
    // Search results container
    divresults = $('<div id="search-results" />');
    // Close button container
    divremove = $('<div id="divclosesearch" />').addClass('x');

    nextDisabled = false;
    prevDisabled = false;
    // 'Moar' link container
    prevButton = $('<input id="prevButton" />').prop('disabled', true).prop('type', 'button').val('<< Prev');
    nextButton = $('<input id="nextButton" />').prop('disabled', true).prop('type', 'button').val('Next >>');
    divmore = $('<div id="divmore" />').append(
        prevButton
    ).append(
        nextButton
    );

    //insert search result container
    $('.poll-container').before(divresults);

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
    search();
}
// Retrieve data from the search query
function search() {
    var query,
        url,
        urlInfo,
        buildMoreEntries;

    function success(data) {
        var feed = data.feed;
        partialEntries = feed.entry;

        if (entries.length === 0) {
            entries = partialEntries;
        } else {
            entries = entries.concat(partialEntries);
        }

        if (partialEntries.length >= 49) {
            startIndex = startIndex + 50;
        } else {
            buildMoreEntries = false;
        }
    }

    function error() {
        buildMoreEntries = false;
    }
    query = document.getElementById('URLinput').value;
    if (query) {
        urlInfo = parseUrl(query);
        if (!urlInfo) { // is not a link
            isPlaylist = false;
            url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
            $.getJSON(url,
                function(data) {
                    var feed = data.feed;
                    entries = feed.entry;
                    showResults(entries, 0);
                });
        } else { // is a link
            if (urlInfo.playlistId) { // is a playlist
                entries = [];
                buildMoreEntries = true;
                startIndex = 1;
                isPlaylist = true;
                while (buildMoreEntries) {
                    url = "https://gdata.youtube.com/feeds/api/playlists/" + urlInfo.playlistId + "?v=2&alt=json&max-results=50&start-index=" + startIndex;
                    $.ajax({
                        async: false,
                        url: url,
                        dataType: "json",
                        success: success,
                        error: error
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
    var i,
        entry,
        date,
        durationSeconds,
        durationColor,
        duration,
        thumbnailUrl,
        title,
        id,
        link,
        idtag,
        feedURL,
        infoURL;

    divresults.empty();
    if (entries.length === 0) {
        return;
    }
    for (i = indexOfSearch; i < Math.min(indexOfSearch + resultsPerPage, entries.length); i += 1) {
        entry = entries[i];
        if (entry.media$group.media$thumbnail !== undefined) { // won't do shit if the video was removed by youtube.
            date = new Date(null);
            durationSeconds = entry.media$group.yt$duration.seconds; // video duration in seconds
            durationColor = 'white'; // color of shown duration
            duration = ''; // the displayed duration text
            thumbnailUrl = entry.media$group.media$thumbnail[0].url;
            title = entry.title.$t;
            link = "http://www.youtube.com/watch?v=";
            if (!isPlaylist) {
                idtag = [];
                idtag = entry.id.$t.split(':');
                id = idtag[3];
            } else {
                feedURL = entry.link[1].href;
                infoURL = parseUrl(feedURL);
                id = infoURL.id;
            }
            if (durationSeconds > 60 * 15) {
                durationColor = 'orange';
            }
            if (durationSeconds > 60 * 25) {
                durationColor = 'red';
            }

            // create duration text "12h34m56s", skipping leading zeros for hours and minutes
            date.setSeconds(durationSeconds);
            if (date.getUTCHours() !== 0) {
                duration = date.getUTCHours() + 'h';
            }
            if ((date.getUTCMinutes() !== 0) || duration) {
                duration += date.getUTCMinutes() + 'm';
            }
            if ((date.getUTCSeconds() !== 0) || duration) {
                duration += date.getUTCSeconds() + 's';
            }

            link += id;

            divresults.append(
                $('<div>')
            ).append(
                $('<div>').append(
                    $('<img>', {
                        'src': thumbnailUrl
                    })
                ).append(
                    $('<p>').append(
                        $('<span>').text(title).css('background', 'rgba(0, 0, 0, 0.7)').css('color', 'white')
                    ).css('position', 'absolute').css('top', '5px').css('left', '5px').css('display', 'none')
                ).append(
                    $('<p>').text(link).css('display', 'none').addClass('videourl')
                ).append(
                    $('<p>').append(
                        $('<span>').text(duration).css('background', 'rgba(0, 0, 0, 0.7').css('color', durationColor)
                    ).css('position', 'absolute').css('bottom', '0px').css('right', '0px')
                ).addClass('search-result').click(addLinkToPl).hover(showTitle, hideTitle)
            );
        } else {
            divresults.append(
                $('<div>', {
                    'class': 'search-result'
                }).text('Video Remove By Youtube').addClass('search-result').css('cursor', 'default')
            );
        }
    }
    //fill empty spaces with empty divs 
    if (Math.min(indexOfSearch + resultsPerPage, entries.length) % 3 !== 0) {
        for (i = 0; i < 3 - Math.min(indexOfSearch + resultsPerPage, entries.length) % 3; i += 1) {
            divresults.append(
                $('<div>').css('cursor', 'default').addClass('search-result')
            );
        }
    }
    divresults.append(divremove);
    divresults.append(divmore);
    divresults.css('display', 'block');
    divremove.click(closeResults);

    // update buttons
    prevDisabled = (indexOfSearch > 0) ? false : true;
    nextDisabled = (indexOfSearch < entries.length - resultsPerPage) ? false : true;

    nextButton.attr('disabled', nextDisabled).click(getNextResultPage);
    prevButton.attr('disabled', prevDisabled).click(getPreviousResultPage);
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
function showTitle(e) {
    e.currentTarget.childNodes[1].style.display = 'block';
}

// hide the video title on mouse out
function hideTitle(e) {
    e.currentTarget.childNodes[1].style.display = 'none';
}

// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.currentTarget.childNodes[2].innerHTML,
        addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults() {
    divresults.empty();
    entries = [];
    partialEntries = [];
    divresults.css('display', 'none');
}

events.bind('onPreConnect', loadYoutubeSearch);
events.bind('onExecuteOnce', loadYoutbeSearchOnce);