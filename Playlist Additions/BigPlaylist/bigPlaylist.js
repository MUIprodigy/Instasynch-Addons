/*
    Copyright (C) 2014  fugXD, Bibbytube modification
*/

setField({
    'name': 'BigPlaylist',
    'data': {
        'label': 'Big playlist with thumbnails',
        'type': 'checkbox',
        'default': true
    },
    'section': 'Playlist Additions'
});

function loadBigPlaylist() {
    var oldMakeLeader = unsafeWindow.makeLeader,
        oldAddVideo = unsafeWindow.addVideo,
        oldPlayVideo = unsafeWindow.playVideo,
        oldRemoveVideo = unsafeWindow.removeVideo,
        oldMoveVideo = unsafeWindow.moveVideo,
        oldPlaylist = $('#ulPlay').clone(true),
        oldIsLeader,
        oldBigPlaylistSetting = GM_config.get('BigPlaylist'),
        $originals,
        $helper,
        i;
    onSettingsOpen.push(function() {
        oldBigPlaylistSetting = GM_config.get('BigPlaylist');
    });

    function enableSortable() {
        if (GM_config.get('BigPlaylist')) {
            $("#tablePlaylistBody").sortable({
                update: function(event, ui) {
                    unsafeWindow.sendcmd('move', {
                        info: ui.item.data("info"),
                        position: ui.item.index()
                    });
                    $("#tablePlaylistBody").sortable("cancel");
                },
                start: function(event, ui) {
                    //Prevents click event from triggering when sorting videos
                    $("#tablePlaylistBody").addClass('noclick');
                },
                helper: function(e, tr) {
                    $originals = tr.children();
                    $helper = tr.clone();
                    $helper.children().each(function(index) {
                        // Set helper cell sizes to match the original sizes
                        $(this).width($originals.eq(index).width());
                    });
                    return $helper;
                },
                opacity: 0.5
            }).disableSelection();
            $("#tablePlaylistBody").sortable("enable");
        } else {
            //core.js, version 0.9.7
            $("#ulPlay").sortable({
                update: function(event, ui) {
                    unsafeWindow.sendcmd('move', {
                        info: ui.item.data("info"),
                        position: ui.item.index()
                    });
                    $("#ulPlay").sortable("cancel");
                },
                start: function(event, ui) {
                    //Prevents click event from triggering when sorting videos
                    $("#ulPlay").addClass('noclick');
                }

            });
            $("#ulPlay").sortable("enable");
        }
    }
    onSettingsSave.push(function() {
        if (oldBigPlaylistSetting !== GM_config.get('BigPlaylist')) {
            reloadPlaylistHTML(oldPlaylist);
            reloadPlaylist();
            oldBigPlaylistSetting = GM_config.get('BigPlaylist');
            if (unsafeWindow.isLeader) {
                enableSortable();
            }
        }
    });
    if (GM_config.get('BigPlaylist')) {
        reloadPlaylistHTML();
    }

    unsafeWindow.makeLeader = function(userId) {
        oldIsLeader = unsafeWindow.isLeader;
        oldMakeLeader(userId);
        if (GM_config.get('BigPlaylist')) {
            //InstaSynch core.js, version 0.9.7
            if (userId === unsafeWindow.userInfo.id) {
                enableSortable();
            } else if (oldIsLeader) {
                $("#tablePlaylistBody").sortable("disable");
            }
        }
    };


    // override functions from InstaSynch's io.js, version 0.9.7
    // overrides addVideo, removeVideo, moveVideo and playVideo
    unsafeWindow.addVideo = function(vidinfo) {
        var timeTo = 0,
            selector = '#ulPlay';
        if (!GM_config.get('BigPlaylist')) {
            oldAddVideo(vidinfo);
        } else {
            unsafeWindow.playlist.push({
                info: vidinfo.info,
                title: vidinfo.title,
                addedby: vidinfo.addedby,
                duration: vidinfo.duration
            });

            var vidurl = '',
                vidicon = '',
                removeBtn;

            if (vidinfo.info.provider === 'youtube') {
                vidurl = 'http://www.youtube.com/watch?v=' + vidinfo.info.id;
                vidicon = 'https://www.youtube.com/favicon.ico';
            } else if (vidinfo.info.provider === 'vimeo') {
                vidurl = 'http://vimeo.com/' + vidinfo.info.id;
                vidicon = 'https://vimeo.com/favicon.ico';
            } else if (vidinfo.info.provider === 'twitch' && vidinfo.info.mediaType === 'stream') {
                vidurl = 'http://twitch.tv/' + vidinfo.info.channel;
                vidicon = ''; // no need for icon, thumbnail for twitch says 'twitch.tv'
            }

            removeBtn = $('<div/>', {
                'class': 'removeBtn x',
                'click': function() {
                    unsafeWindow.sendcmd('remove', {
                        info: $(this).parent().parent().data('info')
                    });
                }
            });
            $('#tablePlaylistBody').append(
                $('<tr>', {
                    'data': {
                        info: vidinfo.info
                    }
                }).append(
                    $('<td>').append(
                        $('<a>', {
                            'href': vidurl,
                            'target': '_blank'
                        }).css('position', 'relative').append(
                            $('<img>', {
                                'src': vidinfo.info.thumbnail
                            }).css('width', '45px')
                        ).append( // overlay icon for youtube or vimeo, bottom right
                            $('<img>', {
                                'src': vidicon
                            }).css('width', '16').css('position', 'absolute').css('right', '0px').css('bottom', '0px')
                        )
                    ).css('padding', '0px').css('width', '45px')
                ).append(
                    $('<td>', {
                        'title': vidinfo.title
                    }).append(
                        $('<div>').text(trimTitle(vidinfo.title, 100)).css('overflow', 'hidden')
                    ).on('click', function() {
                        //InstaSynch io.js, version 0.9.7
                        if ($("#tablePlaylistBody").hasClass("noclick")) {
                            $("#tablePlaylistBody").removeClass('noclick');
                        } else {
                            if (unsafeWindow.isLeader) {
                                unsafeWindow.sendcmd('play', {
                                    info: $(this).parent().data('info')
                                });
                            } else {
                                $('#cin').val($('#cin').val() + unsafeWindow.getVideoIndex($(this).parent().data('info')) + ' ');
                                $('#cin').focus();
                            }
                        }
                    }).css('cursor', 'pointer').css('width', 'auto').css('word-break', 'break-all')
                ).append(
                    $('<td>').html(unsafeWindow.secondsToTime(vidinfo.duration) + '<br/>' + vidinfo.addedby).css('text-align', 'right').css('width', '100px')
                ).append(
                    isUserMod() ? $('<td>').append(removeBtn).append($('<br>')).css('width', '15px') : undefined
                )
            );
            unsafeWindow.totalTime += vidinfo.duration;
            $('.total-videos').html(unsafeWindow.playlist.length + ' videos');
            $('.total-duration').html(unsafeWindow.secondsToTime(unsafeWindow.totalTime));
            selector = '#tablePlaylistBody'
        }
        timeTo = unsafeWindow.totalTime - vidinfo.duration;
        for (i = 0; i < getActiveVideoIndex(); i += 1) {
            timeTo -= unsafeWindow.playlist[i].duration;
        }
        $(selector + ' > :last-child').attr('title', String.format('{0} until this video gets played.', unsafeWindow.secondsToTime(timeTo)));
    };

    unsafeWindow.removeVideo = function(vidinfo) {
        var indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
        if (!GM_config.get('BigPlaylist')) {
            oldRemoveVideo(vidinfo);
        } else {
            if (indexOfVid > -1 && indexOfVid < unsafeWindow.playlist.length) {
                unsafeWindow.totalTime -= unsafeWindow.playlist[indexOfVid].duration;
                unsafeWindow.playlist.splice(indexOfVid, 1);
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).remove();
            }
            $('.total-videos').html(unsafeWindow.playlist.length + ' videos');
            $('.total-duration').html(unsafeWindow.secondsToTime(unsafeWindow.totalTime));
        }
        if (indexOfVid > getActiveVideoIndex()) {
            setupTimeTo();
        }
    };

    unsafeWindow.moveVideo = function(vidinfo, position) {
        if (!GM_config.get('BigPlaylist')) {
            oldMoveVideo(vidinfo, position);
        } else {
            var indexOfVid = unsafeWindow.getVideoIndex(vidinfo),
                playlistElements,
                k;
            if (indexOfVid > -1) {
                unsafeWindow.playlist.move(indexOfVid, position);
                playlistElements = $('#tablePlaylistBody tr').clone(true);
                playlistElements.move = function(old_index, new_index) {
                    if (new_index >= this.length) {
                        k = new_index - this.length;
                        while ((k--) + 1) {
                            this.push(undefined);
                        }
                    }
                    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                };
                playlistElements.move(indexOfVid, position);
                $('#tablePlaylistBody').empty();
                $('#tablePlaylistBody').html(playlistElements);
            }
        }
        setupTimeTo();
    };

    unsafeWindow.playVideo = function(vidinfo, time, playing) {
        if (!GM_config.get('BigPlaylist')) {
            oldPlayVideo(vidinfo, time, playing);
        } else {
            var addedby = '',
                title = '',
                indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                title = trimTitle(unsafeWindow.playlist[indexOfVid].title, 240);
                addedby = unsafeWindow.playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class="via"> via ' + addedby + '</div>');
                unsafeWindow.video.play(vidinfo, time, playing);
                $('#slider').slider('option', 'max', unsafeWindow.playlist[indexOfVid].duration);
                $('#sliderDuration').html('/' + unsafeWindow.secondsToTime(unsafeWindow.playlist[indexOfVid].duration));
            }
        }
        setupTimeTo();
    };
    if (isConnected()) {
        if (GM_config.get('BigPlaylist')) {
            reloadPlaylist();
        } else {
            setupTimeTo();
        }
    }
}

function setupTimeTo() {
    var timeTo = 0,
        i,
        selector = '#ulPlay';
    if (GM_config.get('BigPlaylist')) {
        selector = '#tablePlaylistBody';
    }

    for (i = 0; i <= getActiveVideoIndex(); i += 1) {
        $(selector).children().eq(i).attr('title', '[00:00] until this video gets played.');
    }
    for (i -= 1; i < unsafeWindow.playlist.length - 1; i += 1) {
        timeTo += unsafeWindow.playlist[i].duration;
        $(selector).children().eq(i + 1).attr('title', String.format('{0} until this video gets played.', unsafeWindow.secondsToTime(timeTo)));
    }
}

function reloadPlaylistHTML(oldPlaylist) {
    if (!GM_config.get('BigPlaylist')) {
        $('#tablePlaylist').replaceWith(oldPlaylist);
        $('#playlist_items').css('width', '');
    } else {
        // change unsafeWindow.playlist to table based
        $('<style type="text/css"> #tablePlaylistBody tr:hover{background:#555;} #tablePlaylistBody td {padding:3px;border:solid #666 3px;} .active{color:#000; background:#D1E1FA;} </style>').appendTo('head');
        $('#ulPlay').replaceWith($('<table>', {
            'id': 'tablePlaylist'
        }));
        $('#tablePlaylist').css('width', '100%');
        $('#tablePlaylist td').css('overflow', 'scroll');
        $('#tablePlaylist').append(
            $('<tbody>', {
                'id': 'tablePlaylistBody'
            })
        );
        $('#playlist_items').css('width', 'calc(100% - 15px)');
    }
}

function reloadPlaylist(activeIndex) {
    var temp = unsafeWindow.playlist,
        i;
    unsafeWindow.playlist = [];
    unsafeWindow.playlist.move = function(old_index, new_index) //Code is property of Reid from stackoverflow
    {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    };
    unsafeWindow.totalTime = 0;
    for (i = 0; i < temp.length; i += 1) {
        unsafeWindow.addVideo(temp[i]);
    }
    unsafeWindow.sendcmd('reload', null);
}

function trimTitle(title, length) {
    if (title.length > length) {
        title = title.substring(0, length) + "...";
    }
    return title;
}