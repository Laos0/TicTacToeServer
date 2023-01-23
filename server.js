const express = require('express');
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
let boardGame = require('./gameBoard');

// hashmap to keep track of the role of the player
let playersHashMap = new Map();

let currentPlayer = 'X';

// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    console.log('User: ' + socket.id + ' connected');

    let role = playerRole.assignRole();

    // 1: Assign player's role
    socket.emit('userRole', role);

    // 2: Store the user's detail in playersHashMap
    playersHashMap.set(socket.id, role);

    // 3: Listen to player's selected
    socket.on('selectedTile', (player, row, col) => {
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

                // proceed to switch players only if game is not over
                if(!boardGame.getIsGameOver()){

                    // change to next player
                    if(currentPlayer == 'X'){
                        currentPlayer = 'O';
                    }else{
                        currentPlayer = 'X';
                    }
                }else{ // if the game is over and a winner is declared
                    io.emit('gameOver', {message: 'The game is over', isGameOver: boardGame.getIsGameOver(), winner: boardGame.getWinner(), winTiles: boardGame.getWinningTiles()});
                    console.log("The winning tiles: " + boardGame.getWinningTiles());
            
                    console.log("THE WINNER IS: " + boardGame.getWinner());
                }

            }else{
                console.log('it is still ' + player + ' turn');
            }

        }

    });

    // TODO: once the game is over we will listen to a restart button on client side to reset the board game
    socket.on('restart', (data) => {
        if(data){
            console.log('Game is restarting...');

            // TODO: Need to reset nodejs server OR reset the board game, reset boardGame.resetGameOver()
            // TODO: emit to client once everything has been resetted so client side knows when to refresh webpage
        }
    });

    // when a user disconnects from socket, this will trigger
    socket.on('disconnect', (socket) => {
        
        // 1: When user disconnects, we need to put their role back into our array
        playerRole.returnRole(role);
    })

});

io.listen(port);
