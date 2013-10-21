function connect() {
    //$('#loginButton').button ("disable");
    
    console.log('onconnect');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    try{
        connection = new WebSocket(WEBSOCKETLINK);
    }
    catch (e){
        console.log(e);
    }
    connection.onopen = function() {
        onConnectionOpen();   
    };

    connection.onerror = function(error) {
        onLogout();
        onConnectionError(error);
    };

    connection.onmessage = function(message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            write('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        console.log(json);

        switch (json.type) {
            case 'SERVER_LOGIN':
                responseLogin(json);
                break;
            case 'SERVER_LOGOUT':
                responseLogout(json);
                break;
            case 'SERVER_STATUS_UPDATE':
                responseStatusUpdate(json);
                break;
            case 'SERVER_FRIENDLIST_UPDATE':
                responseFriendListUpdate();
                break;
            case 'SERVER_PRIVATE_HISTORY':
                responsePrivateHistory(json);
                break;
            case 'SERVER_GROUP_MESSAGE':
                responseGroupMessage(json);
                break;
            
           case 'SERVER_PRIVATE_MESSAGE_SENT':
                responsePrivateMessageSent(json);
                break;
            case 'SERVER_PRIVATE_MESSAGE_DELIVERED':
                responsePrivateMessageDelivered(json);
                break;
            case 'SERVER_PRIVATE_MESSAGE_READ':
                responsePrivateMessageRead(json);
                break;
            case 'SERVER_PRIVATE_MESSAGE_NEW':
                responsePrivateMessageNew(json);
                break;           
            case 'SERVER_GROUP_INFO':
                responseGroupInfo(json);
                break;
            case 'SERVER_GROUP_JOIN':
                responseGroupJoin(json);
                break;
            case 'SERVER_GROUP_LEAVE':
                responseGroupLeave(json);
                break;
            case 'SERVER_GROUP_CLOSE':
                responseGroupClose(json);
                break;
            case 'SERVER_':
                responseSetconversationMode(json);
                break; 
        }


    };
}