const express = require('express')
const Notifications = require('../models/notifications')
const router = express.Router()
const auth = require('../middleware/auth')


router.get('/notifications',auth,async (req, res) => {

    const notifications =  await Notifications.find({
        reciever: req.user._id.toString()
    })

    res.send(notifications.reverse())

})

router.post('/notifications/:id', async (req, res) => {

    const notifications = await Notifications.findById(req.params.id)

    notifications.color = 'white'

    await notifications.save()
    res.send({
        success: notifications
    })
})

router.get('/notificationscount',auth,async (req, res) => {

    const notifications =  await Notifications.find({
        reciever: req.user._id.toString(),
        color: 'skyblue'

    })

    res.send(notifications.length)

})


module.exports = router