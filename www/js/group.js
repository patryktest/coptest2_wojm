var activeGroupChat;
var openGroupChat;

function Group(groupId, groupLeader, groupName, groupStream, groupStreamStatu, history, limit, ongoingVideo, users) {
    var message = '';
    if (history.length)
        message = history[history.length - 1].message;
    
    this.displayGroupName = groupName;
    this.groupId = groupId;
    this.groupName = groupName;
    this.groupLeader = groupLeader;
    this.groupStream = groupStream;
    this.groupStreamStatus = groupStreamStatu;
    this.history = history;
    this.historyElement = '';
    this.createHistoryElement = createHistoryElementF;
    this.createHistoryElement();
    this.updateHistoryElement = updateHistoryElementF;
    
    this.limit = limit;
    this.ongoingVideo = ongoingVideo;
    this.users = users;
    this.newMessages = 0;
    this.startGroupChat = 'onOpenGroupChatWindow(' + this.groupId + ')';
    this.itemElement = itemTemplate('group_list_',this.groupId,this.startGroupChat,this.displayGroupName,this.newMessages,null,message,'',null);
    this.updateItemElement = updateItemElementF;
    this.checkUpdateGroupName = checkUpdateGroupNameF;
    this.isgroupLeader = isgroupLeaderF;
    this.addSelectedFriend = addSelectedFriendF;
    this.removeUser = removeUserF;
    this.update = updateF;
    this.hasUser = hasUserF;
    this.addToHistory = addToHistoryF;
    this.setNewMessages = setNewMessagesF;
    this.lastMessage = lastMessageF;

   
    this.renderGroupName = renderGroupNameF;
    
    this.checkUpdateGroupName();

    function addToHistoryF(history) {
        this.history.push(new Message(user.id, history.date, history.groupId, history.message, history.receiverId, history.senderId, history.status, history.time, history.timeId, history.timestamp));
        this.updateHistoryElement();
        this.updateItemElement();
    }

    function checkUpdateGroupNameF() {
        if (this.groupName === this.groupLeader.name)
            this.displayGroupName = this.groupLeader.name + ' + ' + (this.users.length - 1);
        updateRecentConversationGroupName(this);
        this.renderGroupName();
        if (this.groupId === getActiveGroupChat()) {
            updtateGroupChatWindowName(this);
        }
    }

    function isgroupLeaderF() {
        if (this.groupLeader.id === user.id)
            return true;
        return false;
    }

    function addSelectedFriendF(user) {
        this.users.push(user);
        this.checkUpdateGroupName();
    }

    function removeUserF(idUser) {
        var users = this.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === idUser) {
                users.splice(i, 1);
                this.checkUpdateGroupName();
                return true;
            }
        }
        return false;
    }
    function updateF(groupId, groupLeader, groupName, groupStream, groupStreamStatu, history, limit, ongoingVideo, users) {
        var oldName = this.groupName;
            
        this.displayGroupName = groupName;
        this.groupId = groupId;
        this.groupName = groupName;
        this.groupLeader = groupLeader;
        this.groupStream = groupStream;
        this.groupStreamStatus = groupStreamStatu;
        this.history = history;
        this.limit = limit;
        this.ongoingVideo = ongoingVideo;
        this.users = users;
        this.newMessages = 0;
        this.checkUpdateGroupName();
        var nameChanged = false;
        if (oldName !== groupName){
            nameChanged = true;
            this.renderGroupName();            
        }
        return nameChanged;
    }

    function hasUserF(idUser) {
        var users = this.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === idUser) {
                return true;
            }
        }
        return false;
    }
    
    function setNewMessagesF(num){
        if(num==='+'){
            this.newMessages++;
            addRecentNotification('group',this);
        }
        else if(num===0)
            clearRecentNotification('group',this);
        else
            this.newMessages = num;
        
        
        
    }
    
    function lastMessageF(){
        if(this.history.length>0)
            return this.history[history.length-1].message;
        else return '';
    }

    function renderGroupNameF(){
        var elements = this.itemElement.getElementsByTagName("span");
        for(var i=0;i<elements.length;i++){
            var classs = elements[i].className.split(' ');
            for(var j=0;j<classs.length;j++){
                if(classs[j]==='name')
                    elements[i].innerHTML = '<strong>'+this.displayGroupName+'</strong>';
            }

        }
    }
    function createHistoryElementF() {

        var time = '', mess = '', name = '', date = '';


        $('#groupChatPageT').html(this.displayGroupName);

        var mainElement = document.createElement('ul');
        mainElement.setAttribute('data-role', 'listview');
        mainElement.setAttribute('id', 'groupChatHistory');
        this.historyElement = mainElement;
        var element_groupChatHistory = this.historyElement;

        var history = this.history;
        var senderID = '';
        var lastSender = '';
        var lastSendTime = '';
        var lastDate = '';
        var status = '';
        var htmlString;
        var userIsSender = false;
        numberMessageItemGroup = 0;
        for (var i = 0; i < history.length; i++) {
            if (history[i].senderId === user.id) {
                name = user.name;
                userIsSender = true;
            }
            else {
                //name = getFriendName(history[i].senderId);
                name = '';
                userIsSender = false;
            }

            mess = history[i].message;
            senderID = history[i].senderId;



            var newDate = new Date(history[i].timeId);
            time = newDate.getUTCFullYear() + ':' + newDate.getUTCDate() + ':' + newDate.getUTCMonth() + ':' + newDate.getUTCHours() + ':' + newDate.getUTCMinutes();
            date = newDate.getUTCDate() + '.' + newDate.getUTCMonth() + '.' + newDate.getUTCFullYear();
            if (lastDate === date) {
                date = "";
            }
            else {
                lastDate = date;
            }

            if (lastSender !== senderID) {
                numberMessageItemGroup++;
                var element = messageTemplate(userIsSender, mess, status, (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date, numberMessageItemGroup);
                element_groupChatHistory.appendChild(element);
            }
            else {
                var element = element_groupChatHistory.lastChild;
                var elementP = document.createElement('p');

                if (history[i].senderId === user.id) {
                    elementP.setAttribute('class', 'ui-li-message-left ui-li-desc');
                }
                else {
                    elementP.setAttribute('class', 'ui-li-message-right ui-li-desc');
                }
                elementP.innerHTML = mess;
                element.appendChild(elementP);

                if (lastSendTime === time) {
                    var lastElement = element.getElementsByClassName('ui-li-message-time');
                    element.removeChild(lastElement[lastElement.length - 1]);
                }

                var elementTime = document.createElement('p');
                elementTime.setAttribute('class', 'ui-li-message-time ui-li-desc');
                elementTime.innerHTML = (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date;
                //elementTime.appendChild(statusElement);
                element.appendChild(elementTime);
            }
            lastSender = senderID;
            lastSendTime = time;




        }


        /*if (element_groupChatHistory.hasClass('ui-listview')) {
         element_groupChatHistory.listview();
         element_groupChatHistory.listview('refresh');
         }
         ;
         $('#groupChatPageTemplate').on('pageshow', function() {
         $.mobile.silentScroll($('#groupChatHistory').height());
         $('.block-input-send').css({width: ($(document).width() - $('.block-button-send .ui-btn').width() - 50) + 'px'});
         });*/


    }
    function updateItemElementF(){
        var elements = this.itemElement.getElementsByTagName("span");
    
    for(var i=0;i<elements.length;i++){
        var classs = elements[i].className.split(' ');
        for(var j=0;j<classs.length;j++){
            console.log(classs[j]);
            if(classs[j]==='ui-li-message-text')
                elements[i].innerHTML = this.lastMessage();
        }
        
    }
    }
    function updateHistoryElementF() {
        var element_groupChatHistory = this.historyElement;
        var history = this.history;
        var time = '', mess = '', name = '', date = '';
        var userIsSender = false;
        var htmlString;

        var lastMessage = history[history.length - 1];
        var lastestMessage = "";
        if (history.length > 1)
            lastestMessage = history[history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
            userIsSender = true;
        }
        else {
            //name = getFriendName(lastMessage.senderId);
            userIsSender = false;
            name = '';
        }


        var newDate = new Date(lastMessage.timeId);
        var lastDate = new Date(lastestMessage.timeId);
        time = newDate.getUTCFullYear() + ':' + newDate.getUTCDate() + ':' + newDate.getUTCMonth() + ':' + newDate.getUTCHours() + ':' + newDate.getUTCMinutes();
        date = newDate.getUTCDate() + '.' + newDate.getUTCMonth() + '.' + newDate.getUTCFullYear();
        oldTime = lastDate.getUTCFullYear() + ':' + lastDate.getUTCDate() + ':' + lastDate.getUTCMonth() + ':' + lastDate.getUTCHours() + ':' + lastDate.getUTCMinutes();
        oldDate = lastDate.getUTCDate() + '.' + lastDate.getUTCMonth() + '.' + lastDate.getUTCFullYear();

        if (oldDate === date)
            date = "";

        if (lastestMessage.senderId !== lastMessage.senderId) {
            numberMessageItemGroup++;
            var element = messageTemplate(userIsSender, lastMessage.message, '', (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date, numberMessageItemGroup);
            element_groupChatHistory.appendChild(element);
        }
        else {
            var element = element_groupChatHistory.lastChild;
            var elementP = document.createElement('p');
            if (userIsSender) {
                //htmlString = '<p class="ui-li-message-left ui-li-desc">' + lastMessage.message + '</p>';
                elementP.setAttribute('class', 'ui-li-message-left ui-li-desc');
            }
            else {
                //htmlString = '<p class="ui-li-message-right ui-li-desc">' + lastMessage.message + '</p>';
                elementP.setAttribute('class', 'ui-li-message-right ui-li-desc');
            }
            elementP.innerHTML = lastMessage.message;
            element.appendChild(elementP);
            if (oldTime === time){
                var lastElement = element.getElementsByClassName('ui-li-message-time');
                element.removeChild(lastElement[lastElement.length - 1]);
            }
            var elementTime = document.createElement('p');
            elementTime.setAttribute('class', 'ui-li-message-time ui-li-desc');
            elementTime.innerHTML = (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date;
            //elementTime.appendChild(statusElement);
            element.appendChild(elementTime);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 100);




    }
}

function setActiveGroupChat(id) {
    activeGroupChat = id;
}

function getActiveGroupChat() {
    return activeGroupChat;
}

function addOpenGroupChat(id) {
    openGroupChat.push(id);
}

function closeOpenGroupChat(id) {
    for (var i = 0; i < openGroupChat.length; i++) {
        if (openGroupChat[i] === id)
            openGroupChat.splice(i, 1);
    }
}




function isUserInGroup(idUser, idGroup) {
    var group = getGroupById(idGroup);
    if (group !== null) {
        var users = group.users;
        for (var i = 0; i < users.length; i++) {
            console.log('userID: ' + idUser + ' users in group' + users[i].id);
            if (users[i].id === idUser)
                return true;
        }
        return false;
    }
    return null;

}







