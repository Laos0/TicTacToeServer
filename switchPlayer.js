const timer = require('./countDown');

let nextPlayer;


function test(){
    console.log('switchPlayer.js function working...');
    console.log(timer);
}

function switchPlayers(io, socket, currentPlayer){

    //  we check who the current player is and switch it 
    if(currentPlayer === 'X'){
        // turn off the current player's animation
        socket.emit('animationOff', false);

        // switch player
        currentPlayer = 'O'

        // TODO: target currentPlayer to pass to server side
        nextPlayer = 'O';

        // turn on the cyurrent player's animation
        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});

        // once current player is switched, we need to emit 
        io.emit('playerChanged', {curPlayer: currentPlayer});

        // flagging timer so its okay to run this method again
        // timer.setHasTimerStarted(false); 

      
    }else{
        // turn off the current player's animation
        socket.emit('animationOff', false);

        // switch player
        currentPlayer = 'X';

        // TODO: target currentPlayer to pass to server side
        nextPlayer = 'X';

        // turn on the cyurrent player's animation
        io.emit('animationOn', {turnAnimationOn: true, curPlayer: currentPlayer});

        // once current player is switched, we need to emit 
        io.emit('playerChanged', {curPlayer: currentPlayer});

        // flagging timer so its okay to run this method again
        //hasTimerStart = false; 
    }

}

function getNextPlayer(){
    return nextPlayer;
}

module.exports = {test, switchPlayers, getNextPlayer};