function loadBotCommands() {
    var emptyFunc = function() {};

    commands.set('modCommands', "$autoclean", emptyFunc);
    commands.set('modCommands', "$addRandom ", emptyFunc);
    commands.set('modCommands', "$addToUserBlacklist ", emptyFunc);
    commands.set('modCommands', "$addToVideoBlacklist ", emptyFunc);
    commands.set('modCommands', "$addAutobanMessage ", emptyFunc);
    commands.set('modCommands', "$clearAutobanMessages", emptyFunc);
    commands.set('modCommands', "$voteBump ", emptyFunc);
    commands.set('modCommands', "$shuffle ", emptyFunc);
    commands.set('modCommands', "$exportUserBlacklist", emptyFunc);
    commands.set('modCommands', "$poll ", emptyFunc);
    commands.set('modCommands', "$mute", emptyFunc);
    commands.set('modCommands', "$bump ", emptyFunc);

    commands.set('regularCommands', "$translateTitle", emptyFunc);
    commands.set('regularCommands', "$greet", emptyFunc);
    commands.set('regularCommands', "$derka ", emptyFunc);
    commands.set('regularCommands', "$ask ", emptyFunc);
    commands.set('regularCommands', "$askC ", emptyFunc);
    commands.set('regularCommands', "$askJ ", emptyFunc);
    commands.set('regularCommands', "$eval ", emptyFunc);
    commands.set('regularCommands', "$emotes", emptyFunc);
    commands.set('regularCommands', "$script", emptyFunc);
    commands.set('regularCommands', "$wolfram ", emptyFunc);
    commands.set('regularCommands', "$8Ball ", emptyFunc);
    commands.set('regularCommands', "$roll ", emptyFunc);
    commands.set('regularCommands', "$quote ", emptyFunc);
    commands.set('regularCommands', "$help ", emptyFunc);
    commands.set('regularCommands', "$stats", emptyFunc);
    commands.set('regularCommands', "$skiprate", emptyFunc);
    commands.set('regularCommands', "$mostPlayed", emptyFunc);
    commands.set('regularCommands', "$exportPlaylist ", emptyFunc);
    commands.set('regularCommands', "$rustle ", emptyFunc);
}

preConnectFunctions.push(loadBotCommands);