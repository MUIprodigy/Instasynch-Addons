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

function loadPollMenu() {
    $('#create-pollBtn').text('Poll Menu');
    $('#create-poll').empty().append(
        $('<button>', {
            'id': 'add-poll-options'
        }).text('+').click(function () {
            if ($('#create-poll > .create-poll-option').length < 10) {
                $('#create-poll').append(
                    $('<input/>', {
                        'class': 'formbox create-poll-option',
                        'placeholder': 'Option'
                    }).css('width', '97%')
                ).append($('<br>'));
            }
        }).css('margin-right', '0px')
    ).append(
        $('<button>').text('-').click(function () {
            if ($('#create-poll > .create-poll-option').length > 1) {
                $('#create-poll > :last-child').remove();
                $('#create-poll > :last-child').remove();
            }
        }).css('width', '22px').css('margin-right', '2px')
    ).append(
        $('<button>').text('Copy Old').click(function () {
            if (oldPoll) {
                var i = 0;
                $('#clear-poll-options').click();
                if ($('#create-poll > .create-poll-option').length < oldPoll.options.length) {
                    while (oldPoll.options.length > $('#create-poll > .create-poll-option').length) {
                        $('#add-poll-options').click();
                    }
                }
                $('#create-poll > #title').val(htmlDecode(oldPoll.title));
                $(".create-poll-option").each(function (index) {
                    $(this).val(htmlDecode(oldPoll.options[i].option));
                    i += 1;
                    if (i >= oldPoll.options.length) {
                        return false;
                    }
                });
            }
        })
    ).append(
        $('<button>', {
            'id': 'clear-poll-options'
        }).text('Clear').click(function () {
            $('#create-poll > #title').val('')
            $(".create-poll-option").each(function (index) {
                $(this).val('');
            });
        })
    ).append(
        $('<button>').text('Create').click(function () {
            var poll = {},
                option;
            poll.title = $("#title").val();
            poll.options = [];
            $(".create-poll-option").each(function (index) {
                option = $(this).val();
                if (option.trim() != "") {
                    poll.options.push(option);
                }
            });
            unsafeWindow.sendcmd("poll-create", poll);
        })
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox',
            'id': 'title',
            'placeholder': 'Poll Title'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).append(
        $('<input/>', {
            'class': 'formbox create-poll-option',
            'placeholder': 'Option'
        }).css('width', '97%')
    ).append(
        $('<br>')
    ).css('width', '400px');

    onCreatePoll.push({
        callback: function (poll) {
            oldPoll = $.extend(true, {}, poll);
        },
        preOld: true
    });
    if (isConnected()) {
        var poll = {},
            option;
        poll.title = $(".poll-title").text();
        poll.options = [];
        $('.poll-item').each(function () {
            poll.options.push({
                votes: $(this).children().eq(0).text(),
                option: $(this).children().eq(1).text()
            });
        });
        oldPoll = poll;
        if (poll.options.length !== 0) {
            unsafeWindow.createPoll(poll);
        }
    }
}
var oldPoll = undefined;

preConnectFunctions.push(loadPollMenu);