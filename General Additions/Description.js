function loadDescription() {
    if (!isBibbyRoom()) {
        return;
    }
    var descr = "";
    descr += "<p style=\"font-family: Palatino; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong style=\"font-size: 20pt; \">Bibbytube<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 16pt; text-align: center; \">";
    descr += "  <strong>instasynch&#39;s most <img src=\"http:\/\/i.imgur.com\/L1Nuk.gif\" \/> room<\/strong><\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"font-size: 14pt; \">Playlist is always unlocked, so add videos for everyone to watch.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\">New content\/OC is appreciated.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 12pt; text-align: center; \">";
    descr += "  Note: Many of our videos are NSFW.<\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 18pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong>Rules&nbsp;<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  1. No RWJ, Ponies, or Stale Videos. &nbsp;Insta-skip<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  2. BEGGING FOR SKIPS IS FOR GAYLORDS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  3. &nbsp;NO SEAL JOKES<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  If your video gets removed and shouldn't have been, try adding it later.<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  MODS=GODS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399; font-family: Palatino; font-size: 18pt; \">Rules for the Reading Impaired<\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesEnglish.mp3\"><img src=\"http:\/\/i.imgur.com\/LIXqI5Q.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesDutch.mp3\"><img src=\"http:\/\/i.imgur.com\/giykE7C.jpg?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesFrench.mp3\"><img src=\"http:\/\/i.imgur.com\/BucOmRs.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesGerman.mp3\"><img src=\"http:\/\/i.imgur.com\/bTwmX9v.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesSpanish.mp3\"><img src=\"http:\/\/i.imgur.com\/aZvktnt.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399;\"><span style=\" font-family: Palatino; font-size: 18pt; \">Connect with Bibbytube in other ways!<\/span><\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/steamcommunity.com\/groups\/Babbytube\"><img src=\"http:\/\/i.imgur.com\/AZHszva.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/facebook.com\/babbytube\"><img src=\"http:\/\/i.imgur.com\/NuT2Bti.png?4\" \/><\/a><a href=\"http:\/\/twitter.com\/bibbytube_\/\"><img src=\"http:\/\/i.imgur.com\/T6oWmfB.png?4\" \/><\/a><\/p>";
    descr += "<script type=\"text\/javascript\" src=\"http:\/\/script.footprintlive.com\/?site=www.synchtube.com\"><\/script><noscript><a href=\"http:\/\/www.footprintlive.com\" target=\"_blank\"><img src=\"http:\/\/img.footprintlive.com\/?cmd=nojs&site=www.synchtube.com\" alt=\"user analytics\" border=\"0\"><\/a><\/noscript>";
    $("div.roomFooter ").html(descr);
}


preConnectFunctions.push(loadDescription);