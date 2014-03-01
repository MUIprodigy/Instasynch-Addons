function loadClearChatCommand() {
    commands.set('regularCommands', "clearChat", clearChat, 'Clears the chat.');
}

function clearChat() {
    $('#chat_list').empty();
    unsafeWindow.messages = 0;
}

executeOnceFunctions.push(loadClearChatCommand);