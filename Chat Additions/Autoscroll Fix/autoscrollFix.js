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

function loadAutoscrollFix() {

    //remove autoscroll stop on hover (for now by cloning the object and thus removing all events)
    //could not figure out how to delete an anonymous function from the events
    var old_element = document.getElementById("chat_list"),
        new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    //all not working
    // var eventListeners = jQuery._data( chat_list, "events" );
    // for(var e in eventListeners){
    //     if(e === 'mouseover' || e === 'mouseout'){
    //         $('#chat_list')[0].removeEventListener(e,eventListeners[e][0]['handler']);
    //         $('#chat_list').unbind(e,eventListeners[e][0]['handler']);
    //     }
    // }
    // $('#chat_list').unbind('mouseover');
    // $('#chat_list').unbind('mouseout');
    // $('#chat_list').unbind('hover');


    //add a scrolling event to the chat
    $('#chat_list').on('scroll', function () {
        var scrollHeight = $(this)[0].scrollHeight,
            scrollTop = $(this).scrollTop(),
            height = $(this).height();

        //scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
        //height of the chat window is 280, not sure where the 10 is from
        if ((scrollHeight - scrollTop) < height * 1.05) {
            unsafeWindow.autoscroll = true;
        } else {
            unsafeWindow.autoscroll = false;
        }
    });

    //overwrite cleanChat Function so it won't clean when autoscroll is off
    //,also clean all the messages until messages === MAXMESSAGES
    unsafeWindow.cleanChat = function cleanChat() {
        var max = unsafeWindow.MAXMESSAGES;
        //increasing the maximum messages by the factor 2 so messages won't get cleared 
        //and won't pile up if the user goes afk with autoscroll off
        if (!unsafeWindow.autoscroll) {
            max = max * 2;
        }
        while (unsafeWindow.windmessages > max) {
            $('#chat_list > :first-child').remove(); //span user
            $('#chat_list > :first-child').remove(); //span message
            $('#chat_list > :first-child').remove(); //<br>
            unsafeWindow.messages -= 1;
        }
    };
}

//now added oficially on InstaSynch
//postConnectFunctions.push(loadAutoscrollFix);
