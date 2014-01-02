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
function loadSettingsLoader(){
    commands.set('regularCommands',"printAddOnSettings",printAddonSettings);
    commands.set('regularCommands',"clearAddOnSettings",clearAddonSettings);
    settings = new function() {
        this.set = function(key, val) {
            GM_setValue(key,val);     
            unsafeWindow.addMessage('', "["+key+": "+val+"] ", '', 'hashtext');
        },
        this.remove = function (key) { 
            GM_deleteValue(key);      
        },
        this.clear =  function() {
            var keyArr = settings.getAll(),
                i;
            for(i = 0; i < keyArr.length;i++) {
                settings.remove(keyArr[i]);
            }
        },
        this.get = function(key, val) {
            if(GM_getValue(key) === undefined){
                settings.set(key,val);
            }
            return GM_getValue(key);
        },
        this.getAll = function() {
            return GM_listValues();
        }
    };
}
var settings;

function printAddonSettings(){
    var output ="",
        keyArr = settings.getAll(),
        i;
    for(i = 0; i < keyArr.length;i++) {
        output += "["+keyArr[i]+": "+settings.get(keyArr[i])+"] ";
    }
    unsafeWindow.addMessage('', output, '', 'hashtext');
}
function clearAddonSettings(){
    settings.clear();
    unsafeWindow.addMessage('', 'Cleared the settings, hit f5 to restore default', '', 'hashtext');
}

