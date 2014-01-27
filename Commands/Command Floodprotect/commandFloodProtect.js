/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2014  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2014  Bibbytube

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
function loadCommandFloodProtect() {
    var oldsendcmd = unsafeWindow.sendcmd;
    unsafeWindow.sendcmd = function (command, data) {
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
                setTimeout(function () {
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
