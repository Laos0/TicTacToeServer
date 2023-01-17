// 

let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let winner = '';
let isGameOver = false;
isGameOver = true;

// we pass in the user's role the selected row and column
function insertIntoBoard(userRole, row, col){
    if(gameBoard[row][col] == ''){
        gameBoard[row][col] == userRole;
    }

    //TODO: Check if there is a winner after insertion
    checkWinner(userRole);
}

function checkWinner(userRole) {

    if(gameBoard[0][0] == userRole && gameBoard[0][1] == userRole && gameBoard[0][2] == userRole)
    {
        winner = userRole;
        isGameOver = true;
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

// TODO: Check for Tie game

module.exports = [insertIntoBoard];