const express = require('express')
const Chat = require('../models/chat')
const router = express.Router()
// const auth = require('../middleware/auth')


router.get('/chat', async (req, res) => {

    const chats =  await Chat.find({})

    res.send(chats)

})


module.exports = router