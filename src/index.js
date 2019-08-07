const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage}= require('./utils/messages')

//SETUP SERVER WITH SOCKET
const app = express()
const server=http.createServer(app)
const io = socketio(server)

//PATHS
const publicPath = app.use(express.static(path.join(__dirname,'../public')))

//SETUP SOCKETS
io.on('connection',(socket)=>{
    console.log('New WebSocket')

    //SEND A WELCOME MESSAGE

    socket.emit('message',generateMessage('Welcome !'))

    //LET USERS KNOW A NEW USER HAS JOINED

    socket.broadcast.emit('message',generateMessage('A new user has joined the chat'))    

    //HANDLE SENDMESSAGE EVENT

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()

        //CHECK THE MESSAGE FOR PROFANITY

        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }

        //SEND MESSAGE TO ALL USERS INCLUDING THE ONE WHO INITIATED THE EVENT

        io.emit('message',generateMessage(message))                
        
        //LET CLIENT KNOW MESSAGE WAS DELIVERED

        callback()
    })

    //LET USERS KNOW THAT A USER HAS LEFT THE CHAT

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left the chat'))
    })

    //HANDLE THE SEND LOCATION EVENT

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})

//START THE SERVER

server.listen(process.env.PORT,()=>{
    console.log('Server started on port '+process.env.PORT)
})