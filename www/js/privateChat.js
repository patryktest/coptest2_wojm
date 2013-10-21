var actualOpeningChat = "";
var openConversation = [];
numberMessageItemGroup = 0;

function isOpenConveresation(){
    if(openConversation.length) return true;
    else return false;
}
function addNewConversation(id) {
    openConversation.push(id);
}

function closeConverastion(id) {
    for (var i = 0; i < openConversation.length; i++) {
        if (openConversation[i] === id)
            openConversation.splice(i, 1);
    }
}

function findConverasation(id) {
    for (var i = 0; i < openConversation.length; i++) {
        if (openConversation[i] === id)
            return true;
    }
    return false;
}

function setActiveConverastion(id) {
    actualOpeningChat = id;
}

function getActiveConverastion() {
    return actualOpeningChat;
}

function closePrivateChatWindow(){
    closeConverastion(getActiveConverastion());
    
}