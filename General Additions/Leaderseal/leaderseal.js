function loadLeaderSeal() {
    var oldMakeLeader = unsafeWindow.makeLeader;
    unsafeWindow.makeLeader = function(userId) {
        oldMakeLeader(userId);
        $("#leaderSymbol").attr("src", "/favicon.ico");
    };
}

preConnectFunctions.push(loadLeaderSeal);