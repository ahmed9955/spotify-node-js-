//set up router
const express = require('express')
const router = express.Router()

//authentication
const auth = require('../middleware/auth')
const User = require('../models/user')

/*upload image configuration*/
const multer = require('multer')
const URL = "http://localhost:3000/"
const storage = multer.diskStorage({
    destination(req,file, cb){
        cb(null,'./upload/profile')

    },
   async filename(req,file,cb){
        const user = await req.user
        cb(null, user._id + file.mimetype.replace('image/','.').trim())
    },
})
const upload = multer({
    storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter (req, file, cb){
        const imgType = ['image/jpg' , 'image/jpeg']
        if( !imgType.includes(file.mimetype) ){
           return cb(new Error('enter a valid type'),false)
        }
        cb(null,true)
    }
})
/*upload image configuration*/

//create account
router.post('/register', async (req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        const response = await user.save()

        res.send({
            sucess:"successfully registered",
            response: User.JSON(response),
            token
        })
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
    
})

//login into existing account
router.post('/login',async (req,res) => {
    try {
        const {profileName, email, password} = req.body
        const user = await User.findByCredentials(email, password, profileName)
        const token = await user.generateAuthToken()
        const response = await User.JSON(user)

        res.send({response,token})
    
    } catch (e) {
        res.send({
            error: 'logged in failed'
        })
    }
})

//get user profile
router.get('/me', auth, async (req,res) => {

    try {
        const user = await req.user
        res.send(User.JSON(user))
    } catch (e) {
        res.status(400).send(e.message)        
    }
})

//update profile data
router.patch('/me', auth,async (req, res) => {
    const updates = Object.keys(req.body)  
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
})

//upload profile picture
router.post('/avatar', auth,upload.single('avatar'),async (req,res) => {
    const user = await req.user
    user.avatar =  URL + req.file.path.replace('upload/','').trim()

    await req.user.save()

    res.send({
        avatar: user.avatar
    })
})

//get profile image
router.get('/avatar', auth,async (req,res) => {
    const user = await req.user

    res.send({
        avatar: user.avatar
    })
})


//delete account
router.delete('/me', auth, async (req, res) => {

    await User.findByIdAndRemove(req.user._id)
    res.send({
        success: "deleted successfuly"
    })

})

//logging out
router.post('/me/logout', auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter(token => token.token != req.token)
    await req.user.save()
    
    res.send({
        user: req.user
    })
})


module.exports = router