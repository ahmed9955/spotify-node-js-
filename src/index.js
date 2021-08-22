//database config
require('./db/mongoose')

//declare express server
const express = require('express')
const cors = require('cors')
const formData = require('express-form-data');


//setup routers
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const commentRouter = require('./routers/comments')
const replayRouter = require('./routers/replays')
const followersRouter = require('./routers/userFollowers')

//server config
const app = express()
const os = require('os')
const port = process.env.PORT || 2000


app.use(formData.format());
app.use(formData.stream());


//generate json response
app.use(express.json())


//set routers
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)
app.use(replayRouter)
app.use(followersRouter)


//specify root of files
app.use(express.static('upload'))

app.use(cors())

//start server on port 2000
app.listen(port, () => {
    console.log('server running on port '+ port)
})