const mongoose = require('mongoose')
const { Schema } = mongoose

const verificationSchema = new Schema({
    code:{
        type: Number,
        unique: true
    }
})

const Code = mongoose.model('Code', verificationSchema)

module.exports = Code