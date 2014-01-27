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

setField({
    'name': 'LogInOffMessages',
    'data': {
        'label': 'Login/off Messages',
        'type': 'checkbox',
        'default': false
    },
    'section': 'Chat Additions'
});


function loadLogInOffMessages() {
    onAddUser.push({
        callback: function (user, css, sort) {
            if (user.loggedin && GM_config.get('LogInOffMessages')) {
                unsafeWindow.addMessage('', String.format('{0} logged on.', user.username), '', 'hashtext');
            }
        }
    });
    onRemoveUser.push({
        callback: function (id, user) {
            if (user.loggedin && GM_config.get('LogInOffMessages')) {
                unsafeWindow.addMessage('', String.format('{0} logged off.', user.username), '', 'hashtext');
            }
        }
    });
}

postConnectFunctions.push(loadLogInOffMessages);
