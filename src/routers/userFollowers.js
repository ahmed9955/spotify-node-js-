//set up router
const express = require('express')
const router = express.Router()

//authentication
const auth = require('../middleware/auth')
const User = require('../models/user')


router.post('/requestFollow/:id',auth , async (req, res) => {
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)
    user.requests.push(req.user._id)
    currentUser.following.push(req.params.id)
    await user.save()
    await currentUser.save()

    res.send({
        success: "added successfully"
    })
})

router.post('/follwers/:id', auth,async (req,res) => {

    const currentUser = await User.findById(req.user._id)
    const user = await User.findById(req.params.id)
    
    currentUser.followers.push(req.params.id)
    currentUser.following.push(req.params.id)
    currentUser.requests = user.requests.filter(request => request != req.params.id)
    user.followers.push(req.user._id)
    
    await currentUser.save()
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

router.get('/suggestions',auth, async (req,res) => {
    const user = await User.find({followers: { "$in" : req.user.followers}})
    const response = user.filter(user => user.email !== req.user.email)
    const list = User.HandleJSON(response).sort(() => Math.random() - 0.5)
    
    res.send(list)
    
})

router.get('/followers', auth, async (req, res) => {
    const followers = await User.findById(req.user._id)
    .populate('followers')
    
    res.send(User.HandleJSON(followers.followers))
})

router.get('/following', auth, async (req, res) => {
    const following = await User.findById(req.user._id)
    .populate('following')
    
    res.send(User.HandleJSON(following.following))
})


module.exports = router