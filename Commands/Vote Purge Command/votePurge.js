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
function loadVotePurgeCommand() {
    commands.set('modCommands', "votepurge ", votePurge, 'Creates a poll if the user should be purged (purging still has to be done by hand). Parameters: the user.');
}

function votePurge(params) {
    var user = params[1],
        poll = {},
        option;

    if (!user) {
        unsafeWindow.addMessage('', 'No user specified: \'votePurge [user]', '', 'hashtext');
        return;
    }

    poll.title = "Should we purge " + user + " ? /babyseal";
    poll.options = [];
    option = "Yes !";
    poll.options.push(option);
    option = "No !";
    poll.options.push(option);

    unsafeWindow.sendcmd("poll-create", poll);
}

preConnectFunctions.push(loadVotePurgeCommand);