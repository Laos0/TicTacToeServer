const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8080;
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:4200'],
    },
});


const playerRole = require('./playerRole')

// hashmap to keep track of the role of the player
let playersHashMap = new Map();

// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    console.log('User: ' + socket.id + ' connected');

    let role = playerRole.assignRole();

    // 1: Assign player's role
    socket.emit('userRole', role);

    // 2: Store the user's detail in playersHashMap
    playersHashMap.set(socket.id, role);



    // when a user disconnects from socket, this will trigger
    socket.on('disconnect', (socket) => {
        
        // 1: When user disconnects, we need to put their role back into our array
        playerRole.returnRole(role);
    })

})

io.listen(port);
// server.listen(port, () => {
//     console.log("Server is running on *port: " + port);
// });