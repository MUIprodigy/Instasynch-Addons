function loadSkipCommand() {
    commands.set('regularCommands', "skip ", skip);
}

function skip() {
    unsafeWindow.sendcmd("skip", null);
}

preConnectFunctions.push(loadSkipCommand);