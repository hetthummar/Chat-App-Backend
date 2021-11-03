// module.exports = class PrivateMessageModel {

//     constructor({id,participants,receiverId,senderId,senderName,senderPlaceholderImage,msgContent,msgContentType,createAt,seenAt,msgStatus} = {}){
//          this.id = id,
//          this.participants =participants,
//          this.receiverId = receiverId,
//          this.senderId = senderId,
//          this.senderName = senderName,
//          this.senderPlaceholderImage = senderPlaceholderImage,
//          this.msgContent= msgContent,
//          this.msgContentType = msgContentType,
//          this.createAt = createAt,
//          this.seenAt = seenAt,
//          this.msgStatus = msgStatus;
//     }
// }

const mongoose = require('mongoose');

const participantsSchema = new mongoose.Schema({
    user1_id:{
        type:String,
        required:true,
        immutable:true,
    },
    user2_id:{
        type:String,
        required:true,
        immutable:true,
    }
});

const privateMessageSchema = new mongoose.Schema({
    participants:{
        type:participantsSchema,
        required:true,
    },
    receiver_id:{
        type:String,
        required:true,
        immutable:true,
    },
    sender_id:{
        type:String,
        required:true,
        immutable:true,
    },
    sender_name:{
        type:String,
        required:true,
    },
    sender_placeholder_image:{
        type:String,
        required:true,
    },
    msg_content:{
        type:String,
        required:true,
        immutable:true,
    },
    msg_content_type:{
        type:String,
        required:true,
        immutable:true,
    },
    created_at:{
        type:Number,
        default:Date.now()
    },
    seen_at:{
        type:Number,
        default:0
    },
    delivered_at:{
        type:Number,
        default:0 
    },
    msg_status:{
        type:Number,
        default:0
    },
    sender_local_updated:{
        type:Boolean,
        default:true
    },
    receiver_local_updated:{
        type:Boolean,
        default:false
    },

});

const model = mongoose.model('messages',privateMessageSchema);
module.exports = model;