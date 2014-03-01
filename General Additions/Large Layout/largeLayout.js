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

function loadLayoutOnce() {
    var oldLayout = GM_config.get('Layout');
    events.bind('onSettingsOpen', function() {
        oldLayout = GM_config.get('Layout');
    });
    events.bind('onSettingsSave', function() {
        if (oldLayout !== GM_config.get('Layout')) {
            changeLayout();
            oldLayout = GM_config.get('Layout');
        }
    });

    GM_addStyle(GM_getResourceText('largeLayoutSelectorCSS'));
    largeLayoutCSS = GM_getResourceText('largeLayoutCSS');
    $('head').append($('<style>', {
        'id': 'layoutStyles'
    }));
}

function loadLayout() {
    $('#playlistcontrols').css('width', '100%');
    $('.sliderContainer').css('width', '100%');
    $('.roomFooter ').css('margin-top', '0px');

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
    }).text('normal').click(setLayout).addClass('layoutClickable'),
        large = $('<a>', {
            'id': 'largeLayout'
        }).text('large').click(setLayout).addClass('layoutClickable');
    switch (GM_config.get('Layout')) {
        case 'normal':
            normal.addClass('layoutNotClickable');
            break;
        case 'large':
            large.addClass('layoutNotClickable');
            break;
    }
    $('<div>', {
        'id': 'layoutSelector'
    }).text('layout:').insertBefore('#roomFooter');
    $('#layoutSelector').append(normal).append(large);
}
var largeLayoutCSS;

function changeLayout() {
    $('#layoutSelector').children().each(function() {
        $(this).removeClass('layoutNotClickable');
    });
    $(String.format('#{0}Layout', GM_config.get('Layout'))).addClass('layoutNotClickable');
    $('#layoutStyles').text('');
    switch (GM_config.get('Layout')) {
        case 'large':
            //css by v4c with some minor changes http://userscripts.org/scripts/show/182167
            $('#layoutStyles').text(largeLayoutCSS);
            break;
    }
    playerWidth = $('#media').width();
    playerHeight = $('#media').height();
}

executeOnceFunctions.push(loadLayoutOnce);
preConnectFunctions.push(loadLayout);