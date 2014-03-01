function loadSkipCommand() {
    commands.set('regularCommands', "skip ", skip);
}

function skip() {
    unsafeWindow.sendcmd("skip", null);
}

executeOnceFunctions.push(loadSkipCommand);