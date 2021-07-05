const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/posts')
const uid = require('uuid-random')

/*upload image configuration*/
const multer = require('multer')
const URL = "http://localhost:3000/"
const storage = multer.diskStorage({
    destination(req,file, cb){
        cb(null,'./upload/postPic')

    },
   async filename(req,file,cb){
        cb(null, uid() + file.mimetype.replace('image/','.').trim())
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



router.post('/post', auth, upload.single('postPic'),async (req,res) => {
    const post = new Post(req.body)
    post.avatar =  URL + req.file.path.replace('upload/','').trim()
    post.user = req.user._id
    await post.save()
    req.user.post.push(post._id)
    await req.user.save()
    const response = await post.save()

    res.send(response)
})  

router.post('/like/:id', auth, async (req,res) => {
    const post = await Post.findById(req.params.id)
    post.like.push(req.user._id)
    const response = await post.save()

    res.send(response)
})
module.exports = router