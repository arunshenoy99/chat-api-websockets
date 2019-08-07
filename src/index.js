const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const Filter = require('bad-words')

//SETUP SERVER WITH SOCKET
const app = express()
const server=http.createServer(app)
const io = socketio(server)

//PATHS
const publicPath = app.use(express.static(path.join(__dirname,'../public')))


io.on('connection',(socket)=>{
    console.log('New WebSocket')
    socket.emit('message','Welcome')
    socket.broadcast.emit('message','A new user has joined the chat')        //SEND TO EVERY SOCKET EXCEPT THIS ONE

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }

        io.emit('message',message)          //SEND TO EVERY SOCKET INCLUDING THIS ONE
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message','A user has left the chat')
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})


server.listen(process.env.PORT,()=>{
    console.log('Server started on port '+process.env.PORT)
})