const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    content: {
        type: String,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar:{
        type: String
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment