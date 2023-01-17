// We are using modules to make our global variables more modular b
// by using modules making our codebase more maintainable

let playerCount = 2;

function decrement() {
    if(playerCount > 0){
        playerCount--;
    }
}

function getPlayerCount() {
    return playerCount;
}

module.exports = { decrement, getPlayerCount };

