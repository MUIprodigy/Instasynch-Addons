/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Faqqq

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


function loadHappyBirthdayJPB() {
	var oldAddUser = addUser;

	
	addUser = function addUser(user, css, sort){
		if(user === 'JustPassingBy'){
            if (ie4up||ns6up){
                animation();
                if (time>0)
                    setTimeout("hideimage()", time*1000)
            }
            animation();
		}
		oldAddUser(user,css,sort);
	};
    for(i = 0; i< users.length;i++){
        if(users[i].username === 'JustPassingBy' ) {
            animation();
            break;
        }
    }       
}

afterConnectFunctions.push(loadHappyBirthdayJPB);