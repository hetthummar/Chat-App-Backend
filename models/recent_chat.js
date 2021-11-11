const mongoose = require('mongoose');

const recentChatSchema = new mongoose.Schema({
    _id:{
        type:String
    },
    user1_name:{
        type:String,
        required:true,
    },
    user1_compressed_image:{
        type:String,
        default:null,
    },
    user2_name:{
        type:String,
        required:true,
    },
    user2_compressed_image:{
        type:String,
        default:null,
    },
    participants:{
        type:[String]
    },
    // user1_unread_msg:{
    //     type:Number,
    //     default:0
    // },
    // user2_unread_msg:{
    //     type:Number,
    //     default:0
    // },
    // last_msg_time:{
    //     type:Number,
    //     default:null
    // },
    // last_msg:{
    //     type:String,
    //     default:null,
    // },
    user1_local_updated:{
        type:Boolean,
        default:false
    },
    user2_local_updated:{
        type:Boolean,
        default:false
    }
});

const model = mongoose.model('recentChat',recentChatSchema);
module.exports = model;