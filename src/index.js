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
const chatRouter = require('./routers/chat')
const notificationRouter = require('./routers/notifications')

//server config
const app = express()

const os = require('os');
const { request } = require('express');
const Chat = require('./models/chat');
const Notifications = require('./models/notifications');
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
app.use(chatRouter)
app.use(notificationRouter)

//specify root of files
app.use(express.static('upload'))

app.use(cors())

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }

})

io.on('connection',  (socket) => {
    
    //send message
    socket.on('message',async ({sender,reciever,message,color, fontWeight}) => {
        console.log({sender,reciever,message, color, fontWeight})
        const chat = new Chat({sender,reciever,message, color, fontWeight})
        const result =  await chat.save()
        if (result){
        io.emit( 'message', { sender, reciever, message, color, fontWeight } )
        }
    })

    //push notifacations
    socket.on('notifications',async ({ sender, reciever, notification }) => {

        if (notification === '') return

        const notify = new Notifications({sender, reciever, notification})
        const result = await notify.save()

        if(result){
            console.log(sender, reciever, notification)
        }
        
    })

    //notification count
    socket.on('notificationsCount', async (reciever) => {

        const notificationsCount = await Notifications.find({
            reciever,
            color: 'skyblue'
        })

        io.emit('notificationsCount', notificationsCount.length)
        
    })

})




//start server on port 2000
http.listen(port, () => {
    console.log('server running on port '+ port)
    io.on('connection', (socket) => {
        console.log("new connection: ",socket.id)
    })
})