const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Comment = require('../models/comments')
const uid = require('uuid-random')

/*upload image configuration*/
const multer = require('multer')
const URL = "http://localhost:3000/"
const storage = multer.diskStorage({
    destination(req,file, cb){
        cb(null,'./upload/commentPic')

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


router.post('/comment/:id', auth, upload.single('commentPic'),async (req,res) => {
    const comment = new Comment(req.body)
    comment.avatar =  URL + req.file.path.replace('upload/','').trim()
    comment.user = req.user._id
    comment.post = req.params.id
    await comment.save()
    req.user.comment.push(comment._id)
    await req.user.save()
    const response = await comment.save()

    res.send(response)
})  

module.exports = router