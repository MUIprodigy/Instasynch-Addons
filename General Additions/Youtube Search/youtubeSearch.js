/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube
    Copyright (C) 2014  fugXD, restructure, convert to jquery.

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
    searchTimeout,
    divresults,
    divremove,
    divmore,
    nextDisabled,
    prevDisabled,
    nextButton,
    prevButton;

function loadYoutubeSearch() {
    // Search results container
    divresults = $('<div id="searchResults" />')
        .css('cssFloat', 'right').css('styleFloat', 'right')
        .css('width', '380px').css('marginTop', '10px')
        .css('backgroundColor', '#DFDFDF').css('opacity', '0.9')
        .css('padding', '5px').css('display', 'none')
        .css('position', 'relative').css('right', '10px');
    // Close button container
    divremove = $('<div id="divclosesearch" />').addClass('x')
        .css('right', '0px').css('left', '')
        .css('top', '0px').css('position', 'absolute')
        .css('z-index', '2');

    nextDisabled = false;
    prevDisabled = false;
    // 'Moar' link container
    prevButton = $('<input id="prevButton" />').prop('disabled', true).prop('type', 'button').val('<< Prev').css('cursor', 'pointer');
    nextButton = $('<input id="nextButton" />').prop('disabled', true).prop('type', 'button').val('Next >>').css('cursor', 'pointer');
    divmore = $('<div id="divmore" />').append(
        prevButton
    ).append(
        nextButton
    ).css('textAlign', 'center').css('height', 'auto')
        .css('width', '380px').css('position', 'relative')
        .css('zIndex', '1');

    //insert search result container
    $('.poll-container').before(divresults);

    // Setting events on the URL input
    $("#URLinput").bind("keydown", function (event) {
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
                function (data) {
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
                ).css('overflow', 'hidden').css('position', 'relative').css('float', 'left').css('height', '90px').css('width', '120px').css('margin', '1px').css('cursor', 'pointer').css('z-index', '2').click(addLinkToPl).hover(showTitle, hideTitle)
            );
        } else {
            divresults.append(
                $('<div>').text('Video Remove By Youtube').css('overflow', 'hidden').css('position', 'relative').css('float', 'left').css('height', '90px').css('width', '120px').css('margin', '1px')
            );
        }
    }
    //fill empty spaces with empty divs 
    if (Math.min(indexOfSearch + resultsPerPage, entries.length) % 3 !== 0) {
        for (i = 0; i < 3 - Math.min(indexOfSearch + resultsPerPage, entries.length) % 3; i += 1) {
            divresults.append(
                $('<div>').css('overflow', 'hidden').css('position', 'relative').css('float', 'left').css('height', '90px').css('width', '120px').css('margin', '1px')
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

preConnectFunctions.push(loadYoutubeSearch);