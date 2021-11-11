const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength: 34,
    },
    phoneNumber:{
        type:String,
        required:true,
        immutable:true,
        minlength:10,
    },
    firebase_token_id:{
        type:String,
        required:true,
    },
    created_at:{
        type:Number,
        default:Date.now()
    },
    updated_at:{
        type:Number,
        default:Date.now()
    },
    profile_image:{
        type:String,
        default:null
    },
    compressed_profile_image:{
        type:String,
        default:null
    },
    status_line:{
        type:String,
        minlength:1,
        maxlength: 120,
        default:"Hey, I am using socket chat"
    },
    value:{
        type:Number,
        default:0
    },
    joined_groups:{
        type:[Number],
    },
    isOnline:{
        type:Boolean,
        default:false
    }
});

const model = mongoose.model('users',userSchema);
module.exports = model;