/*
    Copyright (C) 2014  faqqq @Bibbytube
    
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
function parseUrl(url) {
    //Parse urls from  youtube / twitch / vimeo / dailymotion / livestream

    var match = url.match(/(https?:\/\/)?([^\.]+\.)?(\w+)\./i),
        provider = match ? match[3] : undefined, //the provider e.g. youtube,twitch ...
        mediaType, // stream, video or playlist (no youtube streams)
        id, //the video-id 
        channel, //for twitch and livestream
        playlistId; //youtube playlistId;
    if (match === null) {
        /*error*/
        return false;
    }
    switch (provider) {
    case 'youtu':
    case 'youtube':
        provider = 'youtube';
        match = url.match(/(((v|be|videos)\/)|(v=))([\w\-]{11})/i);
        id = match ? match[5] : undefined;
        match = url.match(/list=([\w\-]+)/i);
        playlistId = match ? match[1] : undefined;

        if (!id && !playlistId) {
            return false;
        }
        if (id) {
            mediaType = 'video';
        } else {
            mediaType = 'playlist';
        }
        break;
    case 'twitch':
        match = url.match(/twitch\.tv\/([\w]+)(\/.\/(\d+))?/i);
        channel = match ? match[1] : undefined;
        if (!channel) {
            return false;
        }
        id = match[3];
        if (id) {
            mediaType = 'video';
        } else {
            mediaType = 'stream';
        }
        break;
    case 'vimeo':
        match = url.match(/(\/((channels\/[\w]+)|(album\/\d+)?\/video))?\/(\d+)/i);
        id = match ? match[5] : undefined;
        if (!id) {
            return false;
        }
        mediaType = 'video';
        break;
    case 'dai':
    case 'dailymotion':
        provider = 'dailymotion';
        match = url.match(/(((\/video)|(ly))|#video=)\/([^_]+)/i);
        id = match ? match[5] : undefined;
        if (!id) {
            return false;
        }
        mediaType = 'video';
        break;
    case 'livestream':
        match = url.match(/livestream\.com\/(\w+)/i);
        channel = match ? match[1] : undefined;
        if (!channel) {
            return false;
        }
        mediaType = 'stream';
        break;
    default:
        /*error*/
        return false;
    }

    //return the data
    return {
        'provider': provider,
        'mediaType': mediaType,
        'id': id,
        'playlistId': playlistId,
        'channel': channel
    };
}
