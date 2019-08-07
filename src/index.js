const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

//SETUP SERVER WITH SOCKET
const app = express()
const server=http.createServer(app)
const io = socketio(server)

//PATHS
const publicPath = app.use(express.static(path.join(__dirname,'../public')))

io.on('connection',()=>{
    console.log('New Connection')
})

server.listen(process.env.PORT,()=>{
    console.log('Server started on port '+process.env.PORT)
})