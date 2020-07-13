const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const socket = io()
//join chatbox
const chatbox = document.getElementById('chatbox').innerHTML
const to = document.getElementById('to').innerHTML
const to_name = document.getElementById('to_name').innerHTML
const from = document.getElementById('from').innerHTML
socket.emit('joinChat', { chatbox, from })


//recieve msg
socket.on('message', message => {
    outputMessage(message)
 })

 //Message submit
chatForm.addEventListener('submit', e =>{
   e.preventDefault()
   const msg = e.target.elements.msg.value
   //Sending msg to server
   socket.emit('chatMessage', {msg, chatbox, from})
   e.target.elements.msg.value = ''
   e.target.elements.msg.focus()

   //Scroll
   chatMessages.scrollTop = chatMessages.scrollHeight
})

function outputMessage(message){
   const div = document.createElement('div')
   if(message.username==to){
      div.classList.add('message')
      div.classList.add('recieved')
      div.innerHTML = `<p class="text">${message.message}</p>
                     <p class="meta">${to_name} <span>${message.time}</span></p>`
   }
   else{
      div.classList.add('message')
      div.classList.add('sent')
      div.innerHTML = `<p class="text">${message.message}</p>
                     <p class="meta">You <span>${message.time}</span></p>`
   }
   
   document.querySelector('.chat-messages').appendChild(div)
}