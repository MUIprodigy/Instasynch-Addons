function loadSkipCommand() {
    commands.set('regularCommands', "skip ", skip);
}

function skip() {
    unsafeWindow.global.sendcmd("skip", null);
}

executeOnceFunctions.push(loadSkipCommand);
