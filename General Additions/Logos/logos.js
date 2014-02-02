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



function loadLogos() {
    $('.descr-stat-tip :first').empty().append($('<img>', {
        'src': 'http://i.imgur.com/ehkt2RB.png'
    })).attr('title', 'viewing').css('position', 'relative').css('top', '1px');
    $('.descr-stat-tip :last').empty().append($('<img>', {
        'src': 'http://i.imgur.com/4ZEPN8D.png'
    })).attr('title', 'visits');
    if (isBibbyRoom()) {
        var temp = $('.top-descr :first > :first');
        $('.top-descr').empty().append(
            $('<img>', {
                'src': 'http://i.imgur.com/4AyXQt0.png'
            }).css('height', '60px').css('position', 'relative').css('top', '-1px')
        ).append(temp).css('height', '49px');
    }
}

preConnectFunctions.push(loadLogos);