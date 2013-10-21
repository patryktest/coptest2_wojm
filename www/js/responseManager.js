function responseLogin(json) {
        
    user = new User(json.user.id, json.user.name, user_status.online, json.friendList, json.groupList, json.lastConversation);
    write("responseLogin OK ");
    write(user);
    if (user !== null) {
        onUserLogin();
    }
    else {
        write('ERR: user is null after LOGIN');
    }
}

function responseLogout(json) {
    write('responseLogout: OK');
}

function responseFriendListUpdate() {

}
function responseGroupClose(json) {
    write('responseGroupClose: OK');
    user.removeGroup(json.data.groupId);
    onCloseGroupChatWindow();

}
function responseGroupInfo(json) {
    write('responseGroupInfo: OK');
    var group = user.getGroupById(json.data.groupId);
    var nameChanged = false;
    if (group) {
        nameChanged = group.update(json.data.groupId, json.data.groupLeader, json.data.groupName, json.data.groupStream,json.data.groupStreamStatus,json.data.history,json.data.limit,json.data.ongoingVideo,json.data.users);
        writeInfo(group,mannage_group_name, nameChanged);
        if(mannage_group_name && nameChanged){
            writeInfo('group name change');
            onOpenGroupChatWindow(getActiveGroupChat());
            mannage_group_name = false;
        }    
    }
    else {
        var group = new Group(json.data.groupId, json.data.groupLeader, json.data.groupName, json.data.groupStream,json.data.groupStreamStatus,json.data.history,json.data.limit,json.data.ongoingVideo,json.data.users);
        user.addGroup(group);
        if (group.isgroupLeader()) {
            
            setActiveGroupChat(json.data.groupId);
            onAfterGroupCreate();
        }
        else{
            onAddToFriendGroup();
            renderContactList();
            //updateRecentConversations(group);
        }
            
        
    }
    


}

/*
 * response after adding user to group
 */
function responseGroupJoin(json) {
    write('responseGroupJoin: OK');
    var group = user.getGroupById(json.data.groupId);
    if(group!==null)
        group.addSelectedFriend(json.data.user);
    write(user);
}

function responseGroupLeave(json) {
    write('responseGroupLeave: OK');
    var group = user.getGroupById(json.data.groupId);
    
    if (group.removeUser(json.data.id)){
        write('user with id:' + json.data.id + ' leaved group');
    }
    else
        write('ERROR in leave group');
    write(user);
}
function responseGroupMessage(json) {
    write('responseGroupMessage: OK');
    var group = user.getGroupById(json.data.groupId);
    if (group) {
        group.addToHistory(json.data);
        if (group.groupId === getActiveGroupChat()) {
            if (json.data.senderId === user.id) {
                $('#inputGroupMessage').val('');
            }
        }
        else {
            group.setNewMessages('+');
        }
    }
}

/*
 * after open new private conversation
 */
function responsePrivateHistory(json) {
    write('responsePrivateHistory: OK');
    var friend = user.getFriendById(getActiveConverastion());
    friend.updateHistory(json.history);
    addNewConversation(getActiveConverastion());
    onOpenPrivateChatWindow(getActiveConverastion());
}

function responsePrivateMessageNew(json) {
    write('responsePrivateMessageNew: OK');    
    var friend = user.getFriendById(json.data.senderId);
    friend.addToHistory(json.data);  
    friend.recent = true;
    user.updateRecentConversationElement(friend);
    if (json.data.senderId === getActiveConverastion()) {
        confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.read);
        friend.updateMessageStatus(user.id,json.data.timeId,private_message_status.read);
    }
    else {
        confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.delivered);
        friend.updateMessageStatus(user.id,json.data.timeId,private_message_status.delivered);
        friend.setNewMessages('+');
    }

}
function responsePrivateMessageSent(json) {
    write('responsePrivateMessageSent: OK');
    var friend = user.getFriendById(json.data.receiverId);
    friend.addToHistory(json.data);
    $('#inputPrivateMessage').val('');
}

function responsePrivateMessageDelivered(json){
    var friend = user.getFriendById(json.data.senderId);
    friend.updateMessageStatus(user.id,json.data.timeId,json.type);
}

function responsePrivateMessageRead(json){
    var friend = user.getFriendById(json.data.senderId);
    friend.updateMessageStatus(user.id,json.data.timeId,json.type);
}

function responseStatusUpdate(json) {
    if (json.result === "OK") {
        write('responseStatusUpdate OK');
        user.setUserStatus(global_status);
    }
    else if (json.userId) {
        var change_status = false;
        for(var status in user_status){
            if(json.chatStatus === user_status[status])
                change_status = true;
        }
        if(change_status){ 
            var friend = user.getFriendById(json.userId);
            friend.updateStatus(json.chatStatus);
        }
    }
    else
        write('responseStatusUpdate ERR result: ' + json.result);


}

function responseSetconversationMode(json) {

}