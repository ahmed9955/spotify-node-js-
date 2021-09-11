const express = require('express')
const auth = require('../middleware/auth')
const Chat = require('../models/chat')
const router = express.Router()


router.get('/chat', async (req, res) => {

    const chats =  await Chat.find({})

    res.send(chats)

})

router.post('/showchatmessage/:id', auth,async (req, res) => {

        const chatsMod = await Chat.find({
            'reciever.id': req.user._id.toString(),
            'sender.id': req.params.id 
        })
    

        for (let i =0 ; i < chatsMod.length; i++){
            
            chatsMod[i].color = '#636363'
            chatsMod[i].fontWeight = 'normal'    
                    
            await chatsMod[i].save()

        }

        res.send( chatsMod )

})

module.exports = router