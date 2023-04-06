const timer = require('./countDown');

let nextPlayer;


function test(){
    console.log('switchPlayer.js function working...');
    console.log(timer);
}

function switchPlayers(io, socket, cp){


    //  we check who the current player is and switch it 
    if(cp === 'X'){

        console.log('Changing to O...................');

        // turn off the current player's animation
        socket.emit('animationOff', false);

        // switch player
        // currentPlayer = 'O'

        // TODO: target currentPlayer to pass to server side
        nextPlayer = 'O';

        // turn on the current player's animation
        io.emit('animationOn', {turnAnimationOn: true, curPlayer: nextPlayer});

        // once current player is switched, we need to emit 
        io.emit('playerChanged', {curPlayer: nextPlayer});
       
      
    }else{

        console.log('Changing to X...................');

        // turn off the current player's animation
        socket.emit('animationOff', false);

        // switch player
        // currentPlayer = 'X';

        // TODO: target currentPlayer to pass to server side
        nextPlayer = 'X';
        

        // turn on the current player's animation
        io.emit('animationOn', {turnAnimationOn: true, curPlayer: nextPlayer});

        // once current player is switched, we need to emit and update client-side's current player
        io.emit('playerChanged', {curPlayer: nextPlayer});

        // flagging timer so its okay to run this method again
        //hasTimerStart = false; 
     
    }

   return nextPlayer;

}

function getNextPlayer(){
    return nextPlayer;
}

function setNextPlayer(player){
    nextPlayer = player;
}

module.exports = {test, switchPlayers, getNextPlayer, setNextPlayer};