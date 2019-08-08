const socket = io()

//ELEMENTS

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton  = document.querySelector('#sendlocation')
const $messages = document.querySelector('#messages')

//TEMPLATES

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


//OPTIONS
const {username,room}=Qs.parse(location.search.slice(1))

//HANDLE LOCATION MESSAGE EVENT

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

//HANDLE MESSAGE EVENT

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)                      //ADDS MESSGAES TO THE BOTTOM
})

//EMIT A SENDMESSAGE EVENT

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault('HH:')

    $messageFormButton.setAttribute('disabled','disabled')              //DISABLE BUTTON UNTIL EVENT FINISHED
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')                  //ENABLE BUTTON
        $messageFormInput.value=''                                      //CLEAR THE FIELD
        $messageFormInput.focus()                                       //REFOCUS FROM BUTTON TO FIELD
        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

//EMIT A SENDLOCATION EVENT

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')     
    navigator.geolocation.getCurrentPosition((position)=>{
        const coords = {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        socket.emit('sendLocation',coords,()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join',{username,room})