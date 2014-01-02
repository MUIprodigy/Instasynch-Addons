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
    searchTimeout;

// Search results container
var divresults = document.createElement('div');
divresults.id = 'searchResults';
divresults.style.cssFloat = 'right'; // All but IE
divresults.style.styleFloat = 'right'; //IE
divresults.style.width = '380px'; 
divresults.style.marginTop = '10px';
divresults.style.backgroundColor = '#DFDFDF';
divresults.style.opacity = '0.9';
divresults.style.padding = '5px';
divresults.style.display = 'none';
divresults.style.position = 'relative';

// Close button container
var divremove = document.createElement('div');
divremove.id = 'divclosesearch';
divremove.innerHTML = '<img src="http://www.instasynch.com/images/close.png">';
divremove.style.cssFloat = 'right'; // All but IE
divremove.style.styleFloat = 'right'; //IE
divremove.style.cursor = 'pointer';
divremove.style.display = 'none';
divremove.style.position = 'absolute';
divremove.style.right = '0px';
divremove.style.top = '0px';    

// 'Moar' link container
var divmore = document.createElement('div');
divmore.id = 'divmore';
var nextDisabled = false;
var prevDisabled = false;

divmore.innerHTML = '<input id="prevButton" disabled type="button" style="cursor:pointer" value="&lt&lt Prev"/> </span>';
divmore.innerHTML += '<input id="nextButton" disabled type="button" style="cursor:pointer" value="Next &gt&gt"/>';

divmore.style.textAlign='center';
divmore.style.height='300px';
divmore.style.width = '380px'; 
divmore.style.position='relative';
divmore.style.zIndex='1';

// Getting poll container's parent to insert search result container
var divpolls = document.getElementsByClassName('poll-container')[0];
var divpollparent = divpolls.parentNode;
divpollparent.insertBefore(divresults,divpolls);

// Setting events on the URL input
$("#URLinput").bind("keydown", function(event) {
    if(event.keyCode === $.ui.keyCode.ESCAPE){
        closeResults();
    }else{
        if(searchTimeout){
            clearInterval(searchTimeout);
        }
        searchTimeout = setTimeout(startSearch,500);  
    }
});

function startSearch(){
    searchTimeout = null;
    closeResults();
    search();
}
// Retrieve data from the search query
function search(){
    var query,
        url,
        urlInfo;
    
    query = document.getElementById('URLinput').value;
    if(!query){  // if empty
        return;
    }else{  // is not empty
        urlInfo = parseUrl(query);
        if (!urlInfo){ // is not a link
            isPlaylist = false;
            url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
            $.getJSON(url,
                function(data){
                    var feed = data.feed;
                    entries = feed.entry;
                    showResults(entries,0);
                }
            );
        }else{ // is a link
            if (!urlInfo.playlistId){ // not a playlist
                return;
            }else{ // is a playlist
                entries = [];
                var buildMoreEntries = true;
                startIndex = 1;
                isPlaylist = true;
                while (buildMoreEntries){
                    url = "https://gdata.youtube.com/feeds/api/playlists/" + urlInfo.playlistId + "?v=2&alt=json&max-results=50&start-index=" + startIndex;
                    $.ajax({
                        async: false,
                        url: url,
                        dataType: "json",
                        success: function(data){
                            var feed = data.feed;
                            partialEntries = feed.entry;

                            if (entries.length === 0){
                                entries = partialEntries;
                            }else{
                                entries = entries.concat(partialEntries);
                            }
                            
                            if (partialEntries.length >= 49){
                                startIndex = startIndex + 50;
                            }else{
                                buildMoreEntries = false;
                            }
                        },
                        error: function(){
                            buildMoreEntries = false;
                        }
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
    var html = [],
        i,
        entry;
  
    $("#searchResults").empty();
    if (entries.length === 0) {
        return;
    }
    for (i = indexOfSearch; i < Math.min(indexOfSearch+resultsPerPage, entries.length); i++) {
        entry = entries[i];
        if (entry.media$group.media$thumbnail !== undefined){ // won't do shit if the video was removed by youtube.
            var date = new Date(null),
                durationSeconds = entry.media$group.yt$duration.seconds, // video duration in seconds
                durationColor = 'white', // color of shown duration
                duration = '', // the displayed duration text
                thumbnailUrl = entry.media$group.media$thumbnail[0].url,
                title = entry.title.$t,
                id,
                link = "http://www.youtube.com/watch?v=";
            if (!isPlaylist){
                var idtag = [];
                idtag = entry.id.$t.split(':');
                id = idtag[3];
            }else{       
                var feedURL = entry.link[1].href,
                    infoURL = parseUrl(feedURL);
                id = infoURL.id;
            }
            if (durationSeconds > 60*15) {
                durationColor = 'orange';
            }
            if (durationSeconds > 60*25) {
                durationColor = 'red';
            }

            // create duration text "12h34m56s", skipping leading zeros for hours and minutes
            date.setSeconds(durationSeconds);
            if (date.getUTCHours() != 0) {
                duration = date.getUTCHours() + 'h';
            }
            if ((date.getUTCMinutes() != 0) || duration) {
                duration += date.getUTCMinutes() + 'm';
            }
            if ((date.getUTCSeconds() != 0) || duration) {
                duration += date.getUTCSeconds() + 's'
            }

            link += id;

            $("#searchResults").append(
                $('<div>')
            ).append(
                $('<div>').append(
                    $('<img>',{'src':thumbnailUrl})
                ).append(
                    $('<p>').append(
                        $('<span>').text(title).css('background','rgba(0, 0, 0, 0.7)').css('color','white')
                    ).css('position','absolute').css('top','5px').css('left','5px').css('display','none')
                ).append(
                    $('<p>').text(link).css('display','none').addClass('videourl')
                ).append(
                    $('<p>').append(
                        $('<span>').text(duration).css('background','rgba(0, 0, 0, 0.7').css('color',durationColor)
                    ).css('position','absolute').css('bottom','0px').css('right','0px')
                ).css('overflow','hidden').css('position','relative').css('float','left').css('height','90px').css('width','120px').css('margin','1px').css('cursor','pointer').css('z-index','2').click(addLinkToPl).hover(showTitle,hideTitle)
            )
        }else{
            html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'> Video Removed By Youtube </div>");
        }
    }
    $(html.join('')).appendTo("#searchResults");

    divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
    divresults.appendChild(divmore);
    $('#searchResults').css('display','block');
    $('#divclosesearch').css('display','block').click(closeResults);
    // update buttons
    prevDisabled = (indexOfSearch > 0) ? false : true;
    nextDisabled = (indexOfSearch < entries.length - resultsPerPage) ? false : true;

    $('#nextButton').attr('disabled',nextDisabled).click(getNextResultPage);
    $('#prevButton').attr('disabled',prevDisabled).click(getPreviousResultPage);
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
function showTitle(e){
    e.currentTarget.childNodes[1].style.display='block';
}

// hide the video title on mouse out
function hideTitle(e){
    e.currentTarget.childNodes[1].style.display='none';
}

// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.currentTarget.childNodes[2].innerHTML,
        addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults(){
    $("#searchResults").empty();
    entries = [];
    partialEntries = [];
    divresults.style.display = "none";
    divremove.style.display = "none";
}