Instasynch
==========


Command List
------------

<pre>
<code>//Commands ? means optional parameter
'togglePlayer
'printWallCounter
'mirrorPlayer
'clearChat
'printAddonSettings
'clearAddonSettings
'printMyWallCounter
'exportPlaylist title? duration? addedby? thumbnail? all? xml?
'history
'help

//Mod Commands
'bump [user]
'removeLast [user]
'trimWall [user] [maxMinutes]?
'purgeTooLong [maxMinutes]?
'votePurge [user]
'shuffle [user]?</code>
</pre>


Installing
----------

To use the scripts install <a href=https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de>tampermonkey(chrome)</a> or <a href="https://addons.mozilla.org/de/firefox/addon/greasemonkey/">greasemonkey(firefox)</a>.

Then go to http://userscripts.org/scripts/show/181142 and install the script.

<a href="changelog.txt">Changes</a>

Just send a <a href="mailto:megafaqqq@gmail.com">mail</a> if you got suggestions or found a bug.

Scripts
=======

Help
--------------

Use this command to print all the commands or get more detailed information on a single command. <code>'help [command]?</code>

Message Filter
--------------

The message filter brings back the old tags from synchtube, wordfilters and NSFWEmotes.

Click <a href="/Chat Additions/Messagefilter/messagefilterexample.gif">here</a> for the example.


Autocomplete
------------

Autocomplete will assist the user in typing out commands, emotes, settings, names and tags.
By hitting tab or enter the selected item will be added to the input field. 
If it is an emote or a command that does not need additional input it will be automatically sent to the chat.

Click <a href="Chat Additions/Autocomplete/autocompleteexample.gif">here</a> for the example.


Name Autocomplete
-----------------

By starting to type a name and hitting the tab key the name will be autocompleted.

Click <a href="Chat Additions/Name Autocomplete/nameautocompleteexample.gif">here</a>  for the example.


OnClick Kick,Ban
----------------

A user can be kicked by holding ctrl and clicking on the username in the chat window.
He will be banned by holding ctrl + alt and clicking. If the user is not around anymore he will automatically be leaverbanned

Click <a href="Chat Additions/OnClickKickBan/onclickkickbanexample.gif">here</a> for the example.


Input History
-------------

All the sent messages will be saved in a local history and can be accessed by using the up and down arrow keys

Click <a href="Chat Additions/Input History/inputhistoryexample.gif">here</a> for the example.


Chat Autoscroll Fix
-------------------

Automatic scrolling in the chat can be turned off by scrolling up in the chat window now rather then hovering over the chat window with the mouse.
The maximum of messages will be increased while automatic scrolling is off to make sure it won't start scrolling again because messages get deleted.
To turn automatic scrolling back on simply scroll down completely.


Mod Spy
-------

The logs in the console can be redirected to the chat window. Clean commands will be filtered out.

Click <a href="Chat Additions/ModSpy/modspyexample.gif">here</a> for the example.


Toggle Player
-------------

The player can be turned off by using the command <code>'togglePlayer</code>.

Click <a href="Player Additions/Toggle Player/toggleplayerexample.gif" >here</a> for the example.

Mirror Player
-------------

The player can be mirrored by using the command <code>'mirrorPlayer</code>.
Videos containing words like 'Mirrored' or 'Mirror' in the title will be automatically mirrored.


Mousewheel Volumecontrol
------------------------

The volume of the Youtube and Vimeo can be controlled by hovering over it with the mouse and scrolling up and down with the mousewheel.

Click <a href="Player Additions/Mousewheel Volumecontrol/mousewheelvolumecontrolexample.gif" >here</a> for the example.


Wallcounter
-----------

The wall length of every user will be saved and updated if a video has been added/deleted.
The current wall length will be shown in the 'Video successfully added' message.
To print your own wall length use <code>'printMyWallCounter</code> and too see it from all the users use <code>'printWallCounter</code>

YouTube Search
--------------

Searching a YouTube video can be done directly from the site. Simply start typing in the add video url text field and the results will pop up in the poll section. By clicking on the thumbnail of the video the url will be added to the text field.
To browse a playlist simply paste the playlist link into the input field.

Click <a href="General Additions/Youtube Search/youtubesearchexample.gif" >here</a> for the example.

History
------------------

Shows the last 9 Videos on the <a href="#youtube-search">YouTube Search</a> panel.

Shuffle
------------------

Shuffles the current playlist or the wall of the specified user.

BigPlaylist
------------------

Replacement for the old playlist that features thumbnails and a indicator for youtube/vimeo a


Notifications
-------------

A user will now recieve a notification via the favicon of the browser tab if the chat is not focused and their name has been said in the chat with the @ prefix.
The chat will stop scrolling at this position so the messages does not need to be searched afterwards.

Click <a href="Chat Additions/Name Notification/namenotificationexample.gif" >here</a> for the example.

NND-Mode
-------------------

NicoNicoDouga-Mode will scroll the messages in the chat over the player. It can get laggy on some computers and firefox.

Poll-Menu
-------------------

This adds more features for creating polls. Clear options, Copy the old Poll, remove options, moved the buttons to the top, smaller add and remove buttons.

Login-Off Messages
------------------

Messages can be recieved when a user logs in or off. 

Timestamp
------------------

Timestamp added to each message. 

Command Flood Protect
---------------------

To prevent getting kicked from flood protection the commands will be delayed when sending them too fast between each other

Bump Command
------------

To bump a users last added video simply use the command <code>'bump [user]</code>.
The video will be moved right under the active video.


Remove Last Command
-------------------

To remove the last video of a user use the command <code>'removeLast [user]</code>.

Trim Wall Command
-----------------

To trim a wall of a user use the command <code>'trimWall [user] [maxMinutes]</code>. Not providing a parameter will use 60 minutes as the standard value

Purge Too Long Command
----------------------

To remove all videos longer than a specific length use the command <code>'purgeTooLong [maxMinutes]</code>. Not providing a parameter will use 60 minutes as the standard value

Vote Purge Command
------------------

To create a poll about purging a user use the command <code>'votePurge [user]</code>.

Clear Chat Command
------------------

To clear all the messages from the chat use the command <code>'clearChat</code>.

Export Playlist Command
-----------------------

To export all the videos in the playlist to the clipboard use the command <code>'exportPlaylist</code>. 
On standard only the urls will be copied. To get more data use the parameters <code>title duration addedby thumbnail all</code>.
To get the data in XML format use the parameter <code>xml</code>.

Click <a href="Playlist Additions/ExportPlaylistCommand/exportplaylistexample.gif" >here</a> for the example.

Settings
--------

All the settings will be saved with the Tamper/Greasemonkey API.
To show all the current set values use <code>'printAddOnSettings</code>. And to restore default use <code>'clearAddOnSettings</code>
When changing a setting the new value will be shown in the chat.




Gifs made with <a href="http://blog.bahraniapps.com/?page_id=21">GifCam</a>

