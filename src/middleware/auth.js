//json web token
const jwt = require('jsonwebtoken')
//import user model
const User = require('../models/user')

//middleware authentication method
const auth = async (req,res,next) => {

    try{
        //get token from header
        const token = req.header('Authorization').replace('Bearer','').trim()
        //make sure that this is available token
        const decode =  jwt.verify(token, 'spotify')
        //find logged in user
        user = await User.findOne({ _id:decode._id, 'tokens.token' : token })
        
        //check that user is found
        if (!user) {
            throw new Error('not autorized')
        }

        //save user into request
        req.user = user
        //save token into request
        req.token = token
        
        next()

    } catch (e) {
        res.status(401).send({
            error: 'authentication error!'
        })
    }

}

//export module
module.exports = auth