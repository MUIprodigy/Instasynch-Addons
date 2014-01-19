/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/
function loadCommandLoader() {
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
        function (event) {
            try {
                var parsed = JSON.parse(event.data);
                if (parsed.commandParameters) {
                    items.commandFunctionMap[parsed.commandParameters[0].toLowerCase()](parsed.commandParameters);
                }
            } catch (ignore) {}
        }, false);

    commands = {
        set: function (arrayName, funcName, func, description) {
            if (funcName[0] !== '$') {
                funcName = "'" + funcName;
            }
            items[arrayName].push(funcName);
            items.commandFunctionMap[funcName.toLowerCase()] = func;
            items.descriptionMap[funcName.toLowerCase()] = description;
        },
        get: function (arrayName) {
            return items[arrayName];
        },
        getDescription: function (funcName) {
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
        getAll: function () {
            return items;
        },
        execute: function (funcName, params) {
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

    $("#chat input").bind("keypress", function (event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var params = $(this).val().split(' ');
            commands.execute(params[0], params);
        }
    });
}
var commands,
    commandExecuted = false;