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
function loadHelpCommand() {
    commands.set('regularCommands', "help ", help, 'Prints out all the commands (use $help for bot commands) or prints more info on a specific command. Optional Parameter: the command to get info on.');
}

function help(params) {
    var description,
        output = '';
    if (params[1]) {
        description = commands.getDescription(params[1]);
        if (!description) {
            output = String.format('Command {0} not found', params[1]);
        } else {
            output = String.format('{0}: {1}', params[1], description);
        }
    } else {
        output += commands.get('modCommands').join(' ') + ' ';
        output += commands.get('regularCommands').join(' ') + ' ';
        output += commands.get('addOnSettings').join(' ');
        output = output.replace(/\$[\w]+ /g, '');
    }
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

preConnectFunctions.push(loadHelpCommand);