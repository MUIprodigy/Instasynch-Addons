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
function loadSettingsLoader() {
    //add styles for the button
    GM_addStyle(
        ".addonsClicker {" +
        "    background: #2284B5 !important;" +
        "    color: #FFF !important;" +
        "}" +
        ".addonsClicker:hover {" +
        "    background: #196F9A !important;" +
        "}");
    //add the button
    $('#loginfrm').css('display', 'flex');
    $('#loginfrm > :first-child').before(
        $('<div id="addonsMenu" />').append(
            $('<div>').append(
                $('<ul>').append(
                    $('<li>').append(
                        $('<a>').append(
                            $('<img>', {
                                'src': GM_getResourceURL('settingsCog')
                            })
                        ).append('Addon Settings').addClass('addonsClicker').click(function () {
                            if (GM_config.isOpen) {
                                GM_config.close();
                            } else {
                                GM_config.open();
                            }
                        })
                    )
                ).addClass('js')
            ).addClass('click-nav')
        ).css('color', 'white').css('float', 'left').css('padding-top', '5px').css('padding-right', '5px')
    );

    var fields = {},
        firstMiddle = true,
        firstInner = true;
    //combine each sections settings with each other
    //first items with no section (is a section when it has no type)
    for (var outerProp in settingsFields) {
        if (settingsFields.hasOwnProperty(outerProp)) {
            if (settingsFields[outerProp].type) {
                fields[outerProp] = settingsFields[outerProp];
            }
        }
    }
    //sections
    for (var outerProp in settingsFields) {
        if (settingsFields.hasOwnProperty(outerProp)) {
            if (!settingsFields[outerProp].type) {
                firstMiddle = true;
                //items with no sub section
                for (var middleProp in settingsFields[outerProp]) {
                    if (settingsFields[outerProp].hasOwnProperty(middleProp)) {
                        if (middleProp !== 'isSection' && settingsFields[outerProp][middleProp].type) {
                            fields[middleProp] = settingsFields[outerProp][middleProp];
                            //first item has to have the section description
                            if (firstMiddle) {
                                firstMiddle = false;
                                fields[middleProp].section = [outerProp];
                            }
                        }
                    }
                } //no subsections
                //subsections
                for (var middleProp in settingsFields[outerProp]) {
                    if (settingsFields[outerProp].hasOwnProperty(middleProp)) {
                        if (!settingsFields[outerProp][middleProp].type) {
                            firstInner = true;
                            //all the items in the subsection
                            for (var innerProp in settingsFields[outerProp][middleProp]) {
                                if (settingsFields[outerProp][middleProp].hasOwnProperty(innerProp) && innerProp !== 'isSection') {
                                    fields[innerProp] = settingsFields[outerProp][middleProp][innerProp];
                                    //first item has to have the subsection description
                                    if (firstInner) {
                                        fields[innerProp].section = [, middleProp];
                                        firstInner = false;
                                    }
                                    //or both section/subsection description if there has been no item with no subsection
                                    if (firstMiddle) {
                                        firstMiddle = false;
                                        fields[innerProp].section = [outerProp, middleProp];
                                    }
                                } //has property
                            } //items in subsection
                        } //is no section
                    } //has property
                } //subsections
            } //is section
        } //has property
    } //sections

    GM_config.init({
        'id': 'GM_config',
        'title': String.format('<div style="height:50px";><img src="{0}" style="float:left;" height="50"/> <p style="margin:inherit;">InstaSynch Addons Settings</p><p style="margin:inherit;">{1}</p></div>', GM_getResourceURL("icon64"), GM_info.script.version),
        'fields': fields,
        'css': '#GM_config .config_header{ font-size: 15pt; color:#FFF; text-shadow: -1px 0 black, 0 2px black, 2px 0 black, 0 -1px black;  margin: 0 0 0 0px; }' +
            '#GM_config .config_var{ margin: 0 0 4 10px;}' +
            'input[type="checkbox"] { margin: 3px 3px 3px 0px; float:left;}' +
            'html { background:#BBB; opacity:0.9 }' +
            '#GM_config { background: #444444; height: 97%; }' +
            '#GM_config .section_header { background:#2284B5; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; cursor:pointer; } ' +
            '#GM_config .section_header:hover { background:#196F9A; transition: background-color 0.2s ease-in-out; -webkit-transition: background-color 0.2s ease-in-out; -moz-transition: background-color 0.2s ease-in-out; }' +
            '#GM_config .section_desc { cursor:pointer; }' +
            '#GM_config .section_desc:hover { background:#C9C9C9;transition: background-color 0.2s ease-in-out; -webkit-transition: background-color 0.2s ease-in-out; -moz-transition: background-color 0.2s ease-in-out; }' +
            '#GM_config .field_label { color:#FFF; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; }' +
            '#GM_config .reset { color:#FFF; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; padding-right: 12px; }' +
            'input[type="text"] { text-align: right}',
        'events': {
            'open': function (args) {
                $('#GM_config').css('height', '90%').css('top', '55px').css('left', '5px').css('width', '355px');
                //collapse all items in the section
                $('#GM_config').each(function () {
                    $('#GM_config .section_header', this.contentWindow.document || this.contentDocument).click(function () {
                        $(this).nextUntil().slideToggle(250);
                    });
                });
                //collapse all items in the subsection
                $('#GM_config').each(function () {
                    $('#GM_config .section_desc', this.contentWindow.document || this.contentDocument).click(function () {
                        $(this).nextUntil('#GM_config .section_desc').slideToggle(250);
                    });
                });
                //Add a save and close button
                $('#GM_config').each(function () {
                    var saveAndCloseButton = $('#GM_config_closeBtn', this.contentWindow.document || this.contentDocument).clone(false);
                    saveAndCloseButton.attr({
                        id: 'GM_config_save_closeBtn',
                        title: 'Save and close window'
                    }).text("Save and Close").click(function () {
                        GM_config.save();
                        GM_config.close();
                    });

                    $('#GM_config_buttons_holder > :last-child', this.contentWindow.document || this.contentDocument).before(saveAndCloseButton);
                });
                for (var i = 0; i < onSettingsOpen.length; i++) {
                    onSettingsOpen[i](args);
                }
            },
            'save': function (args) {
                for (var i = 0; i < onSettingsSave.length; i++) {
                    onSettingsSave[i](args);
                }
            },
            'reset': function (args) {
                for (var i = 0; i < onSettingsReset.length; i++) {
                    onSettingsReset[i](args);
                }
            }
        }
    });
}
var onSettingsSave = [],
    onSettingsOpen = [],
    onSettingsReset = [];