const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage}= require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

//SETUP SERVER WITH SOCKET
const app = express()
const server=http.createServer(app)
const io = socketio(server)

//PATHS
const publicPath = app.use(express.static(path.join(__dirname,'../public')))

//SETUP SOCKETS
io.on('connection',(socket)=>{
  

    //HANDLE JOIN

    socket.on('join',({username,room},callback)=>{
        //JOIN USER TO ROOM
        const {error,user}=addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }


        socket.join(user.room)
        //SEND A WELCOME MESSAGE

        socket.emit('message',generateMessage('admin','Welcome !'))

        //LET USERS KNOW A NEW USER HAS JOINED

        socket.broadcast.to(user.room).emit('message',generateMessage('admin',`${user.username} has joined`))  
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    //HANDLE SENDMESSAGE EVENT

    socket.on('sendMessage',(message,callback)=>{

        const user = getUser(socket.id)
        if(!user){
         return   callback('There has been an error')
        }

        const filter = new Filter()

        //CHECK THE MESSAGE FOR PROFANITY

        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }

        //SEND MESSAGE TO ALL USERS INCLUDING THE ONE WHO INITIATED THE EVENT

        io.to(user.room).emit('message',generateMessage(user.username,message))                
        
        //LET CLIENT KNOW MESSAGE WAS DELIVERED

        callback()
    })

    //LET USERS KNOW THAT A USER HAS LEFT THE CHAT

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })

    //HANDLE THE SEND LOCATION EVENT

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})

//START THE SERVER

server.listen(process.env.PORT,()=>{
    console.log('Server started on port '+process.env.PORT)
})