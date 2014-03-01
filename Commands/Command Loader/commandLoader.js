function loadCommandLoaderOnce() {
    var items = {};
    items.regularCommands = [
        "'reload",
        "'resynch",
        "'toggleFilter",
        "'toggleAutosynch",
        "'mute",
        "'unmute"
    ];
    items.modCommands = [
        "'togglePlaylistLock",
        "'ready",
        "'kick ",
        "'ban ",
        "'unban ",
        "'clean",
        "'remove ",
        "'purge ",
        "'move ",
        "'play ",
        "'pause",
        "'resume",
        "'seekto ",
        "'seekfrom ",
        "'setskip ",
        "'banlist",
        "'modlist",
        "'save",
        "'leaverban ",
        //commented those so you can't accidently use them
        //"'clearbans",
        //"'motd ",
        //"'mod ",
        //"'demod ",
        //"'description ",
        "'next"
    ];
    items.commandFunctionMap = {};
    items.descriptionMap = {};
    //listen to the sites message events
    //some commands need to be executed in the scope of GM for the API to work
    unsafeWindow.addEventListener("message",
        function(event) {
            try {
                var parsed = JSON.parse(event.data);
                if (parsed.commandParameters) {
                    items.commandFunctionMap[parsed.commandParameters[0].toLowerCase()](parsed.commandParameters);
                }
            } catch (ignore) {}
        }, false);

    commands = {
        set: function(arrayName, funcName, func, description) {
            if (funcName[0] !== '$') {
                funcName = "'" + funcName;
            }
            items[arrayName].push(funcName);
            items.commandFunctionMap[funcName.toLowerCase()] = func;
            items.descriptionMap[funcName.toLowerCase()] = description;
        },
        get: function(arrayName) {
            return items[arrayName];
        },
        getDescription: function(funcName) {
            funcName = funcName.toLowerCase();
            if (items.descriptionMap.hasOwnProperty(funcName + ' ')) {
                funcName = funcName + ' ';
            } else if (!items.descriptionMap.hasOwnProperty(funcName)) {
                funcName = undefined;
            }
            if (funcName) {
                return items.descriptionMap[funcName.toLowerCase()];
            }
        },
        getAll: function() {
            return items;
        },
        execute: function(funcName, params) {
            commandExecuted = false;
            funcName = funcName.toLowerCase();
            if (funcName[0] === '$') {
                return;
            }
            if (items.commandFunctionMap.hasOwnProperty(funcName + ' ')) {
                funcName = funcName + ' ';
            } else if (!items.commandFunctionMap.hasOwnProperty(funcName)) {
                funcName = undefined;
            }
            if (funcName) {
                commandExecuted = true;
                params[0] = funcName;
                //send the event to the site
                unsafeWindow.postMessage(JSON.stringify({
                    commandParameters: params
                }), "*");
                //items.commandFunctionMap[funcName](params);
            }
        }
    };
}

function loadCommandLoader() {
    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var params = $(this).val().split(' ');
            commands.execute(params[0], params);
        }
    });
}

var commands,
    commandExecuted = false;

preConnectionFunctions.push(loadCommandLoader);