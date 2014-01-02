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


function loadTimestamp(){
    //load settings
    timestamp = settings.get('Timestamp',true);

    //add the commands
    commands.set('addOnSettings',"Timestamp",toggleTimestamp);

    var oldAddMessage = unsafeWindow.addMessage,
        date,
        hours,
        minutes;

    //overwrite InstaSynch's addMessage function
    unsafeWindow.addMessage = function(username, message, userstyle, textstyle) {
        if(timestamp){
            date = new Date();
            minutes = date.getMinutes();
            if(minutes < 10){
                minutes = "0" + minutes;
            }
            hours = date.getHours();
            if(hours < 10){
                hours = "0" + hours;
            }
            username = hours + ":" + minutes + " - " + username;
        }
        oldAddMessage(username, message, userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };
}
function toggleTimestamp(){
    timestamp = !timestamp; 
    settings.set('Timestamp',timestamp);
}
var timestamp = true;

preConnectFunctions.push(loadTimestamp);
