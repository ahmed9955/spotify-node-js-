//set up router
const express = require('express')
const router = express.Router()

//authentication
const auth = require('../middleware/auth')
const allowCors = require('../middleware/cors-origin')
const User = require('../models/user')

router.use(allowCors)

router.post('/requestFollow/:id',auth , async (req, res) => {
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)
    if (user.requests.find(user => user.toString() == req.user._id)) {
        return res.send({success: 'already exists'})
    }
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

router.get('/followers/:id', auth, async (req, res) => {
    const followers = await User.findById(req.params.id)
    .populate('followers')
    
    res.send(User.HandleJSON(followers.followers))
})


router.get('/following', auth, async (req, res) => {
    const following = await User.findById(req.user._id)
    .populate('following')
    
    res.send(User.HandleJSON([... new Set(following.following)]))
})

router.get('/following/:id', auth, async (req, res) => {
    const following = await User.findById(req.params.id)
    .populate('following')
    
    res.send(User.HandleJSON(following.following))
})

router.get('/requests', auth, async (req, res) => {
    const request = await User.findById(req.user._id)
    .populate('requests')
    
    res.send(User.HandleJSON(request.requests))
})

router.get('/users/whotofollow', auth,async (req, res) => {

    const usersToFollow = await User.find({})
    
    const whotofollow = usersToFollow.filter(user => 
        req.user._id.toString() != user._id 

        && !req.user.following.includes(user._id)

        )
    
        
    res.send(shuffle(whotofollow))
    
})


function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



router.post('/unfollow/:id', auth, async (req, res) => {

    try {
    
    const user = await User.findById(req.params.id)
    
    user.followers = user.followers.filter(user => req.user._id.toString() !== user.toString() )

    user.requests = user.requests.filter(user => req.user._id.toString() !== user.toString() )

    await user.save()
    
    
    req.user.followers = req.user.followers.filter(follower => follower.toString() !== req.params.id )
    req.user.following = req.user.following.filter(follower => follower.toString() !== req.params.id )
    
    await req.user.save()
    
    res.send({
        success: 'unfollowed'
    })
} catch (e) {
        res.status(404).send(e.message)
    }
    
})

module.exports = router