const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/posts')
const uid = require('uuid-random')
// const allowCors = require('../middleware/cors-origin')


// router.use(allowCors)

/*upload image configuration*/
const multer = require('multer')
const User = require('../models/user')
const URL = "http://localhost:2000/"
const storage = multer.diskStorage({
    destination(req,file, cb){
        cb(null,'./upload/postPic')

    },
   async filename(req,file,cb){
       if (file.mimetype.includes('image/') ){
        cb(null, uid() + file.mimetype.replace('image/','.').trim())
       } else {

        cb(null, uid() + file.mimetype.replace('video/','.').trim())
           
       }
    },
})

const upload = multer({
    storage,
    limits:{
        fileSize: 1024 * 1024 * 100
    },
    fileFilter (req, file, cb){
        const imgType = ['image/jpg' , 'image/jpeg', 'image/png', 'video/mp4']
        if( !imgType.includes(file.mimetype) ){
           return cb(new Error('enter a valid type'),false)
        }
        cb(null,true)
    }
})

/*upload image configuration*/
router.post('/post',auth,upload.single('postPic'),async (req,res) => {
    
    try {
    
        const post = new Post(req.body)

        if (req.file){
            post.avatar =  URL + req.file.path.replace('upload/','').trim()
        }
        post.user = req.user._id
        await post.save()
        req.user.post.push(post._id)
        await req.user.save()
        await post.save()
        res.send(post)

    } 
    catch (e){
    res.status(500).send(e)
}

})  



router.post('/like/:id', auth, async (req,res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        const checkUser = post.like.includes(req.user._id)
        
        if (!checkUser){
            post.like.push(req.user._id)
    
            const response = await post.save()
            return res.send(response)

        } else {
            return res.send({
                liked: true
            })
        }

    } catch(e) {
        res.status(400).send(e)
    }
    

})

router.post('/dislike/:id', auth, async (req,res) => {
    const post = await Post.findById(req.params.id)
    const checkUser = post.like.includes(req.user._id)
    
    
    if (checkUser){
        
        post.like = post.like.filter(id => id.toString() !== req.user._id.toString())
        console.log(post.like)
        await post.save()
        return res.send({
            success: 'disliked'
        })
    }

})



router.get('/post/:id', auth,async (req,res) => {
    const post = await Post.find({user: req.params.id}).populate('user')
    res.send(post.reverse())
})

router.get('/newposts', auth, async(req, res) => {
    
    const posts = await Post.find({},
        null,
    {
        sort: {
            createdAt: -1
        }
    }).populate('user')
    
    res.send(posts.filter(post => 
        
        req.user.following.includes( post.user._id ) ||

         post.user._id.toString() === req.user._id.toString()  
        
        ))
  
})

router.get('/newposts/explore', auth, async(req, res) => {
    
    const posts = await Post.find({},
        null,
    {
        sort: {
            createdAt: -1
        }
    }).populate('user')
    
    res.send(posts.filter(post => 
        
        !req.user.following.includes( post.user._id ) ||

         post.user._id.toString() === req.user._id.toString()  
        
        ))
  
})


router.get('/post/:id', auth, async (req, res) => {

    const id = req.params.id
    const post = await Post.findById(id)

    res.send({
        likes : post.like.length
    })

})

module.exports = router