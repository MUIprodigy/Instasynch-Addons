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
    GM_addStyle('.controlIcon {'.concat(
        '  float: right;',
        '  margin-right: 2px;',
        '  margin-left: 2px;',
        '  width: 23px;',
        '  height: 23px;',
        '  cursor: pointer;',
        '  position: relative;',
        '  transition:background-color 0.2s ease-in-out;',
        '  -webkit-transition:background-color 0.2s ease-in-out;',
        '  -moz-transition:background-color 0.2s ease-in-out;',
        '  background-color: #2eb6e6',
        '}',
        '.controlIcon:hover{',
        '  background-color: #2284B5',
        '}',
        '.click-nav ul .clicker {',
        '  background: #2eb6e6;',
        '  color: #FFF;',
        '}',
        '.click-nav ul .clicker:hover {',
        '  background: #2284B5;',
        '}',
        '.animationContainer {',
        '  -webkit-animation-play-state: paused;',
        '  -moz-animation-play-state: paused;',
        '  -ms-animation-play-state: paused;',
        '  -o-animation-play-state: paused;',
        '  animation-play-state: paused;',
        '}',
        '.animationContainer:hover {',
        ' -webkit-animation-play-state: running;',
        '  -moz-animation-play-state: running;',
        '  -ms-animation-play-state: running;',
        '  -o-animation-play-state: running;',
        '  animation-play-state: running;',
        '}',
        '.spiral {',
        '  width:23px;',
        '  height:23px;',
        '  border-radius: 50%;',
        '  -webkit-animation: spiral 1s linear 0s infinite reverse;',
        '  -moz-animation: spiral 1s linear 0s infinite reverse;',
        '  -ms-animation: spiral 1s linear 0s infinite reverse;',
        '  -o-animation: spiral 1s linear 0s infinite reverse;',
        '  animation: spiral 1s linear 0s infinite reverse; ',
        '  -webkit-animation-play-state: inherit;',
        '  -moz-animation-play-state: inherit;',
        '  -ms-animation-play-state: inherit;',
        '  -o-animation-play-state: inherit;',
        '  animation-play-state: inherit;',
        '}',
        '@keyframes spiral {',
        '  0% { transform: rotate(360deg); }',
        '  100% { transform: rotate(0deg); }',
        '}',
        '@-webkit-keyframes spiral {',
        '  0% {-webkit-transform: rotate(360deg); }',
        '  100% { -webkit-transform: rotate(0deg); }',
        '}',
        '@-ms-keyframes spiral {',
        '  0% {-ms-transform: rotate(360deg); }',
        '  100% { -ms-transform: rotate(0deg); }',
        '}',
        '@-moz-keyframes spiral {',
        '  0% { -moz-transform: rotate(360deg); }',
        '  100% { -moz-transform: rotate(0deg); }',
        '}',
        '@-o-keyframes spiral {',
        '  0% { -o-transform: rotate(360deg); }',
        '  100% { -o-transform: rotate(0deg); }',
        '}',
        '.basic-btn-btnbar {',
        '  width: calc(100% - 11px)!important;',
        '}',
        '.spinner {',
        '  width:23px;',
        '  height:23px;',
        '  border-radius: 50%;',
        '  -webkit-animation: spinner 1s linear 0s infinite reverse;',
        '  -moz-animation: spinner 1s linear 0s infinite reverse;',
        '  -ms-animation: spinner 1s linear 0s infinite reverse;',
        '  -o-animation: spinner 1s linear 0s infinite reverse;',
        '  animation: spinner 1s linear 0s infinite reverse; ',
        '  -webkit-animation-play-state: inherit;',
        '  -moz-animation-play-state: inherit;',
        '  -ms-animation-play-state: inherit;',
        '  -o-animation-play-state: inherit;',
        '  animation-play-state: inherit;',
        '}',
        '@keyframes spinner {',
        '  0% { transform: rotateY(360deg); }',
        '  100% { transform: rotateY(0deg); }',
        '}',
        '@-webkit-keyframes spinner {',
        '  0% {-webkit-transform: rotateY(360deg); }',
        '  100% { -webkit-transform: rotateY(0deg); }',
        '}',
        '@-ms-keyframes spinner {',
        '  0% {-ms-transform: rotateY(360deg); }',
        '  100% { -ms-transform: rotateY(0deg); }',
        '}',
        '@-moz-keyframes spinner {',
        '  0% { -moz-transform: rotateY(360deg); }',
        '  100% { -moz-transform: rotateY(0deg); }',
        '}',
        '@-o-keyframes spinner {',
        '  0% { -o-transform: rotateY(360deg); }',
        '  100% { -o-transform: rotateY(0deg); }',
        '}',
        '.pulse {',
        '  width:23px;',
        '  height:23px;',
        '  border-radius: 50%;',
        '  -webkit-animation: pulse 1s linear 0s infinite reverse;',
        '  -moz-animation: pulse 1s linear 0s infinite reverse;',
        '  -ms-animation: pulse 1s linear 0s infinite reverse;',
        '  -o-animation: pulse 1s linear 0s infinite reverse;',
        '  animation: pulse 1s linear 0s infinite reverse; ',
        '  -webkit-animation-play-state: inherit;',
        '  -moz-animation-play-state: inherit;',
        '  -ms-animation-play-state: inherit;',
        '  -o-animation-play-state: inherit;',
        '  animation-play-state: inherit;',
        '}',
        '@keyframes pulse {',
        '  0%, 100% { transform: scale(1); }',
        '  50% { transform: scale(1.2); }',
        '}',
        '@-webkit-keyframes pulse {',
        '  0%, 100% { -webkit-transform: scale(1); }',
        '  50% { -webkit-transform: scale(1.2); }',
        '}',
        '@-ms-keyframes pulse {',
        '  0%, 100% { -ms-transform: scale(1); }',
        '  50% { -ms-transform: scale(1.2); }',
        '}',
        '@-moz-keyframes  pulse {',
        '  0%, 100% { -moz-transform: scale(1); }',
        '  50% { -moz-transform: scale(1.2); }',
        '}',
        '@-o-keyframes pulse {',
        '  0% { -o-transform: scale(1); }',
        '  50% { -o-transform: scale(1.2); }',
        '}',
        '.shake {',
        '  width:23px;',
        '  height:23px;',
        '  border-radius: 50%;',
        '  -webkit-animation: shake 1s linear 0s infinite reverse;',
        '  -moz-animation: shake 1s linear 0s infinite reverse;',
        '  -ms-animation: shake 1s linear 0s infinite reverse;',
        '  -o-animation: shake 1s linear 0s infinite reverse;',
        '  animation: shake 1s linear 0s infinite reverse; ',
        '  -webkit-animation-play-state: inherit;',
        '  -moz-animation-play-state: inherit;',
        '  -ms-animation-play-state: inherit;',
        '  -o-animation-play-state: inherit;',
        '  animation-play-state: inherit;',
        '}',
        '@keyframes shake {',
        '  0%, 100% { transform: translateX(0px); }',
        '  50% { transform: translateX(3px); }',
        '}',
        '@-webkit-keyframes shake {',
        '  0%, 100% { -webkit-transform: translateX(0px); }',
        '  50% { -webkit-transform: translateX(3px); }',
        '}',
        '@-ms-keyframes shake {',
        '  0%, 100% { -ms-transform: translateX(0px); }',
        '  50% { -ms-transform: translateX(3px); }',
        '}',
        '@-moz-keyframes shake {',
        '  0%, 100% { -moz-transform: translateX(0px); }',
        '  50% { -moz-transform: translateX(3px); }',
        '}',
        '@-o-keyframes shake {',
        '  0%, 100% { -o-transform: translateX(0px); }',
        '  50% { -o-transform: translateX(3px); }',
        '}'));

    var resynchSpiral =
        $('<img>', {
            'class': 'spiral',
            'src': 'http://i.imgur.com/wgtVYx6.png'
        }).css('pointer-events', 'none'),
        reloadSpiral =
            $('<img>', {
                'class': 'spiral',
                'src': 'http://i.imgur.com/ARxZzeE.png'
            }).css('pointer-events', 'none'),
        mirrorSpinner =
            $('<img>', {
                'class': 'spinner',
                'src': 'http://i.imgur.com/YqmK8gZ.png'
            }).css('pointer-events', 'none'),
        pulseIcon =
            $('<img>', {
                'class': 'pulse',
                'src': 'http://i.imgur.com/Fv1wJk5.png'
            }).css('pointer-events', 'none'),
        shakeIcon =
            $('<img>', {
                'class': 'shake',
                'src': 'http://i.imgur.com/ceHuy2q.png'
            }).css('pointer-events', 'none');

    onSkips.push({
        callback: function (skips, skipsNeeded) {
            $('#skipCounter').attr('title', String.format('{0}%', Math.round(skipsNeeded / blacknamesCount * 100 * 100) / 100));
        }
    });
    $('.basic-btn-btnbar').empty().append(
        $('<div>', {
            'id': 'skipContainer'
        }).append(
            $('<div>', {
                'id': 'skip',
                'class': 'controlIcon animationContainer',
                'title': 'Skip'
            }).append(shakeIcon.clone()).css('background-image', 'url(http://i.imgur.com/FhBdt3X.png)').click(function () {
                if (unsafeWindow.userInfo.loggedin) {
                    unsafeWindow.sendcmd('skip', null);
                } else {
                    unsafeWindow.addMessage("", "You must be logged in to vote to skip.", "", "errortext");
                }
            }).mouseout(function () {
                $(this).empty().append(shakeIcon.clone())
            }).css('float', 'none').css('margin-right', '0px')
        ).append(
            $('<div>', {
                'id': 'skipCounter',
                'title': '0%'
            }).text('0/0').css('height', '16px').css('margin-left', '0px').css('padding-top', '4px').css('padding-bottom', '1px').css('cursor', 'default')
        ).css('float', 'left').css('width', '70px')
    ).append(
        $('<div>', {
            'id': 'addVid'
        }).append(
            $('<input>', {
                'name': 'URLinput',
                'id': 'URLinput',
                'type': 'text',
                'placeholder': 'Add Video'
            }).css('height', '21px').css('padding-top', '0px').css('padding-bottom', '0px').css('padding-left', '4px')
            .css('margin-right', '0px').css('border-width', '1px').css('width', '200px')
        ).append(
            $('<div>', {
                'id': 'addUrl',
                'class': 'controlIcon animationContainer',
                'title': 'Add Video'
                //.css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)')
            }).append(pulseIcon.clone()).click(function () {
                var url = $('#URLinput').val();
                if ($('#URLinput').val().trim() !== '') {
                    unsafeWindow.sendcmd('add', {
                        URL: url
                    });
                }
                $('#URLinput').val('');
            }).mouseout(function () {
                $(this).empty().append(pulseIcon.clone())
            }).css('float', 'none').css('margin-left', '0px')
        ).css('float', 'left').css('display', 'flex')
    ).append(
        $('<div>', {
            'id': 'toggleplaylistlock'
        }).append(
            $('<img>', {
                'src': '/images/lock.png'
            }).css('top', '3px').css('position', 'relative')
        ).click(function () {
            unsafeWindow.sendcmd('toggleplaylistlock', null);
        }).css('float', 'right').css('margin-right', '0px').css('background-color', 'initial').css('height', '23px').css('cursor', 'pointer')
        .css('width', '17px').css('margin-left', '1px')
    ).append(
        $('<div>', {
            'id': 'reloadPlayer',
            'title': 'Reload',
            'class': 'controlIcon animationContainer',
        }).append(reloadSpiral.clone()).css('background-image', 'url(http://i.imgur.com/ai1NM0v.png)').click(function () {
            unsafeWindow.video.destroyPlayer();
            unsafeWindow.sendcmd('reload', null);
        }).mouseout(function () {
            $(this).empty().append(reloadSpiral.clone());
        })
    ).append(
        $('<div>', {
            'id': 'resynchPlayer',
            'title': 'Resynch',
            'class': 'controlIcon animationContainer',
        }).append(resynchSpiral.clone()).css('background-image', 'url(http://i.imgur.com/f5JSbHv.png)').click(function () {
            unsafeWindow.sendcmd('resynch', null);
        }).mouseout(function () {
            $(this).empty().append(resynchSpiral.clone());
        })
    ).append(
        $('<div>', {
            'id': 'mirrorPlayer',
            'title': 'Mirror Player',
            'class': 'controlIcon animationContainer',
        }).append(mirrorSpinner.clone()).css('background-image', 'url(http://i.imgur.com/YqmK8gZ.png)').click(function () {
            toggleMirrorPlayer();
        }).hover(function () {
            $(this).css('background-image', 'initial')
        }, function () {
            $(this).css('background-image', 'url(http://i.imgur.com/YqmK8gZ.png)')
            $(this).empty().append(mirrorSpinner.clone());
        })
    );
    // $('#URLinput').css('margin-right', '0px');
    // $('#addVid').css('display', 'inline-table').css('top', '-1px');
    // $('#addUrl').text('+').css('margin-left', '0px').css('margin-right', '2px').css('position', 'relative')
    //     .css('top', '-2px').css('height', '13px').css('border-top-width', '2px')
    //     .css('border-right-width', '1px').css('width', '13px').css('padding', '2px 2px 4px 2px');
}