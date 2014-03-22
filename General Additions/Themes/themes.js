setField({
    'name': 'Theme',
    'data': {
        'label': '<a style="color:white;" href="https://raw.githubusercontent.com/Bibbytube/Instasynch-Addons/master/General%20Additions/Themes" target="_blank">Theme</a>',
        'type': 'select',
        'options': ['default'],
        'default': 'normal'
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});
setField({
    'name': 'CustomCSS',
    'data': {
        'label': 'Custom CSS url',
        'type': 'text',
        'options': 'default',
        'default': ''
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});
setField({
    'name': 'CustomCSSMode',
    'data': {
        'label': 'Custom CSS Mode',
        'type': 'radio',
        'options': ['append', 'replace'],
        'default': 'replace'
    },
    'section': 'General Additions',
    'subsection': 'Themes'
});

function loadThemesOnce() {
    $('head').append(
        $('<style>', {
            'id': 'theme'
        })
    ).append(
        $('<link>', {
            type: 'text/css',
            rel: 'stylesheet',
            id: 'theme-append'
        })
    );
    var oldTheme = GM_config.get('Theme'),
        oldCustomCSS = GM_config.get('CustomCSS'),
        oldCustomCSSMode = GM_config.get('CustomCSSMode');

    events.bind('onSettingsOpen', function() {
        oldTheme = GM_config.get('Theme'),
        oldCustomCSS = GM_config.get('CustomCSS'),
        oldCustomCSSMode = GM_config.get('CustomCSSMode');
    });
    events.bind('onSettingsSave', function() {
        if (oldTheme !== GM_config.get('Theme') ||
            oldCustomCSS !== GM_config.get('CustomCSS') ||
            oldCustomCSSMode !== GM_config.get('CustomCSSMode')) {
            applyThemes();
        }
    });

    applyThemes();
}

function applyThemes() {
    $('#theme').text('');
    $('#theme-append').attr('href', '');

    if (GM_config.get('CustomCSS') === '') {
        $('#theme').text(GM_getResourceText(String.format('{0}Theme', GM_config.get('Theme'))));
    } else {
        if (GM_config.get('CustomCSSMode') === 'append') {
            $('#theme').text(GM_getResourceText(String.format('{0}Theme', GM_config.get('Theme'))));
        }
        $('#theme-append').attr('href', GM_config.get('CustomCSS'));
    }
}

events.bind('onExecuteOnce', loadThemesOnce);