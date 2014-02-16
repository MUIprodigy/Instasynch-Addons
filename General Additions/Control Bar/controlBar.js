function loadControlBar() {
    $('#resynch').remove();
    $('#reload').remove();
    GM_addStyle(GM_getResourceText('controlBarCSS'));
    var oldLayoutCSS = '',
        fullscreenCSS = GM_getResourceText('fullscreenCSS');

    function toggleFullscreen() {
        if (!$.fullscreen.isFullScreen()) {
            $('body').fullscreen();
        } else {
            $.fullscreen.exit();
        }
    }
    $('body').append($('<div>', {
        'id': 'block-fullscreen'
    }).click(toggleFullscreen));
    onCreatePoll.push({
        callback: function() {
            $('.poll-container').removeClass('poll-container2');
            $('#hide-poll').removeClass('hide-poll2');
        }
    });
    $('.playlist').prepend($('<div>', {
        'id': 'hide-playlist'
    }).append(
        $('<div>').click(function() {
            $('#playlist .playlist #playlist_items').toggleClass('playlist2');
            $('#hide-playlist').toggleClass('hide-playlist2');
            $('#chat').toggleClass('chat2');
        })
    ));
    $('.poll-container').prepend(
        $('<div>', {
            'id': 'hide-poll'
        }).append(
            $('<div>').click(function() {
                $('.poll-container').toggleClass('poll-container2');
                $('#hide-poll').toggleClass('hide-poll2');
            })
        )
    );
    $(document).bind('fscreenchange', function(e, state, elem) {
        if ($.fullscreen.isFullScreen()) {
            $('.NND-element').remove();
            oldLayoutCSS = $('#layoutStyles').text();
            $('#layoutStyles').text(fullscreenCSS);
        } else {
            $('#layoutStyles').text(oldLayoutCSS);
        }

        $('#state').text($.fullscreen.isFullScreen() ? '' : 'not');
    });

    var skipRate = 0,
        skipText = $('#skipCounter').text(),
        playlistLock = $('#toggleplaylistlock img').attr('src');

    function addAnimation(child, cls) {
        child.unbind('webkitAnimationIteration oanimationiteration MSAnimationIteration animationiteration').addClass(cls);
    }

    function removeAnimation(child, cls) {
        child.one('webkitAnimationIteration oanimationiteration MSAnimationIteration animationiteration', function() {
            child.removeClass(cls);
        });
    }
    onSkips.push({
        callback: function(skips, skipsNeeded) {
            $('#skipCounter').attr('title', String.format('{0}%', Math.round(skipsNeeded / blacknamesCount * 100 * 100) / 100));
        }
    });
    if (isConnected()) {
        skipRate = Math.round(parseInt(skipText.split('/')[1], 10) / blacknamesCount * 100 * 100) / 100;
    }

    $('.basic-btn-btnbar').empty().append(
        $('<div>', {
            'id': 'skipContainer'
        }).append(
            $('<div>', {
                'id': 'skip',
                'class': 'controlIcon',
                'title': 'Skip'
            }).append(
                $('<div>').css('background-image', 'url(http://i.imgur.com/ceHuy2q.png)').addClass('animationContainer')
            ).click(function() {
                if (unsafeWindow.userInfo.loggedin) {
                    unsafeWindow.sendcmd('skip', null);
                } else {
                    unsafeWindow.addMessage("", "You must be logged in to vote to skip.", "", "errortext");
                }
            }).hover(function() {
                addAnimation($(this).children().eq(0), 'shake');
            }, function() {
                removeAnimation($(this).children().eq(0), 'shake');
            })
        ).append(
            $('<div>', {
                'id': 'skipCounter',
                'title': skipRate + '%'
            }).text(skipText)
        )
    ).append(
        $('<div>', {
            'id': 'addVid'
        }).append(
            $('<input>', {
                'name': 'URLinput',
                'id': 'URLinput',
                'type': 'text',
                'title': 'Start typing to search',
                'placeholder': 'Add Video / Search'
            })
        ).append(
            $('<div>', {
                'id': 'addUrl',
                'class': 'controlIcon',
                'title': 'Add Video'
                //.css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)')
            }).append(
                $('<div>').css('background-image', 'url(http://i.imgur.com/Fv1wJk5.png)').addClass('animationContainer')
            ).click(function() {
                var url = $('#URLinput').val();
                if ($('#URLinput').val().trim() !== '') {
                    unsafeWindow.sendcmd('add', {
                        URL: url
                    });
                }
                $('#URLinput').val('');
            }).hover(function() {
                addAnimation($(this).children().eq(0), 'pulse');
            }, function() {
                removeAnimation($(this).children().eq(0), 'pulse');
            })
        )
    ).append(
        $('<div>', {
            'id': 'toggleplaylistlock'
        }).append(
            $('<img>', {
                'src': playlistLock
            }).css('top', '3px').css('position', 'relative')
        ).click(function() {
            unsafeWindow.sendcmd('toggleplaylistlock', null);
        })
    ).append(
        $('<div>', {
            'id': 'reloadPlayer',
            'title': 'Reload',
            'class': 'controlIcon'
        }).append(
            $('<div>').css('background-image', 'url(http://i.imgur.com/ARxZzeE.png)').addClass('animationContainer')
        ).css('background-image', 'url(http://i.imgur.com/ai1NM0v.png)').click(function() {
            unsafeWindow.video.destroyPlayer();
            unsafeWindow.sendcmd('reload', null);
        }).hover(function() {
            addAnimation($(this).children().eq(0), 'spiral');
        }, function() {
            removeAnimation($(this).children().eq(0), 'spiral');
        })
    ).append(
        $('<div>', {
            'id': 'resynchPlayer',
            'title': 'Resynch',
            'class': 'controlIcon'
        }).append(
            $('<div>').css('background-image', 'url(http://i.imgur.com/k5gajYE.png)').addClass('animationContainer')
        ).css('background-image', 'url(http://i.imgur.com/f5JSbHv.png)').click(function() {
            unsafeWindow.sendcmd('resynch', null);
        }).hover(function() {
            addAnimation($(this).children().eq(0), 'spiral');
        }, function() {
            removeAnimation($(this).children().eq(0), 'spiral');
        })
    ).append(
        $('<div>', {
            'id': 'mirrorPlayer',
            'title': 'Mirror Player',
            'class': 'controlIcon'
        }).append($('<div>').css('background-image', 'url(http://i.imgur.com/YqmK8gZ.png)').addClass('animationContainer')).click(function() {
            toggleMirrorPlayer();
        }).hover(function() {
            addAnimation($(this).children().eq(0), 'spinner');
        }, function() {
            removeAnimation($(this).children().eq(0), 'spinner');
        })
    ).append(
        $('<div>', {
            'id': 'fullscreen',
            'title': 'Fullscreen',
            'class': 'controlIcon'
        }).append(
            $('<div>').css('background-image', 'url(http://i.imgur.com/7zZxALJ.png)').addClass('animationContainer')
        ).click(toggleFullscreen).hover(function() {
            addAnimation($(this).children().eq(0), 'grow');
        }, function() {
            removeAnimation($(this).children().eq(0), 'grow');
        })
    ).append(
        $('<div>', {
            'id': 'nnd-Mode',
            'title': 'NND Mode (scrolling Text)',
            'class': 'controlIcon'
        }).append(
            $('<div>').css('background-image', 'url(http://i.imgur.com/uyx7rvg.png)').addClass('animationContainer')
        ).click(function() {
            GM_config.set('NNDMode', !GM_config.get('NNDMode'));
            GM_config.save();
        }).hover(function() {
            addAnimation($(this).children().eq(0), 'marquee');
        }, function() {
            removeAnimation($(this).children().eq(0), 'marquee');
        })
    );
}