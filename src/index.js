//database config
require('./db/mongoose')

//declare express server
const express = require('express')

//setup routers
const userRouter = require('./routers/user')

//server config
const app = express()
const port = process.env.PORT || 3000

//generate json response
app.use(express.json())

//set routers
app.use(userRouter)

//specify root of files
app.use(express.static('upload'))

//start server on port 3000
app.listen(port, () => {
    console.log('server running on port '+port)
})