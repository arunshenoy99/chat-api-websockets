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

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message
    })
    $messages.insertAdjacentHTML('beforeend',html)               //ADDS MESSGAES TO THE BOTTOM
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')          //DISABLE BUTTON UNTIL EVENT FINISHED
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')              //ENABLE BUTTON
        $messageFormInput.value=''                                      //CLEAR THE FIELD
        $messageFormInput.focus()                                       //REFOCUS FROM BUTTON TO FIELD
        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

document.querySelector('#sendlocation').addEventListener('click',()=>{
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