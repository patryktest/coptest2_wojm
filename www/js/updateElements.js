
function updateRecentContactMessage(id, command, message, message_status) {
    message_status = message_status || null;
    switch (command) {
        case 'friend':
            $('#chatListT #friend_list_' + id + ' span.ui-li-message-text').html(message);
            if (message_status !== null) {
                var message_status_element = $('#chatListT #friend_list_' + id + ' span.ui-li-message-status');
                message_status_element.removeClass();
                message_status_element.addClass('ui-li-message-status  message_status_' + message_status);
            }
            break;
        case 'group':
            $('#chatListT #group_list_' + id + ' span.ui-li-message-text').html(message);
            break;
    }

}

function addRecentNotification(command, data) {
    switch (command) {
        case 'friend':
            $('#chatListT #friend_list_' + data.id + ' span.ui-li-message-status').addClass('hidden');
            $('#chatListT #friend_list_' + data.id + ' span.ui-li-message-count').removeClass('hidden');
            $('#chatListT #friend_list_' + data.id + ' span.ui-li-message-count').html(data.newMessages);
            updateRecentContactMessage(data.id, command, "new message");
            break;
        case 'group':
            $('#chatListT #group_list_' + data.groupId + ' span.ui-li-message-count').removeClass('hidden');
            $('#chatListT #group_list_' + data.groupId + ' span.ui-li-message-count').html(data.newMessages);
            updateRecentContactMessage(data.groupId, command, "new message");
            break;



    }
}

function clearRecentNotification(command, item) {
    switch (command) {
        case 'friend':
            $('#chatListT #friend_list_' + item.id + ' span.ui-li-message-status').removeClass('hidden');
            $('#chatListT #friend_list_' + item.id + ' span.ui-li-message-count').addClass('hidden');
            $('#chatListT #friend_list_' + item.id + ' span.ui-li-message-count').html(item.newMessages);
            if (item.history.length > 0)
                updateRecentContactMessage(item.id, command, item.history[item.history.length - 1].message);
            else
                updateRecentContactMessage(item.id, command, '');
            break;
        case 'group':
            $('#chatListT #group_list_' + item.groupId + ' span.ui-li-message-count').addClass('hidden');
            $('#chatListT #group_list_' + item.groupId + ' span.ui-li-message-count').html(item.newMessages);
            if (item.history.length > 0)
                updateRecentContactMessage(item.groupId, command, item.history[item.history.length - 1].message);
            else
                updateRecentContactMessage(item.groupId, command, '');
            break;


    }

}


function updateRecentConversations(group) {
    message = '';
    $('#chatListT').listview();
    $('#chatListT').append('\n\
        <li id="group_list_' + group.groupId + '" data-icon="false">\n\
            <a href="" onclick="' + group.startGroupChat + '">\n\
                <img  src="./img/profil_img.png" alt="status" class="ui-li-icon"><strong class="name">' + group.displayGroupName + '</strong>\n\
                 <p class="chat-list-group-item">\n\
                    <span class="ui-li-message-count hidden"></span>\n\
                    <span class="ui-li-message-text">' + message + '</span>\n\
                </p>\n\
            </a>\n\
        </li>\n\
    ');
    $('#chatListT').listview('refresh');
}

function updateRecentConversationGroupName(group) {
    $('#group_list_' + group.groupId + ' .name').html(group.displayGroupName);
}
function updateContactListGroupName(group) {
    $('#group_list_' + group.groupId + ' .name').html(group.displayGroupName);
}

function updtateGroupChatWindowName(group) {
    $('#groupChatPageTemplate #groupChatPageT').html(group.displayGroupName);
}

function updateContactListSelectFriend(id, command) {
    switch (command) {
        case 'add':
            $('#contactListT #friend_list_' + id).addClass('ui-selectedFriend');
            break;
        case 'remove':
            $('#contactListT #friend_list_' + id).removeClass('ui-selectedFriend');
            break;
    }


}

function updateSelectedFriendView() {
    
    if (mannage_group_conntact) {
        $('#contactT').html('Manage Group');
        $('.manageGroupMembers').removeClass('hidden');
        $('.btn_openPrivateGroupChat').addClass('hidden');
    } else {
        $('#contactT').html('Connections');
        $('.manageGroupMembers').addClass('hidden');
        $('.btn_openPrivateGroupChat').removeClass('hidden');
    }
    if (selectedFriend.length)
        $('#contactPageSmallMenu').css({display: 'block'});
    else
        $('#contactPageSmallMenu').css({display: 'none'});

    $('#contactList-selectedFriendT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        for (var j = 0; j < selectedFriend.length; j++) {
            if (user.friendList[i].id === selectedFriend[j]) {
                var image = './img/profil_img.png';  
                if(user.friendList[i].avatar!==null)
                    image = 'data:image/png;base64,'+user.friendList[i].avatar;
                $('#contactList-selectedFriendT').append('<li id="friend_list_' + user.friendList[i].id + '" class="ui-btn ui-btn-icon-right ui-li ui-li-has-icon ui-btn-up-d" data-icon="false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="d">\n\
                 <div class="ui-btn-inner ui-li">\n\
                    <div class="ui-btn-text">\n\
                        <a class="ui-link-inherit" href="" onclick="selectFriend(' + user.friendList[i].id + ');">\n\
                            <img class="ui-li-icon ui-li-thumb" alt="status" src="' + image + '">\n\
                                ' + user.friendList[i].name + '\n\
                            </a>\n\
                            <span class="user-delet-icon"></span>\n\
                            <span class="user-status-icon ui-icon-' + user.friendList[i].status + ' device-mobile"></span>\n\
                    </div>\n\
                </div>\n\
                </li>');
            }
        }
    }

}

function removeGroupFromContactList(id) {
    $('#contactListT #group_list_' + id).remove();
}

function removeGroupFromMainList(id) {
    $('#chatListT #group_list_' + id).remove();
}

function updateContactListView() {
    for (var i = 0; i < user.friendList.length; i++)
        $('#contactListT #friend_list_' + user.friendList[i].id).removeClass('ui-selectedFriend');
}