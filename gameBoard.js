
// our game board in which we will continue to update as user select the tiles
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let winner = '';
let isGameOver = false;
let isSuccessfulSelect = true;

// we pass in the user's role the selected row and column
function insertIntoBoard(userRole, row, col){
    //console.log("INSERT " + userRole)

    // can only play the game when the game is not over
    if(!isGameOver){

        if(gameBoard[row][col] == ''){
            gameBoard[row][col] = userRole;
            successfulSelection();
    
            checkWinner(userRole);
            if(isGameOver){
                console.log(userRole + ' wins!');
            }
    
        }else{
            failSelection();
        }
    }

    
}

function checkWinner(userRole) {

    if(gameBoard[0][0] == userRole && gameBoard[0][1] == userRole && gameBoard[0][2] == userRole)
    {
        winner = userRole;
        gameOver();
    }else if(gameBoard[1][0] == userRole && gameBoard[1][1] == userRole && gameBoard[1][2] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[2][0] == userRole && gameBoard[2][1] == userRole && gameBoard[2][2] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[0][0] == userRole && gameBoard[1][0] == userRole && gameBoard[2][0] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[0][1] == userRole && gameBoard[1][1] == userRole && gameBoard[2][1] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[0][2] == userRole && gameBoard[1][2] == userRole && gameBoard[2][2] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[0][0] == userRole && gameBoard[1][1] == userRole && gameBoard[2][2] == userRole){
        winner = userRole;
        isGameOver = true;
    }else if(gameBoard[0][2] == userRole && gameBoard[1][1] == userRole && gameBoard[2][0] == userRole){
        winner = userRole;
        isGameOver = true;
    }
}

function printBoard(){
    console.log(gameBoard);
}

function successfulSelection(){
    isSuccessfulSelect = true;
}

function failSelection(){
    isSuccessfulSelect = false;
}

function getIsSucessfulSelect(){
    return isSuccessfulSelect;
}

function gameOver(){
    isGameOver = true;
}

function getIsGameOver(){
    return isGameOver;
}

function getGameBoard(){
    return gameBoard;
}

// TODO: Check for Tie game

module.exports = {insertIntoBoard, printBoard, getIsSucessfulSelect, getIsGameOver, getGameBoard};