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

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

io.on("connection", (socket) => {
    console.log('a user connected');

    // we have to put this here to ensure that we are connected before sending out
    // messages
    socket.on('message', (mgs) => {
        console.log('message: ' + mgs);
        socket.emit('serverMessage', "Hello from server!");
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

})

io.listen(port);
// server.listen(port, () => {
//     console.log("Server is running on *port: " + port);
// });