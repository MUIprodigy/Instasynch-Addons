/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadBotCommands(){
    var emptyFunc = function (){};

     commands.set('modCommands',"$autoclean",emptyFunc);
     commands.set('modCommands',"$addRandom ",emptyFunc);
     commands.set('modCommands',"$addToUserBlacklist ",emptyFunc);
     commands.set('modCommands',"$addToVideoBlacklist ",emptyFunc);
     commands.set('modCommands',"$addAutobanMessage ",emptyFunc);
     commands.set('modCommands',"$clearAutobanMessages",emptyFunc);
     commands.set('modCommands',"$voteBump ",emptyFunc);
     commands.set('modCommands',"$shuffle ",emptyFunc);
     commands.set('modCommands',"$exportUserBlacklist",emptyFunc);
     commands.set('modCommands',"$poll",emptyFunc);

     commands.set('regularCommands',"$translateTitle",emptyFunc);
     commands.set('regularCommands',"$greet",emptyFunc);
     commands.set('regularCommands',"$derka ",emptyFunc);
     commands.set('regularCommands',"$ask ",emptyFunc);
     commands.set('regularCommands',"$askC ",emptyFunc);
     commands.set('regularCommands',"$askJ ",emptyFunc);
     commands.set('regularCommands',"$eval ",emptyFunc);
     commands.set('regularCommands',"$emotes",emptyFunc);
     commands.set('regularCommands',"$script",emptyFunc);
     commands.set('regularCommands',"$wolfram ",emptyFunc);
     commands.set('regularCommands',"$8Ball ",emptyFunc);
     commands.set('regularCommands',"$roll ",emptyFunc);
     commands.set('regularCommands',"$quote ",emptyFunc);
     commands.set('regularCommands',"$help ",emptyFunc);
     commands.set('regularCommands',"$stats",emptyFunc);
     commands.set('regularCommands',"$skiprate",emptyFunc);
     commands.set('regularCommands',"$mostPlayed",emptyFunc);
     commands.set('regularCommands',"$exportPlaylist ",emptyFunc);
     commands.set('regularCommands',"$rustle ",emptyFunc);
}

preConnectFunctions.push(loadBotCommands);
