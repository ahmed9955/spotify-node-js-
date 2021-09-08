const express = require('express')
const Notifications = require('../models/notifications')
const router = express.Router()


router.get('/notifications', async (req, res) => {

    const notifications =  await Notifications.find({})

    res.send(notifications)

})


module.exports = router