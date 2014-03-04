function loadHelpCommand() {
    commands.set('regularCommands', "help ", help, 'Prints out all the commands (use $help for bot commands) or prints more info on a specific command. Optional Parameter: the command to get info on.');
}

function help(params) {
    var description,
        output = '';
    if (params[1]) {
        description = commands.getDescription(params[1]);
        if (!description) {
            output = String.format('Command {0} not found', params[1]);
        } else {
            output = String.format('{0}: {1}', params[1], description);
        }
    } else {
        output += commands.get('modCommands').join(' ') + ' ';
        output += commands.get('regularCommands').join(' ') + ' ';
        output = output.replace(/\$[\w]+ /g, '');
    }
    unsafeWindow.addMessage('', output, '', 'hashtext');
}

events.bind('onExecuteOnce', loadHelpCommand);