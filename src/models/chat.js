const mongoose = require('mongoose')
const  { Schema } = mongoose;

const chatSchema = new Schema({
    sender:{
        type: Object
    },
    reciever:{
        type: Object
    },
    message:{
        type: String
    }
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat