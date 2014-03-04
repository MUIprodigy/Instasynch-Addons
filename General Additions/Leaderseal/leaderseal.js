function loadLeaderSeal() {
    var oldMakeLeader = unsafeWindow.makeLeader;
    unsafeWindow.makeLeader = function(userId) {
        oldMakeLeader(userId);
        $('#leaderSymbol').attr('src', 'http://i.imgur.com/BMpkAgE.png');
    };
}

events.bind('onPreConnect', loadLeaderSeal);