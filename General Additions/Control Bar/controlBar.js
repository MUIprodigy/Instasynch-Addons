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

function loadControlBar() {
    $('#resynch').remove();
    $('#reload').remove();
    GM_addStyle('.controlIcon {' +
        ' float: right;+' +
        ' margin-right: 4px;' +
        ' margin-left: 4px;' +
        ' top: 3px;' +
        ' width: 17px;' +
        ' height: 17px;' +
        ' cursor: pointer;' +
        'position: relative; }' +

        '.spiralContainer {' +
        '-webkit-animation-play-state: paused;' +
        '-moz-animation-play-state: paused;' +
        '-ms-animation-play-state: paused;' +
        '-o-animation-play-state: paused;  ' +
        'animation-play-state: paused;}' +

        '.spiralContainer:hover {' +
        '-webkit-animation-play-state: running;' +
        '-moz-animation-play-state: running;' +
        '-ms-animation-play-state: running;' +
        '-o-animation-play-state: running;' +
        'animation-play-state: running;}' +

        '.spiral {' +
        'width:17px;' +
        'height:17px;' +
        'border-radius: 50%;' +
        '-webkit-animation: spin 2s linear 0s infinite reverse;' +
        '-moz-animation: spin 2s linear 0s infinite reverse;' +
        '-ms-animation: spin 2s linear 0s infinite reverse;' +
        '-o-animation: spin 2s linear 0s infinite reverse;' +
        'animation: spin 2s linear 0s infinite reverse; ' +
        '-webkit-animation-play-state: inherit;' +
        '-moz-animation-play-state: inherit;' +
        '-ms-animation-play-state: inherit;' +
        '-o-animation-play-state: inherit;' +
        'animation-play-state: inherit;}' +

        '@keyframes spin {' +
        '  0% { transform: rotate(360deg); }' +
        '  100% { transform: rotate(0deg); }' +
        '}' +
        '@-webkit-keyframes spin {' +
        '  0% {-webkit-transform: rotate(360deg); }' +
        '  100% { -webkit-transform: rotate(0deg); }' +
        '}' +
        '@-ms-keyframes spin {' +
        '  0% {-ms-transform: rotate(360deg); }' +
        '  100% { -ms-transform: rotate(0deg); }' +
        '}' +
        '@-moz-keyframes spin {' +
        '  0% { -moz-transform: rotate(360deg); }' +
        '  100% { -moz-transform: rotate(0deg); }' +
        '}' +
        '@-o-keyframes spin {' +
        '  0% { -o-transform: rotate(360deg); }' +
        '  100% { -o-transform: rotate(0deg); }' +
        '}');

    var spiral =
        $('<img>', {
            'class': 'spiral',
            'src': GM_getResourceURL('refreshIcon')
        });
    $('#toggleplaylistlock ').addClass('controlIcon');
    $('.basic-btn-btnbar').append(
        $('<div>', {
            'id': 'reloadPlayer',
            'title': 'Reload',
            'class': 'controlIcon spiralContainer',
        }).append(spiral.clone()).css('background-image', 'url(' + GM_getResourceURL('xIcon') + ')').click(function () {
            unsafeWindow.video.destroyPlayer();
            unsafeWindow.sendcmd('reload', null);
        }).mouseout(function () {
            $(this).empty().append(spiral.clone());
        })
    ).append(
        $('<div>', {
            'id': 'resynchPlayer',
            'title': 'Resynch',
            'class': 'controlIcon spiralContainer',
        }).append(spiral.clone()).css('background-image', 'url(' + GM_getResourceURL('playIcon') + ')').click(function () {
            unsafeWindow.sendcmd('resynch', null);
        }).mouseout(function () {
            $(this).empty().append(spiral.clone());
        })
    ).css('width', '97.5%');
    // $('#URLinput').css('margin-right', '0px');
    // $('#addVid').css('display', 'inline-table').css('top', '-1px');
    // $('#addUrl').text('+').css('margin-left', '0px').css('margin-right', '2px').css('position', 'relative')
    //     .css('top', '-2px').css('height', '13px').css('border-top-width', '2px')
    //     .css('border-right-width', '1px').css('width', '13px').css('padding', '2px 2px 4px 2px');
}

preConnectFunctions.push(loadControlBar);
