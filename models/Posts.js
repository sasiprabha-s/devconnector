const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required: true
    },
    name:{
        type:String
    },
    avatar:{
        type:String
    },
    likes:[
        {
            user:{
                type:ObjectId,
                ref:"User"
            }
        }
    ],
    comments:[
        {
            user:{
                type:ObjectId,
                ref:"User"
            },
            text:{
                type:String,
                required:true
            },
            name:{
                type:String
            },
            avatar:{
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = Post = mongoose.model("Post",PostSchema)