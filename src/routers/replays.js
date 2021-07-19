const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const uid = require('uuid-random')
const Replay = require('../models/replay')

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


router.post('/replay/:id', auth, upload.single('replayPic'),async (req,res) => {

    const replay = new Replay(req.body)
    if (req.file){
        replay.avatar =  URL + req.file.path.replace('upload/','').trim()
    }    
    replay.user = req.user._id
    replay.comment = req.params.id
    await replay.save()
    const response = await replay.save()

    res.send(response)
})

module.exports = router