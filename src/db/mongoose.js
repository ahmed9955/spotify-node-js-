//import mongoose module
const mongoose = require('mongoose')

//connect to database server
mongoose.connect('mongodb://localhost:27017/Twitter',{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,  
        useFindAndModify:false 
    })