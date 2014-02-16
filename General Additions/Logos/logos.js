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