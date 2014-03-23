// ==UserScript==
// @name        InstaSynch Addons
// @namespace   Bibby
// @description adds lots of features 
// @include     http://*.instasynch.com/*
// @include     http://instasynch.com/*
// @version     @VERSION

// @author      faqqq
// @contributor fugXD
// @contributor Rollermiam
// @contributor BigBubba
// @contributor dirtyharry
// @contributor Catmosphere

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

// @resource    fullscreenCSS https://raw.github.com/Bibbytube/Instasynch-Addons/master/General%20Additions/Control%20Bar/fullscreen.css
// @resource    largeLayoutCSS https://raw.github.com/Bibbytube/Instasynch-Addons/master/General%20Additions/Large%20Layout/largeLayout.css
// @resource    GM_configCSS https://raw.githubusercontent.com/Bibbytube/Instasynch-Addons/master/General%20Additions/Settings%20Loader/GMconfig.css
// @resource    bigPlaylistCSS https://raw.github.com/Bibbytube/Instasynch-Addons/master/Playlist%20Additions/BigPlaylist/bigPlaylist.css
// @resource    generalCSS https://raw.githubusercontent.com/Bibbytube/Instasynch-Addons/master/General%20Additions/general.css

// @resource    defaultTheme https://raw.githubusercontent.com/Bibbytube/Instasynch-Addons/master/General%20Additions/Themes/defaultTheme.css
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

var settingsFields = {},
    $ = unsafeWindow.$,
    jQuery = $,
    $f = unsafeWindow.$f,
    events = new(function() {
        var listeners = {};

        this.bind = function(eventName, callback, preOld) {
            if (listeners[eventName] === undefined) {
                listeners[eventName] = [];
            }
            listeners[eventName].push({
                callback: callback,
                preOld: preOld | false
            });
        };
        this.once = function(eventName, callback, preOld) {
            this.unbind(eventName, callback);
            this.bind(eventName, callback, preOld);
        };
        this.unbind = function(eventName, callback) {
            var i;
            if (listeners[eventName] !== undefined) {
                for (i = 0; i < listeners[eventName].length; i += 1) {
                    if (listeners[eventName][i].callback === callback) {
                        listeners[eventName].splice(i, 1);
                        i -= 1;
                    }
                }
            }
        };
        this.fire = function(eventName, parameters, preOld) {
            var i,
                listenersCopy;
            preOld = preOld | false;
            if (listeners[eventName] === undefined) {
                return;
            }
            listenersCopy = [].concat(listeners[eventName]);

            for (i = 0; i < listenersCopy.length; i += 1) {
                if (!(listenersCopy[i].preOld ^ preOld)) {
                    try {
                        listenersCopy[i].callback.apply(this, parameters);
                    } catch (err) {
                        logError(listenersCopy[i].callback, err);
                    }
                }
            }
        };
    })();

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

function postConnect() {
    events.fire('onPostConnect');
}

events.bind('onExecuteOnce', loadNewLoadUserlist);
events.bind('onExecuteOnce', loadGeneralStuff);
events.bind('onExecuteOnce', loadCommandLoaderOnce);
events.bind('onExecuteOnce', loadSettingsLoader);
events.bind('onExecuteOnce', loadThemesOnce);
events.bind('onExecuteOnce', loadBigPlaylistOnce);


events.bind('onPreConnect', loadBigPlaylist);
events.bind('onPreConnect', loadControlBar);
events.bind('onPreConnect', loadEvents);
events.bind('onPreConnect', loadLayout);

//events.bind('onPostConnect', );