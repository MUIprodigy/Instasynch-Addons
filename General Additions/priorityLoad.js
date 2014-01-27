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
//Scripts that need to be loaded first
function loadPreConnectionPrePriorityScripts() {
    executeFunctions([
        loadNewLoadUserlist,
        loadGeneralStuff,
        loadCommandLoader,
        loadSettingsLoader,
        loadBigPlaylist,
        loadNewLoadUserlist,
        loadEvents
    ]);
}

function loadPreConnectionPostPriorityScripts() {
    if (preConnectFunctions.lastIndexOf(loadPreConnectionPostPriorityScripts) !== preConnectFunctions.length - 1) {
        preConnectFunctions.push(loadPreConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([loadPriorityEvents]);
}

function loadPostConnectionPrePriorityScripts() {

}

function loadPostConnectionPostPriorityScripts() {
    if (postConnectFunctions.lastIndexOf(loadPostConnectionPostPriorityScripts) !== postConnectFunctions.length - 1) {
        postConnectFunctions.push(loadPostConnectionPostPriorityScripts);
        return;
    }
    executeFunctions([loadAutoComplete]);
}
preConnectFunctions.splice(0, 0, loadPreConnectionPrePriorityScripts);
preConnectFunctions.push(loadPreConnectionPostPriorityScripts);

postConnectFunctions.splice(0, 0, loadPostConnectionPrePriorityScripts);
postConnectFunctions.push(loadPostConnectionPostPriorityScripts);
