function loadHistory() {
    commands.set('regularCommands', "history", printHistory, 'Shows the last 9 played videos on the YoutubeSearch panel.');
    events.bind('onPlayVideo', function(vidinfo, time, playing, indexOfVid) {
        //Keep the last 9 videos
        if (history.length === 9) {
            history.pop();
        }
        if (history[history.length - 1] !== unsafeWindow.playlist[indexOfVid]) {
            var video = unsafeWindow.playlist[indexOfVid];
            history.splice(0, 0, {
                media$group: {
                    media$thumbnail: [{
                        url: video.info.thumbnail
                    }],
                    yt$duration: {
                        seconds: video.duration
                    }
                },
                title: {
                    $t: video.title
                },
                link: [{}, {
                    href: getUrlOfInfo(video.info)
                }]
            });
        }
    });
}

function printHistory() {
    $('#divmore').css('display', 'none');
    showResults(history);
}

var history = [];

events.bind('onExecuteOnce', loadHistory);