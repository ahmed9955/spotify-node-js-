const mongoose = require('mongoose')

const { Schema } = mongoose

const replySchema = new Schema({
    content: {
        type: String,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
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

const Replay = mongoose.model('Replay', replySchema)

module.exports = Replay