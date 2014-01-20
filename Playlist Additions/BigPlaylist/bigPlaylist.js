/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch, original code
    Copyright (C) 2013  fugXD, Bibbytube modification

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

settingsFields['Playlist Additions'] = settingsFields['Playlist Additions'] || {};
settingsFields['Playlist Additions'].BigPlaylist = {
    'label': 'Big playlist with thumbnails (needs f5)',
    'type': 'checkbox',
    'default': true
};

function loadBigPlaylist() {
    if (GM_config.get('BigPlaylist')) {
        var oldMakeLeader = unsafeWindow.makeLeader,
            oldIsLeader,
            $originals,
            $helper,
            activeIndex = -1,
            temp,
            i;
        //script loading was too slow
        if (unsafeWindow.playlist.length !== 0) {
            activeIndex = getActiveVideoIndex();
        }
        // change unsafeWindow.playlist to table based
        $('<style type="text/css"> #tablePlaylistBody tr:hover{background:#555;} #tablePlaylistBody td {padding:3px;border:solid #666 3px;} .active{color:#000; background:#D1E1FA;} </style>').appendTo('head');
        $('#ulPlay').replaceWith($('<table>', {
            'id': 'tablePlaylist'
        }));
        $('#tablePlaylist').css('width', '100%').css('table-layout', 'fixed');
        $('#tablePlaylist td').css('overflow', 'scroll');
        $('#tablePlaylist').append(
            $('<tbody>', {
                'id': 'tablePlaylistBody'
            })
        );
        $('#playlist_items').css('width', '97.5%');

        unsafeWindow.makeLeader = function (userId) {
            oldIsLeader = unsafeWindow.isLeader;
            oldMakeLeader(userId);
            //InstaSynch core.js, version 0.9.7
            if (userId === unsafeWindow.userInfo.id) {
                $("#tablePlaylistBody").sortable({
                    update: function (event, ui) {
                        unsafeWindow.sendcmd('move', {
                            info: ui.item.data("info"),
                            position: ui.item.index()
                        });
                        $("#tablePlaylistBody").sortable("cancel");
                    },
                    start: function (event, ui) {
                        //Prevents click event from triggering when sorting videos
                        $("#tablePlaylistBody").addClass('noclick');
                    },
                    helper: function (e, tr) {
                        $originals = tr.children();
                        $helper = tr.clone();
                        $helper.children().each(function (index) {
                            // Set helper cell sizes to match the original sizes
                            $(this).width($originals.eq(index).width());
                        });
                        return $helper;
                    },
                    opacity: 0.5
                }).disableSelection();
                $("#tablePlaylistBody").sortable("enable");
            } else {
                if (oldIsLeader) {
                    $("#tablePlaylistBody").sortable("disable");
                }
            }
        };


        // override functions from InstaSynch's io.js, version 0.9.7
        // overrides addVideo, removeVideo, moveVideo and playVideo
        unsafeWindow.addVideo = function (vidinfo) {
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
                'click': function () {
                    unsafeWindow.sendcmd('remove', {
                        info: $(this).parent().parent().data('info')
                    });
                }
            });

            // Create the <tr> (row) in the table for the new video
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
                    $('<td>').append(
                        $('<div>', {
                            'title': vidinfo.title
                        }).text(trimTitle(vidinfo.title, 100)).css('overflow', 'hidden')
                    ).on('click', function () {
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
                    $('<td>').append(removeBtn).append($('<br>')).css('width', '15px')
                )
            );
            unsafeWindow.totalTime += vidinfo.duration;
            $('.total-videos').html(unsafeWindow.playlist.length + ' videos');
            $('.total-duration').html(unsafeWindow.secondsToTime(unsafeWindow.totalTime));
        };

        unsafeWindow.removeVideo = function (vidinfo) {
            var indexOfVid = unsafeWindow.getVideoIndex(vidinfo);
            if (indexOfVid > -1 && indexOfVid < unsafeWindow.playlist.length) {
                unsafeWindow.totalTime -= unsafeWindow.playlist[indexOfVid].duration;
                unsafeWindow.playlist.splice(indexOfVid, 1);
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).remove();
            }
            $('.total-videos').html(unsafeWindow.playlist.length + ' videos');
            $('.total-duration').html(unsafeWindow.secondsToTime(unsafeWindow.totalTime));
        };

        unsafeWindow.moveVideo = function (vidinfo, position) {
            var indexOfVid = unsafeWindow.getVideoIndex(vidinfo),
                playlistElements,
                k;
            if (indexOfVid > -1) {
                unsafeWindow.playlist.move(indexOfVid, position);
                playlistElements = $('#tablePlaylistBody tr').clone(true);
                playlistElements.move = function (old_index, new_index) {
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
        };

        unsafeWindow.playVideo = function (vidinfo, time, playing) {
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
        };

        if (activeIndex !== -1) {
            temp = unsafeWindow.playlist;
            unsafeWindow.playlist = [];
            for (i = 0; i < temp.length; i += 1) {
                unsafeWindow.addVideo(temp[i]);
            }
            unsafeWindow.playVideo(temp[activeIndex].info, 0, true);
            unsafeWindow.sendcmd('resynch', null);
        }
    }
}

function trimTitle(title, length) {
    if (title.length > length) {
        title = title.substring(0, length) + "...";
    }
    return title;
}