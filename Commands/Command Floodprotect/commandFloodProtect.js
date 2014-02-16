function loadCommandFloodProtect() {
    var oldsendcmd = unsafeWindow.sendcmd;
    unsafeWindow.sendcmd = function(command, data) {
        if (command) {
            //add the command to the cache
            commandCache.push({
                command: command,
                data: data
            });
        }
        //are we ready to send a command?
        if (sendcmdReady) {
            if (commandCache.length !== 0) {
                //set not ready
                sendcmdReady = false;
                //send the command
                oldsendcmd(commandCache[0].command, commandCache[0].data);
                //remove the sent command
                commandCache.splice(0, 1);
                //after 400ms send the next command
                setTimeout(function() {
                    sendcmdReady = true;
                    unsafeWindow.sendcmd();
                }, 400);
            }
        }
    };
}

var sendcmdReady = true,
    commandCache = [];

preConnectFunctions.push(loadCommandFloodProtect);