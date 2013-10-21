function commandLoginMainPage(login, pass) {
    
    var status = user_status.online; 
    var device = user_device.blackberry;
    if($('#saveLoginCheckBox input').prop('checked'))
        ls.save(login,pass,true);
    else
        ls.save('','',false)
    try{
        if (login !== "" && pass !== "")
            sendCommand('user.loginWS', [login, pass, status, device]);
        else
            alert('Login or password missing!');
    }
    catch(e){
        alert('Not conneted');
    } 
}

function commandLogin(){
    sendCommand('user.login', [USER_ID, USER_SESSION, user_status.online, user_device.desktop]);
}
function logout() {
    sendCommand('user.logout', [user.id]);
    onLogout();
}

function setStatus(status) {
    
    updateStatusIcon(status,global_status);
    global_status =status;
    sendCommand('user.updateStatus', [user.id, status]);
}

function commandOpenPrivateChat(friendId) {
    setActiveConverastion(friendId);
    if (!findConverasation(friendId)) {
        sendCommand('chat.openPrivateConversation', [user.id, friendId]);
        sendCommand('chat.getPrivateHistory', [user.id, friendId]);
    }
    else {
        onOpenPrivateChatWindow(getActiveConverastion());
    }

}

function closePrivateChat(friendId) {
    //console.log('close private chat: ' + user.id + ' with ' + friendId);
    sendCommand('chat.closePrivateConversation', [user.id, friendId]);
    onClosePrivateChatWindow(friendId);
}

function commandSendPrivateMessage(message) {
    if (getActiveConverastion() !== '' && message) {
        //console.log('send private message to ' + actualOpeningChat + ' with text ' + message);
        sendCommand('chat.sendPrivateMessage', [user.id, actualOpeningChat, message]);
    }
    else{
        if(getActiveConverastion()==="")
            console.log('ERR send private message: friend ID missing');
                //alert('ERR send private message: friend ID missing');
        if(!message)
            console.log('ERR send private message: message missing');
                //alert('ERR send private message: message missing');
    }
        

}

/*
 * create new group
 * 
 * @param {type} groupName
 * @returns {undefined}
 */

function commandOpenGroupChat(groupName) {
    if(groupName!==""){
        //console.log('creating Group with name: ' + groupName);
        sendCommand('chat.openGroupConversation', [user.id, groupName]);
    }
    else{
        console.log('Missing Group name');
    }    
}

/*
 * Close group chat, only leader
 * 
 * @param {type} groupId
 * @returns {undefined}
 */
function commandCloseGroupChat(groupId) {
    //console.log('close Group with ID: ' + groupId);
    sendCommand('chat.closeGroupConversation', [user.id, groupId]);
}

/*
 * addUser to group. only leader
 * 
 * @param {type} friendId
 * @param {type} groupId
 * @returns {undefined}
 */
function commandAddUserToGroup(friendId, groupId) {
    console.log('add user : ' + friendId + ' to group: ' + groupId);
    sendCommand('chat.addUserToConversation', [friendId, groupId]);
}

/*
 * not leader
 * 
 * @param {type} groupId
 * @returns {undefined}
 */
function commandLeaveConversation(groupId, friendId) {
    console.log('leave group ' + groupId);
    sendCommand('chat.leaveConversation', [groupId, friendId]);
}

function sendGroupMessage(groupId, message) {
    //console.log('send group message to ' + groupId+' with text: '+message);
    sendCommand('chat.sendGroupMessage', [user.id, groupId, message]);
}
 function setconversationMode(friendId, mode){
     //console.log('set inkognito with: '+friendId+' to'+mode);
     sendCommand('chat.setconversationMode',[user.id,friendId,mode]);
 }
 function commandSetGroupName(groupId,newName){
     //console.log('set new Group Name to group: '+groupId+' name:'+newName);
     sendCommand('chat.setGroupName',[user.id,groupId,newName]); 
 }
 
 /*
  * 
  * @param {type} friendId
  * @param {type} timestamp
  * @param {type} type
  * @returns {undefined}
  */
 function confirmPrivateMessage(senderId,receiverId,timestamp,type){
     console.log('confirm message id: '+senderId+' friendId:'+receiverId+' typ: '+type+' timeid: '+timestamp);
     sendCommand('chat.confirmPrivateMessage',[receiverId,senderId,timestamp,type]); 
 }

function sendCommand(command, params) {

    connection.send(JSON.stringify({command: command, parameters: params}));
    // parameters
    /* connection.send(JSON.stringify({command: 'user.loginWS', parameters: param}));        [user,login, status, device]       status>0 login F,device[mobile, tablet, desktop]
     connection.send(JSON.stringify({command: 'user.login', parameters: param}));        [userID,sessionID, status, device]       status>0 login F,device[mobile, tablet, desktop]
     connection.send(JSON.stringify({command: 'user.logout', parameters: param}));           [id]
     
     connection.send(JSON.stringify({command: 'user.requestFriendList', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.requestGroupList', parameters: param}));
     
     connection.send(JSON.stringify({command: 'user.updateStatus', parameters: param}));    [id,chat_status_string]  CHAT_STATUS_AWAY,CHAT_STATUS_DND,CHAT_STATUS_BUSY,CHAT_STATUS_AVAILABLE
     
     connection.send(JSON.stringify({command: 'chat.openPrivateConversation', parameters: param}));     [id,idfriend]
     connection.send(JSON.stringify({command: 'chat.closePrivateConversation', parameters: param}));    [id,idfriend]
     
     connection.send(JSON.stringify({command: 'chat.getPrivateHistory', parameters: param}));           [id,idfriend]
     connection.send(JSON.stringify({command: 'chat.sendPrivateMessage', parameters: param}));          [id,idfriend,message]
     
     connection.send(JSON.stringify({command: 'chat.openGroupConversation', parameters: param}));       [id,string nazov grupy]
     connection.send(JSON.stringify({command: 'chat.closeGroupConversation', parameters: param}));      [id, group id]
     connection.send(JSON.stringify({command: 'chat.addUserToConversation', parameters: param}));       [id of frienduser, id group]
     connection.send(JSON.stringify({command: 'chat.leaveConversation', parameters: param}));           [id grup, id my]
     connection.send(JSON.stringify({command: 'chat.sendGroupMessage', parameters: param}));            [user.id,group.id,message]
     connection.send(JSON.stringify({command: 'chat.setconversationMode', parameters: param}));         [id,idFriend,true/false]
     connection.send(JSON.stringify({command: 'chat.setGroupName', parameters: param}));                [id,idGroup,string new name] - send back responseGroupInfo()
     connection.send(JSON.stringify({command: 'chat.confirmPrivateMessage', parameters: param}));       [senderId,receiverId,timestamp,typ(private_message_status)]
    
  
     */
}