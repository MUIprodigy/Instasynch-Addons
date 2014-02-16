function loadPollSeal() {
    var url = 'http://i.imgur.com/YR9hGSt.png';
    $('.st-poll').css('background', String.format('url({0}) 0 0 #DFDFDF', url));

    $('.st-poll').css('background-size', 'auto 100%');
    $('.st-poll').css('background-repeat', 'no-repeat');
    $('.st-poll').css('background-position', 'center');
}

preConnectFunctions.push(loadPollSeal);