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
    },

    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],

    replays: [{
        type: Schema.Types.ObjectId,
        ref:'Replay',
        unique:true
    }]

}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment