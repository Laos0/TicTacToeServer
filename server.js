const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { port = 3000 } = process.env;
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:4200']
    },
});
const cors = require('cors');

app.use(cors());

const playerRole = require('./playerRole')
let boardGame = require('./gameBoard');
let score = require('./score');
const { Socket } = require('socket.io');
const applyColor = require('./applyColor');


// hashmap to keep track of the role of the player
let playersHashMap = new Map();

// hashmap to keep track of player's flashing letter
let playersAnimation = new Map();

let currentPlayer = 'X';
let numOfClients = 0;
let maxCapacity = 4; // a total of only 4 clients



// get request to show that the server is running
app.get('/', (req,res) => {
    res.json({message: 'Server is running...', serverStatus: 'running'});
});

// get request to show the number of clients connected to socket
app.get('/clients', (req, res) => {
    res.send("There are " + numOfClients + " connected to the server");
});

console.log("BEFORE IF STATEMENT: " + numOfClients);

// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    numOfClients++;


    // testing purposes
    console.log('User: ' + socket.id + ' connected');
    console.log(" The number of clients connected: " + numOfClients);

    // Send the current number of clients to client-side
    socket.emit('getClientCount', numOfClients);

    // If max capacity, send the total clients out to client-side
    if(numOfClients > maxCapacity){
        socket.emit('maxCapacity', {totalClients: numOfClients});
    }

    let role = playerRole.assignRole();
    console.log('role: ' + role)

    // get the updated board for spectators when they join
    socket.emit('updatedBoard', {boardGame: boardGame.getGameBoard(), xScore: score.getXScore(), oScore: score.getOScore()});

    // TODO:
    // emit an available role such as X or O to all clients
    // this is needed to assign role to new clients when player X or O disconnects
    
    if(!playerRole.isEmpty()){
        io.emit('getAvailableRole', {playerRole: playerRole.availableRole});
    }else{
        console.log(applyColor.red, 'Role is undefined ' + playerRole.availableRole());
        console.log(applyColor.resetColor);
    };

    // 1: Assign player's role
    socket.emit('userRole', role);

    // 2: Store the user's detail in playersHashMap
    playersHashMap.set(socket.id, role);

    // 3: Listen to player's selected tiles
    socket.on('selectedTile', (player, row, col, isAnimating) => {
        // check whos turn it is
        if(currentPlayer == player){
            // if it is the correct player's turn proceed to insert into board game
            //console.log(player + ' selected ' + row + ', ' + col);

            boardGame.insertIntoBoard(player, row, col);
            console.log(boardGame.printBoard());

        
            //console.log('Was selection successful? ' + boardGame.getIsSucessfulSelect());
            // if the selection was successful
            if(boardGame.getIsSucessfulSelect()){


                // if insertion was successful we have to emit it back to the client side
                // to be seen visually
                io.emit('insertionSuccessful', player, boardGame.getGameBoard());
                
                socket.emit('animationOff', false); // turn off animation of whoever just selected a tile
                

                // proceed to switch players only if game is not over
                if(!boardGame.getIsGameOver()){

                    // change to next player
                    if(currentPlayer == 'X'){
                        currentPlayer = 'O';
                        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    }else{
                        currentPlayer = 'X';
                        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    }
                }else{ // if the game is over and a winner is declared

                    // change to next player
                    if(currentPlayer == 'X'){
                        currentPlayer = 'O';
                        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    }else{
                        currentPlayer = 'X';
                        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    }

                    // increment score for the winner or do nothing if there is atie
                    score.incrementScore(boardGame.getWinner());

                    io.emit('gameOver', {message: 'The game is over', isGameOver: boardGame.getIsGameOver(), winner: boardGame.getWinner(), winTiles: boardGame.getWinningTiles(), curPlayer: currentPlayer, playerXScore: score.getXScore(), playerOScore: score.getOScore()});

                    console.log("The winning tiles: " + boardGame.getWinningTiles());
            
                    console.log("THE WINNER IS: " + boardGame.getWinner());
                }

            }else{
                console.log('it is still ' + player + ' turn');
            }

        }

    });

    // once the game is over we will listen to a restart button on client side to reset the board game
    socket.on('restart', (data) => {
        if(data){
            console.log('Game is restarting...');

            // Need to reset nodejs server OR reset the board game, reset boardGame.resetGameOver()
            boardGame.resetGameOver();
            boardGame.clearBoard();
            boardGame.clearWinTiles();
            console.log("The current player after restarting is: ", currentPlayer);
            console.log('The boolean for gameOver is: ' + boardGame.getIsGameOver());
            console.log(boardGame.getGameBoard());
            // emit to client once everything has been resetted so client side knows when to refresh webpage
            io.emit('restartComplete', {gameBoard: boardGame.getGameBoard(), curPlayer: currentPlayer});
        }
    });

    // when a user disconnects from socket, this will trigger
    socket.on('disconnect', (socket) => {
        
        // 1: When user disconnects, we need to put their role back into our array
        playerRole.returnRole(role);

        // when a user disconnects we subtract
        numOfClients--;

    });

});


io.listen(port); // port 3000
server.listen(8080); // port 8080