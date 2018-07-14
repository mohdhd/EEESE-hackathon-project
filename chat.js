const socket = require('socket.io')
const User = require('./models/user')
module.exports.chat = server => {
    const io = socket(server);
    io.on('connection', socket => {

        socket.on('chat', data => {

            User.update(
            	{ username: data.username },
            	{  $push: {messages: {
                    author: data.sender,
                    body: data.message}}
            }).then(response => {
                console.log(response)
            })
        })
        
    })
}