//import mongoose module
const mongoose = require('mongoose')

//connect to database server
mongoose.connect('mongodb://localhost:27017/spotify',{
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify:false 
    })