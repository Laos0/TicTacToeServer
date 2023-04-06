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
const timer = require('./countDown');
const switchP = require('./switchPlayer');


// hashmap to keep track of the role of the player
let playersHashMap = new Map();

let currentPlayer = 'X';
let numOfClients = 0;
let maxCapacity = 4; // a total of only 4 clients

// store nextSocket

// variable flags for timer control
let hasTimerStart = false;
let isTimerUp = false;

// the player socket
let soc = null;



// get request to show that the server is running
app.get('/', (req,res) => {
    res.json({message: 'Server is running...', serverStatus: 'running'});
});

// get request to show the number of clients connected to socket
app.get('/clients', (req, res) => {
    res.send("There are " + numOfClients + " connected to the server");
});

// console.log("BEFORE IF STATEMENT: " + numOfClients);


// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    // increase the number of clients on the server
    numOfClients++;

    // set socket, so we can use it in another file
    soc = socket;

    // testing purposes
    //console.log('User: ' + socket.id + ' connected');
    //console.log(" The number of clients connected: " + numOfClients);

    // Send the current number of clients to client-side
    socket.emit('getClientCount', numOfClients);

    // If max capacity, send the total clients out to client-side
    if(numOfClients > maxCapacity){
        socket.emit('maxCapacity', {totalClients: numOfClients});
    }

    // assigning the role to the player connected
    let role = playerRole.assignRole();
    //console.log('role: ' + role)

    // get the updated board for spectators when they join
    socket.emit('updatedBoard', {boardGame: boardGame.getGameBoard(), xScore: score.getXScore(), oScore: score.getOScore()});
    socket.emit('getCurPlayer', {curPlayer: currentPlayer});

    // emit an available role such as X or O to all clients
    // this is needed to assign role to new clients when player X or O disconnects
    if(!playerRole.isEmpty()){
        io.emit('getAvailableRole', {playerRole: playerRole.availableRole});
    }else{
        //console.log(applyColor.red, 'Role is undefined ' + playerRole.availableRole());
        //console.log(applyColor.resetColor);
    };

    // 1: Assign player's role
    socket.emit('userRole', role);

    // TODO: start the timer if hasTimerStart === false and player X is connected, 
    // doing this will make it run once regardless of how many socket connects
    // TODO: possible issue: 
    if(!timer.getHasTimerStarted() && role === 'X'){
        //console.log('Server.js the io is', io);
        // start the timer and the socket of this player
        startTimerToChangePlayers(io, socket);
    }

    // 2: Store the user's detail in playersHashMap
    playersHashMap.set(socket.id, role);

    // 3: Listen to player's selected tiles
    socket.on('selectedTile', (player, row, col, isAnimating) => {
        // check whos turn it is
        if(currentPlayer == player){
            // if it is the correct player's turn proceed to insert into board game
            //console.log(player + ' selected ' + row + ', ' + col);

            boardGame.insertIntoBoard(player, row, col);
            //console.log(boardGame.printBoard());

            // When player successfully selects a tile before timer ends
            if(timer.getIsTimerUp() === false){
                // stop the countdown
                timer.stopCountdown();

                // reset the count
                timer.resetCount();

                // TODO: ----------------------------------
                // Something to do with switching players when a player selects before timer ends
                //switchP.switchPlayers(io, socket, currentPlayer);
                

                // END OF TODO: ---------------------------

                if(boardGame.getIsGameOver() === false){
                    // start the timer for next player
                    startTimerToChangePlayers(io, socket);
                }

            }

            //console.log('Was selection successful? ' + boardGame.getIsSucessfulSelect());
            // if the selection was successful
            if(boardGame.getIsSucessfulSelect()){


                // if insertion was successful we have to emit it back to the client side
                // to be seen visually
                io.emit('insertionSuccessful', player, boardGame.getGameBoard());
                
                socket.emit('animationOff', false); // turn off animation of whoever just selected a tile
                

                // proceed to switch players only if game is not over
                if(!boardGame.getIsGameOver()){

                    // // change to next player
                    // if(currentPlayer == 'X'){
                    //     currentPlayer = 'O';
                    //     io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    // }else{
                    //     currentPlayer = 'X';
                    //     io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});
                    // }
                    
                    console.log('SWITCH PLAYERS on SELECT..the current player: ', currentPlayer);

                    // TODO: SWITCH PLAYER HERE 
                    currentPlayer = switchP.switchPlayers(io, socket, currentPlayer);
                    //currentPlayer = 'O';

                }else{ // if the game is over and a winner is declared

                    console.log('GAME OVER');
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

                    //console.log("The winning tiles: " + boardGame.getWinningTiles());
            
                    //console.log("THE WINNER IS: " + boardGame.getWinner());

                    boardGame.resetGameOver();
                    // TODO: Start the timer
                    setTimeout(function() {
                        startTimerToChangePlayers(io, socket);
                      }, 2000); // 1000 milliseconds = 1 second
                  
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
            //console.log(boardGame.getGameBoard());
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

        //console.log(applyColor.yellow, " the available roles after disconnect: ", playerRole.availableRole());
        //console.log(applyColor.resetColor);

    });

});

// ---------------- Functions ------------------------------


// This function starts the timer
function startTimerToChangePlayers(io, socket) {

    // if the game is not over
    if(!boardGame.getIsGameOver()){
        console.log('STARTING NEW TIMER...');
        // flag it to prevent this timer from being executed multiple times
        timer.setHasTimerStarted(true);

        // send updates to the client side of the countdown every second
        setInterval(() => {
            if(!boardGame.getIsGameOver()){
                io.emit('getCountDown', timer.getCurrentCountDown());
            }
        }, 1000);
        
        // TODO: When the timer reaches 0 and the player doesnt do anything, we need to do something
        // when the timer reaches 0, and is resolved which is the then() method
        timer.startCountdown().then(() => {
            
            console.log(applyColor.red, "CountDown finished, CP: ", currentPlayer);
            console.log(applyColor.resetColor);

            // setting the currentPlayer
            // switch player, this will also update the client currentPlayer as well

            currentPlayer = switchP.switchPlayers(io, socket, currentPlayer);

            // when it is a player's turn we need to reset the timer for their countdown
            // so it doesnt go negative
            timer.resetCount();

            console.log(applyColor.yellow, "The current player after the switch", currentPlayer);
            console.log(applyColor.resetColor);

            if(!boardGame.getIsGameOver()){
                console.log(applyColor.green, "The current player is: ", currentPlayer);
                console.log(applyColor.resetColor);

                // TODO: ISSUE: We dont want to pass in X Socket, we need the O Socket
                startTimerToChangePlayers(io, socket);
            }
        });

        //console.log('Starting the timer... and it is: ', cp + ' turn.');
        
    }
}


io.listen(port); // port 3000
server.listen(8080); // port 8080
