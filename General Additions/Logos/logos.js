function loadLogos() {
    $('.descr-stat-tip :first').empty().append($('<div>', {
        'id': 'viewing-logo'
    })).attr('title', 'viewing');
    $('.descr-stat-tip :last').empty().append($('<div>', {
        'id': 'visits-logo'
    })).attr('title', 'visits');
    if (isBibbyRoom()) {
        var temp = $('.top-descr :first > :first');
        $('.top-descr').empty().append(
            $('<div>', {
                'id': 'room-logo'
            })
        ).append(temp);
    }
}

events.bind('onPreConnect', loadLogos);