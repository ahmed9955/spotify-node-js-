const mongoose = require('mongoose')
const { Schema } = mongoose 

const postSchema = new Schema({
    content:{
        type:String,        
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar:{
        type: String
    }
},{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post