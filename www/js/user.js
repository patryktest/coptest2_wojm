function User(id, name, status, friendListA, groupListA, lastConversationA) {
    var lastConversationArray = new Array();
    lastConversationArray = lastConversationA;
   
    var friendListArray = new Array();
    for (var i = 0; i < friendListA.length; i++) {
        var history = new Array();
        var recent = false;
        if (lastConversationArray.length) {
            for (var j = 0; j < lastConversationArray.length; j++) {
                if (lastConversationArray[j].userId === friendListA[i].id) {
                    if (lastConversationArray[j].lastMessage)
                        history.push(lastConversationArray[j].lastMessage);
                    if (friendListA[i].newMessages > 0)
                        confirmPrivateMessage(lastConversationArray[j].lastMessage.senderId, lastConversationArray[j].lastMessage.receiverId, lastConversationArray[j].lastMessage.timeId, private_message_status.delivered);
                    recent = true;
                }
            }
        }
        
        friendListArray.push(new Friend(friendListA[i].id, friendListA[i].name, friendListA[i].newMessages, friendListA[i].status, history, recent,friendListA[i].avatarBase64));
    }
    var groupListArray = new Array();
    for (var i = 0; i < groupListA.length; i++) {
        groupListArray.push(new Group(groupListA[i].groupId, groupListA[i].groupLeader, groupListA[i].groupName, groupListA[i].groupStream, groupListA[i].groupStreamStatus, groupListA[i].history, groupListA[i].limit, groupListA[i].ongoingVideo, groupListA[i].users));
    }

    this.id = id;
    this.name = name;
    this.status = status;
    this.friendList = friendListArray;
    this.groupList = groupListArray;
    this.lastConversation = lastConversationArray;

    this.setUserStatus = setUserStatusF;
    this.getFriendById = getFriendByIdF;
    this.getGroupById = getGroupByIdF;
    this.removeGroup = removeGroupF;
    this.addGroup = addGroupF;
    this.recentConversationElement = '';
    this.recentConversationElementInit= recentConversationElementInitF;
    this.updateRecentConversationElement = updateRecentConversationElementF;


    function setUserStatusF(stat) {
        this.status = stat;
    }

    function getFriendByIdF(id) {
        for (var i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].id === id)
                return this.friendList[i];
        }
        return null;
    }

    function getGroupByIdF(id) {
        for (var i = 0; i < this.groupList.length; i++)
        {
            if (this.groupList[i].groupId === id)
                return this.groupList[i];
        }
        return null;
    }

    function removeGroupF(id) {
        for (var i = 0; i < this.groupList.length; i++) {
            if (this.groupList[i].groupId === id)
                this.groupList.splice(i, 1);
        }
        removeGroupFromContactList(id);
        removeGroupFromMainList(id);

    }
    
    function addGroupF(group){
        user.groupList.push(group);
        this.recentConversationElement.appendChild(group.itemElement);
        /*var element = $('#chatListT');
        if ((element).hasClass('ui-listview')) {
            //element.listview();
            element.listview('refresh');
        }*/
    }

    function recentConversationElementInitF() {
       /* var element = document.createElement('ul');
        element.setAttribute('data-role','listview');
        element.setAttribute('id','chatListT');
        */
       var element = new Array();
        for (var i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].recent) {
                //element.appendChild(this.friendList[i].itemElement);
                element.push(this.friendList[i].itemElement);
            }
        }
        for (var i = 0; i < this.groupList.length; i++) {
            //element.appendChild(this.groupList[i].itemElement);
            element.push(this.groupList[i].itemElement);
        }
        return element;
    }
    
    function updateRecentConversationElementF(friend){
        this.recentConversationElement.insertBefore(friend.itemElement,this.recentConversationElement.firstChild);
        
    }


}