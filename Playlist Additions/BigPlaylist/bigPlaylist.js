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

function loadBigPlaylist() {
    bigPlaylist = settings.get('bigPlaylist','true');
    commands.set('addOnSettings','BigPlaylist',toggleBigPlaylist);
    if (bigPlaylist) {
        // change window.playlist to table based
        $('<style type="text/css"> #tablePlaylistBody tr:hover{background:#555;} #tablePlaylistBody td {padding:3px;border:solid #666 3px;} .active{color:#000; background:#D1E1FA;} </style>').appendTo('head');
        $('#ulPlay').replaceWith($('<table>',{'id':'tablePlaylist'}));
        $('#tablePlaylist').css('width','100%').css('table-layout','fixed');
        $('#tablePlaylist td').css('overflow','scroll');
        $('#tablePlaylist').append(
            $('<tbody>',{'id':'tablePlaylistBody'})
        );
        var oldMakeLeader = window.makeLeader,
            oldIsLeader;
        window.makeLeader = function(userId){
            oldIsLeader = window.isLeader;
            oldMakeLeader(userId);
            //InstaSynch core.js, version 0.9.7
            if (userId === window.userInfo.id)
            {
                $( "#tablePlaylistBody" ).sortable(
                {
                    update : function (event, ui){
                                window.sendcmd('move', {info: ui.item.data("info"), position: ui.item.index()});
                                $( "#tablePlaylistBody" ).sortable( "cancel" );
                             },
                     start: function(event,ui)
                     {
                         //Prevents click event from triggering when sorting videos
                         $("#tablePlaylistBody").addClass('noclick');
                     }
                });
                $("#tablePlaylistBody").sortable( "enable" );
            }else{
                if(oldIsLeader){
                    $("#tablePlaylistBody").sortable( "disable" );
                }
            }
        }
        

        // override functions from InstaSynch's io.js, version 0.9.7
        // overrides addVideo, removeVideo, moveVideo and playVideo
        window.addVideo = function(vidinfo) {
            window.playlist.push({info: vidinfo.info, title: vidinfo.title, addedby: vidinfo.addedby, duration: vidinfo.duration});

            var vidurl = '',
                vidicon = '';
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

            var removeBtn = $('<div/>', {
                'class': 'removeBtn x',
                'click': function () {
                    window.sendcmd('remove', {info: $(this).parent().parent().data('info')});
                }
            });

            // Create the <tr> (row) in the table for the new video
            $('#tablePlaylistBody').append(
                $('<tr>', {'data':{info: vidinfo.info}}).append(
                    $('<td>').append(
                        $('<a>',{'href':vidurl,'target':'_blank'}).css('position','relative').append(
                            $('<img>',{'src':vidinfo.info.thumbnail}).css('width','45px')
                        ).append( // overlay icon for youtube or vimeo, bottom right
                            $('<img>',{'src':vidicon}).css('width','16').css('position','absolute').css('right','0px').css('bottom','0px')
                        )
                    ).css('padding','0px').css('width','45px')
                ).append(
                    $('<td>').append(
                        $('<div>',{'title':vidinfo.title}).text(((vidinfo.title.length>100)?vidinfo.title.substring(0,100)+"...":vidinfo.title)).css('overflow','hidden')
                    ).on('click', function() {
                            //InstaSynch io.js, version 0.9.7
                            if ($("#tablePlaylistBody").hasClass("noclick"))
                            {
                                $("#tablePlaylistBody").removeClass('noclick');
                            }
                            else
                            {
                                if (window.isLeader) {
                                    window.sendcmd('play', {info: $(this).parent().data('info')});
                                } else {
                                        $('#cin').val($('#cin').val() + window.getVideoIndex($(this).parent().data('info')) + ' ');
                                        $('#cin').focus();
                                }
                            }
                        }
                    ).css('cursor','pointer').css('width','auto').css('word-break','break-all')
                ).append(
                    $('<td>').html(window.secondsToTime(vidinfo.duration) + '<br/>' + vidinfo.addedby).css('text-align','right').css('width','93px')
                ).append(
                    $('<td>').append(removeBtn).append($('<br>')).css('width','13px')
                )
            );
            window.totalTime += vidinfo.duration;
            $('.total-videos').html(window.playlist.length + ' videos');
            $('.total-duration').html(window.secondsToTime(window.totalTime));
        }

        window.removeVideo = function(vidinfo) {
            var indexOfVid = window.getVideoIndex(vidinfo);
            if (indexOfVid > -1 && indexOfVid < window.playlist.length) {
                window.totalTime -= window.playlist[indexOfVid].duration;
                window.playlist.splice(indexOfVid, 1);
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).remove();
            }
            $('.total-videos').html(window.playlist.length + ' videos');
            $('.total-duration').html(window.secondsToTime(window.totalTime));
        }

        window.moveVideo = function(vidinfo, position) {
            var indexOfVid = window.getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                window.playlist.move(indexOfVid, position);
                var playlistElements = $('#tablePlaylistBody tr').clone(true);
                playlistElements.move = function (old_index, new_index) {
                    if (new_index >= this.length) {
                        var k = new_index - this.length;
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

        window.playVideo = function playVideo(vidinfo, time, playing) {
            var addedby = '',
                title = '',
                indexOfVid = window.getVideoIndex(vidinfo);
            if (indexOfVid > -1) 
            {
                title = ((window.playlist[indexOfVid].title.length>240)?window.playlist[indexOfVid].title.substring(0,240)+"...":window.playlist[indexOfVid].title);
                addedby = window.playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#tablePlaylistBody').children('tr')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class="via"> via ' + addedby + '</div>');
                video.play(vidinfo, time, playing);   
                $('#slider').slider('option', 'max', window.playlist[indexOfVid].duration);
                $('#sliderDuration').html('/' + window.secondsToTime(window.playlist[indexOfVid].duration))
            }
        }
    }
}

var bigPlaylist = true;

function toggleBigPlaylist(){
    bigPlaylist = !bigPlaylist;
    settings.set('bigPlaylist',bigPlaylist);
    window.addMessage('','This setting requires a reload of the Page.','','hashtext');
}