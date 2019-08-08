const users = []

//ADD USER

const addUser = ({id,username,room})=>{
    //CLEAN THE DATA
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //VALIDATE THE DATA
    if(!username || !room){
        return {
            error:'Username and room are required'
        }
    }

    //CHECK FOR EXISTING USER
    const existingUser = users.find((user)=>{
        return user.room===room && user.username===username
    })

    //VALIDATE USERNAME
    if(existingUser){
        return{
            error:"Username already taken!"
        }
    }

    //STORE USER 
    const user = {id,username,room}
    users.push(user)
    return {user}
}

//REMOVE USER

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

//GET USER

const getUser = (id)=>{
    const foundUser = users.find((user)=>user.id===id)
    if(!foundUser){
        return {
            error:'No user found'
        }
    }
    return user
}

//GET USERS IN ROOM

const getUsersInRoom = (room)=>{
    const roomUsers = users.filter((user)=>user.room===room)
    if(!roomUsers){
        return{
            error:'No users in room'
        }
    }
    return roomUsers
}

module.exports={
    getUser,
    getUsersInRoom,
    removeUser,
    addUser
}