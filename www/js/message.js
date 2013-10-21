function Message(id,date, groupId,message, receiverId,senderId,status,time,timeId,timestamp){
    var userS = '';
    if(id===receiverId)
        userS = 'friend_';
    var statusE = document.createElement('span');
    statusE.setAttribute('class',userS+'message_status_'+status);
    
    var statusER = document.createElement('span');
    statusER.setAttribute('class','ui-li-message-status  message_status_'+status);
    
    this.date = date;
    this.groupId = groupId;
    this.message = message;
    this.receiverId = receiverId;
    this.senderId = senderId;
    this.status = status;
    this.statusElement = statusE;
    this.statusElementRecent = statusER;
    this.time = time;
    this.timeId = timeId;
    this.timestamp = timestamp;
    this.updateStatus = updateStatusF;
    
    function updateStatusF(userId,status){
        var userS = '';
        if(userId===this.receiverId)
            userS = 'friend_';
        this.status = status;
        this.statusElement.setAttribute('class',userS+'message_status_'+status);
        this.statusElementRecent.setAttribute('class','ui-li-message-status  message_status_'+status);
    }
    
    
}