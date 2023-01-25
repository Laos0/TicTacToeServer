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
let score = require('./score');

// hashmap to keep track of the role of the player
let playersHashMap = new Map();

// hashmap to keep track of player's flashing letter
let playersAnimation = new Map();

let currentPlayer = 'X';

// when a user connects to socket on client side, this will trigger
io.on("connection", (socket) => {
    console.log('User: ' + socket.id + ' connected');

    let role = playerRole.assignRole();

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

    // TODO: once the game is over we will listen to a restart button on client side to reset the board game
    socket.on('restart', (data) => {
        if(data){
            console.log('Game is restarting...');

            // TODO: Need to reset nodejs server OR reset the board game, reset boardGame.resetGameOver()
            boardGame.resetGameOver();
            boardGame.clearBoard();
            boardGame.clearWinTiles();
            console.log("The current player after restarting is: ", currentPlayer);
            console.log('The boolean for gameOver is: ' + boardGame.getIsGameOver());
            console.log(boardGame.getGameBoard());
            // TODO: emit to client once everything has been resetted so client side knows when to refresh webpage
            io.emit('restartComplete', {gameBoard: boardGame.getGameBoard(), curPlayer: currentPlayer});
        }
    });

    // when a user disconnects from socket, this will trigger
    socket.on('disconnect', (socket) => {
        
        // 1: When user disconnects, we need to put their role back into our array
        playerRole.returnRole(role);
    })

});

io.listen(port);
