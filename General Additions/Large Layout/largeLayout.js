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

setField({
    'name': 'Layout',
    'data': {
        'label': 'Layout',
        'type': 'select',
        'options': ['normal', 'large'],
        'default': 'normal'
    },
    'section': 'General Additions'
});

function loadLayout() {
    var oldLayout = GM_config.get('Layout');
    onSettingsOpen.push(function () {
        oldLayout = GM_config.get('Layout');
    });
    onSettingsSave.push(function () {
        if (oldLayout !== GM_config.get('Layout')) {
            changeLayout();
            oldLayout = GM_config.get('Layout');
        }
    });
    $('#playlistcontrols').css('width', '100%');
    $('.sliderContainer').css('width', '100%');
    $('.roomFooter ').css('margin-top', '0px')
    if (GM_config.get('Layout') !== 'normal') {
        changeLayout();
    }

    function setLayout() {
        if (GM_config.get('Layout') !== $(this).text()) {
            GM_config.set('Layout', $(this).text());
            GM_config.save();
        }
    }
    var normal = $('<a>', {
        'id': 'normalLayout'
    }).text('normal').click(setLayout).css('margin', '0 2px 0 2px').css('color', 'white').css('cursor', 'pointer')
        .css('color', '#ccc').css('text-decoration', 'underline'),
        large = $('<a>', {
            'id': 'largeLayout'
        }).text('large').click(setLayout).css('margin', '0 2px 0 2px').css('color', 'white').css('cursor', 'pointer')
            .css('color', '#ccc').css('text-decoration', 'underline');
    switch (GM_config.get('Layout')) {
    case 'normal':
        normal.css('color', 'white').css('text-decoration', 'none').css('cursor', 'default');
        break;
    case 'large':
        large.css('color', 'white').css('text-decoration', 'none').css('cursor', 'default');
        break;
    }
    $('<div>', {
        'id': 'layout'
    }).text('layout:').css('color', 'white').css('text-align', 'center')
        .css('font-size', '13px').css('height', '20px').css('margin-top', '7px').insertBefore('#roomFooter');
    $('#layout').append(normal).append(large);
}

function changeLayout() {
    $('#layout').children().each(function () {
        $(this).css('color', '#ccc').css('text-decoration', 'underline').css('cursor', 'pointer');
    });
    $(String.format('#{0}Layout', GM_config.get('Layout'))).css('color', 'white').css('text-decoration', 'none').css('cursor', 'default');
    $('#layoutStyles').remove();
    switch (GM_config.get('Layout')) {
    case 'large':
        //css by v4c with some minor changes http://userscripts.org/scripts/show/182167
        $('head').append($('<style>', {
            'id': 'layoutStyles'
        }).text('.stage, #media-title .title, .top-descr, #footer .footer, #top {' +
            '    width: 1200px!important;' +
            '    overflow: hidden!important;' +
            '}' +
            '#media, #live_embed_player_flash, #media iframe {' +
            '    width: 750px!important;' +
            '    height: 436px!important;' +
            '}' +
            '#chat_list {' +
            '    height:395px!important;' +
            '}' +
            '#chat_users {' +
            '    height: 434px!important;' +
            '}' +
            '#chat {' +
            '    height: 436px!important;' +
            '}' +
            '#playlist {' +
            '    width: 749px!important;' +
            '}' +
            '.sliderContainer {' +
            '    width: 100%!important;' +
            '}' +
            '.sliderContainer .slider {' +
            '    width: 620px!important;' +
            '}' +
            '.poll-container {' +
            '    margin: 5px 26px 0 0!important;' +
            '}' +
            '#chat #join-chat input {' +
            '    margin: 118px 5px 0 100px!important;' +
            '}' +
            '#playlist_items {' +
            '    width: 750px' +
            '}' +
            '.pl-info {' +
            '    width: 680px!important;' +
            '}' +
            '.duration {' +
            '    right: 0px!important;' +
            '}' +
            '#playlist_items li .pl-info .expand {' +
            '    left: 692px!important;' +
            '}' +
            '#playlist_items li .pl-info .removeBtn {' +
            '    left: 710px!important;' +
            '}' +
            '.logoutput {' +
            '    margin-left: 1077px!important;' +
            '}' +
            '#playlist .playlist .pllist li .title {' +
            '    width: 630px!important;' +
            '}' +
            '#playlist .playlist #playlist_items {' +
            'height: 368px;' +
            '}' +
            '#searchResults {' +
            'right: 35px!important;' +
            '}'));
        break;
    }
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}

preConnectFunctions.push(loadLayout);