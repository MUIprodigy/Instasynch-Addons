var advancedTags = {
    'hexcolor': /\[(#[0-9A-F]{1,6})\]/ig, //[#00FFAA] any hex color as tag
    'marquee': /\[marquee(-)?(\d{1,2})\]/ig, //[marquee10] marquee with specified speed
    'alternate': /\[alt(\d{1,2})\]/ig, //[alt10] alternate with specified speed
    'spoiler': /\|([^\|]*)\|/ig // |spoiler| shortcut
},
    tags = {
        '\\[black\\]': '<span style="color:black">', //colors
        '\\[/black\\]': '</span>',
        '\\[blue\\]': '<span style="color:blue">',
        '\\[/blue\\]': '</span>',
        '\\[darkblue\\]': '<span style="color:darkblue">',
        '\\[/darkblue\\]': '</span>',
        '\\[cyan\\]': '<span style="color:cyan">',
        '\\[/cyan\\]': '</span>',
        '\\[red\\]': '<span style="color:red">',
        '\\[/red\\]': '</span>',
        '\\[green\\]': '<span style="color:green">',
        '\\[/green\\]': '</span>',
        '\\[darkgreen\\]': '<span style="color:darkgreen">',
        '\\[/darkgreen\\]': '</span>',
        '\\[violet\\]': '<span style="color:violet">',
        '\\[/violet\\]': '</span>',
        '\\[purple\\]': '<span style="color:purple">',
        '\\[/purple\\]': '</span>',
        '\\[orange\\]': '<span style="color:orange">',
        '\\[/orange\\]': '</span>',
        '\\[blueviolet\\]': '<span style="color:blueviolet">',
        '\\[/blueviolet\\]': '</span>',
        '\\[brown\\]': '<span style="color:brown">',
        '\\[/brown\\]': '</span>',
        '\\[deeppink\\]': '<span style="color:deeppink">',
        '\\[/deeppink\\]': ' </span>',
        '\\[aqua\\]': '<span style="color:aqua">',
        '\\[/aqua\\]': '</span>',
        '\\[indigo\\]': '<span style="color:indigo">',
        '\\[/indigo\\]': '</span>',
        '\\[pink\\]': '<span style="color:pink">',
        '\\[/pink\\]': '</span>',
        '\\[chocolate\\]': '<span style="color:chocolate">',
        '\\[/chocolate\\]': '</span>',
        '\\[yellowgreen\\]': '<span style="color:yellowgreen">',
        '\\[/yellowgreen\\]': '</span>',
        '\\[steelblue\\]': '<span style="color:steelblue">',
        '\\[/steelblue\\]': '</span>',
        '\\[silver\\]': '<span style="color:silver">',
        '\\[/silver\\]': '</span>',
        '\\[tomato\\]': '<span style="color:tomato">',
        '\\[/tomato\\]': '</span>',
        '\\[tan\\]': '<span style="color:tan">',
        '\\[/tan\\]': '</span>',
        '\\[royalblue\\]': '<span style="color:royalblue">',
        '\\[/royalblue\\]': '</span>',
        '\\[navy\\]': '<span style="color:navy">',
        '\\[/navy\\]': '</span>',
        '\\[yellow\\]': '<span style="color:yellow">',
        '\\[/yellow\\]': '</span>',
        '\\[white\\]': '<span style="color:white">',
        '\\[/white\\]': '</span>',

        '\\[/span\\]': '</span>',
        '\\[/\\]': '</span>', //shortcut to close tags

        '\\[rmarquee\\]': '<marquee>', //move text to right
        '\\[/rmarquee\\]': '</marquee>',
        '\\[alt\\]': '<marquee behavior="alternate" direction="right">', //alternate between left and right
        '\\[/alt\\]': '</marquee>',
        '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">', //different speeds etc.
        '\\[/falt\\]': '</marquee>',
        '\\[marquee\\]': '<marquee direction="right">',
        '\\[/marquee\\]': '</marquee>',
        '\\[rsanic\\]': '<MARQUEE behavior="scroll" direction="left" width="100%" scrollamount="50">',
        '\\[/rsanic\\]': '</marquee>',
        '\\[sanic\\]': '<MARQUEE behavior="scroll" direction="right" width="100%" scrollamount="50">',
        '\\[/sanic\\]': '</marquee>',

        '\\[spoiler\\]': "<span style=\"background-color: #000;\" onmouseover=\"this.style.backgroundColor='#FFF';\" onmouseout=\"this.style.backgroundColor='#000';\">",
        '\\[/spoiler\\]': '</span>',

        '\\[italic\\]': '<span style="font-style:italic">',
        '\\[/italic\\]': '</span>',
        '\\[i\\]': '<span style="font-style:italic">', //shortcut italic
        '\\[/i\\]': '</span>',
        '\\[strike\\]': '<strike>',
        '\\[/strike\\]': '</strike>',
        '\\[-\\]': '<strike>', //shortcut strike
        '\\[/-\\]': '</strike>',
        '\\[strong\\]': '<strong>',
        '\\[/strong\\]': '</strong>',
        '\\[b\\]': '<strong>', //shortcut strong
        '\\[/b\\]': '</strong>'
    };
