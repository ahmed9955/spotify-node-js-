//set up router
const express = require('express')
const router = express.Router()

//authentication
const auth = require('../middleware/auth')
const User = require('../models/user')


router.post('/requestFollow/:id',auth , async (req, res) => {
    const user = await User.findById(req.user._id)
    user.requests.push(req.params.id)
    await user.save()

    res.send({
        success: "added successfully"
    })
})

router.post('/follwers/:id', auth,async (req,res) => {

    const user = await User.findById(req.user._id)
    user.followers.push(req.params.id)
    user.following.push(req.params.id)
    user.requests = user.requests.filter(request => request != req.params.id)
    await user.save()

    res.send({
        success: "added successfully"
    })
})

router.post('/following/:id', auth,async (req,res) => {

    const user = await User.findById(req.user._id)
    user.following.push(req.params.id)
    await user.save()

    res.send({
        success: "added successfully"
    })
})

module.exports = router