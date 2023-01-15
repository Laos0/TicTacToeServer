const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

server.listen(port, () => {
    console.log("Server is running on *port: " + port);
});