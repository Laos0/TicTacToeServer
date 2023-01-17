const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:4200'],
    },
});
const port = 8080;
const playerCount = require('./playerCount')

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    console.log('User: ' + socket.id + ' connected');

    // NOTE: io.emit sends data to all sockets, socket.emit sends to one socket

    // we are assigning the player based on who connects first
    if(playerCount.getPlayerCount() == 2){
        // first player to connect will always be X
        socket.emit('playerRole', 'X'); 
        playerCount.decrement();
    }else {
        // second player to connect will always be O
        socket.emit('playerRole', 'O');
        playerCount.decrement();
    }

    // testing to receive client messages
    socket.on('clientMgs', (data) => {
        console.log(data)
    })

    // when a user disconnects from socket, this will trigger
    socket.on('disconnect', (socket) => {
        console.log('user ' + socket.id + ' disconnected');
    })

})

io.listen(port);
// server.listen(port, () => {
//     console.log("Server is running on *port: " + port);
// });