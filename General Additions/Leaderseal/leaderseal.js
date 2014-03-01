function loadLeaderSeal() {
    var oldMakeLeader = unsafeWindow.makeLeader;
    unsafeWindow.makeLeader = function(userId) {
        oldMakeLeader(userId);
        $('#leaderSymbol').attr('src', 'http://i.imgur.com/BMpkAgE.png');
    };
}

preConnectFunctions.push(loadLeaderSeal);