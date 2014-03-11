function loadVotePurgeCommand() {
    commands.set('modCommands', "votepurge ", votePurge, 'Creates a poll if the user should be purged (purging still has to be done by hand). Parameters: the user.');
}

function votePurge(params) {
    var user = params[1],
        poll = {},
        option;

    if (!user) {
        unsafeWindow.addMessage('', 'No user specified: \'votePurge [user]', '', 'hashtext');
        return;
    }

    poll.title = "Should we purge " + user + " ? /babyseal";
    poll.options = [];
    option = "Yes !";
    poll.options.push(option);
    option = "No !";
    poll.options.push(option);

    unsafeWindow.global.sendcmd("poll-create", poll);
}

events.bind('onExecuteOnce', loadVotePurgeCommand);