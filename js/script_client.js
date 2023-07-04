const socket = io("127.0.0.1:800");

// get DOM elements in respective JS variables
const form = document.getElementById('forms');
const messageInput = document.getElementById('send');
const messageContainer = document.querySelector('.container');

// audio that will play on receiving messages
var audio = new Audio('sound.mp3');

// function which will append info to the container
const append = (message , position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// ask the new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined' , name);

// if the new user joins , receive his/her the name from the server
socket.on('user-joined' , name=>{
    append(`${name} joined the chat` , 'left')
})

// if server sends a message , receive it
socket.on('receive' , data=>{
    append(`${data.name}: ${data.message}` , 'left')
})

//  if a user leaves the chat , append the info to the container
socket.on('left' , name=>{
    append(`${name} left the chat` , 'left')
})

// if the from gets submitted , sends server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})