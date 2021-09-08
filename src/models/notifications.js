const mongoose = require('mongoose')
const  { Schema } = mongoose;

const notificationSchema = new Schema({
    sender:{
        type: Object
    },
    reciever:{
        type: Object
    },
    notification:{
        type: String
    }
})

const Notifications = mongoose.model('Notifications', notificationSchema)

module.exports = Notifications