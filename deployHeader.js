// ==UserScript==
// @name        InstaSynch Addons
// @namespace   Bibby
// @description adds lots of features 
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @include     http://instasynch.com/
// @include     http://*.instasynch.com/
// @version     @VERSION

// @author      faqqq
// @contributor fugXD
// @contributor Rollermiam
// @contributor BigBubba
// @contributor dirtyharry

// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_info
// @grant       GM_log
// @grant       GM_getResourceText

// @require     https://raw.github.com/sizzlemctwizzle/GM_config/master/gm_config.js
// @source      http://github.com/Bibbytube/Instasynch-Addons
// @downloadURL http://userscripts.org/scripts/source/181142.user.js
// @updateURL   http://userscripts.org/scripts/source/181142.meta.js

// @icon        http://i.imgur.com/bw2Zthys.jpg
// @icon64      http://i.imgur.com/f3vYHNNs.jpg

// @resource    controlBarCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Control%20Bar/controlBar.css
// @resource    fullscreenCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Control%20Bar/fullscreen.css
// @resource    youtubeSearchCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Youtube%20Search/youtubeSearch.css
// @resource    largeLayoutCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Large%20Layout/largeLayout.css
// @resource    largeLayoutSelectorCSS https://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Large%20Layout/largeLayoutSelector.css
// @resource    settingsLoaderCSS https://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Settings%20Loader/settingsLoader.css
// @resource    GM_configCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/General%20Additions/Settings%20Loader/GMconfig.css
// @resource    volumebarCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/Player%20Additions/Mousewheel%20Volumecontrol/volumebar.css
// @resource    progressbarCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/Player%20Additions/Progress%20Bar/progressbar.css
// @resource    bigPlaylistCSS http://raw.github.com/Bibbytube/Instasynch-Addons/Dev/Playlist%20Additions/BigPlaylist/bigPlaylist.css
// ==/UserScript==
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

var preConnectFunctions = [],
    postConnectFunctions = [],
    executeOnceFunctions = [],
    resetVariables = [],
    settingsFields = {},
    $ = unsafeWindow.$,
    jQuery = $,
    $f = unsafeWindow.$f;

function setField(field) {
    if (field.section) {
        settingsFields[field.section] = settingsFields[field.section] || {};
        if (field.subsection) {
            settingsFields[field.section][field.subsection] = settingsFields[field.section][field.subsection] || {};
            settingsFields[field.section][field.subsection][field.name] = field.data;
        } else {
            settingsFields[field.section][field.name] = field.data;
        }
    } else {
        settingsFields[field.name] = field.data;
    }
}

function executeFunctions(funcArray) {
    var i;
    for (i = 0; i < funcArray.length; i += 1) {
        try {
            funcArray[i](i);
        } catch (err) {
            logError(funcArray[i].name, err);
        }
    }
}

function postConnect() {
    executeFunctions(postConnectFunctions);
    onConnect.splice(onConnect.indexOf(postConnect), 1);
}

function preConnect() {
    executeFunctions(preConnectFunctions);
}

function executeOnce() {
    executeFunctions(executeOnceFunctions);
}