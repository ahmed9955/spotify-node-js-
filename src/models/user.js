const mongoose = require('mongoose')
const  { Schema } = mongoose;

//validate email and password
const validator = require('validator')

//hash password
const bcrypt = require('bcrypt')

//json web token library
const jwt = require('jsonwebtoken')

//user model
const userSchema = new Schema({
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
        maxlength:50,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error('please enter a valid email')
            }
        }
    },
    password: {
        type: String,
        minlength: 8,
        // required: true,
        validate (value) {

            if (!validator.isStrongPassword(value,{
                minLength: 8, 
                minLowercase: 1, 
                minUppercase: 1, 
                minNumbers: 1, 
                minSymbols: 1
            })) {
                throw new Error('weak password')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('password should\' contain "password"')
            }
        }
    },
    profileName: {
        type: String,
        unique:true,
        required: true,
        trim:true,
        maxlength:20,
        
     },
     gender: {
         type:String,
        //  required:true,
         maxlength:10,
         enum: ["male","female"],
     }, 
     tokens: [{
         token:
         {
            type: String,
         }
    }],
    birthDate: {
        type: String,
        required: true
    },
    avatar: {
        type:String
    },
    post:[
        {
            type: Schema.Types.ObjectId,
            ref:'Post'
        }
    ], 
    comment:[
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    followers:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],
    following:[
        {
            type: Schema.Types.ObjectId,
            ref:'User',
            unique: true
        }
    ],
    requests:[
        {
            type: Schema.Types.ObjectId,
            ref:'User',
            unique: true
        }
    ],
    verified:{
        type: Schema.Types.Boolean,
        default: false
    }
}, {
     timestamps: true 
})

//generate token method 
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'spotify')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//login method
userSchema.statics.findByCredentials = async function (email, password, profileName) {

    const user = await User.findOne({ $or: [
        { email },
        { profileName },
    ]})

    if (!user){
        return {
            error: "user not found"
        }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        return {
            error: "password dosnot match"
        }
    }

    return user
}

//handle output form
userSchema.statics.JSON = (response) => {
    
       const user = response.toObject()
       delete user.tokens
       delete user.password
       delete user.followers
       delete user.following
       delete user.post
       delete user.comment
       delete user.requests
       delete user.verified
    
       return user
    }
    

userSchema.statics.HandleJSON = (response) => {
    
    return response.map(res => {
        const user = res.toObject()    
        delete user.tokens
        delete user.password
        delete user.followers
        delete user.following
        delete user.post
        delete user.comment
        delete user.requests
        delete user.verified

        return user
    } )
}


//hash password before saving
userSchema.pre('save', async function (next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//create user model
const User =  mongoose.model('User', userSchema)

//export user
module.exports = User